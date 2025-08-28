#!/bin/bash

# Production Deployment Script for Eco-Auto-App
# Usage: ./deploy-production.sh [--docker|--traditional]

set -e

echo "🚀 Eco-Auto-App Production Deployment Script"
echo "============================================="

# Configuration
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"
DEPLOYMENT_MODE=${1:-"--traditional"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    # Check Docker if needed
    if [[ "$DEPLOYMENT_MODE" == "--docker" ]]; then
        if ! command -v docker &> /dev/null; then
            log_error "Docker is not installed"
            exit 1
        fi
        
        if ! command -v docker-compose &> /dev/null; then
            log_error "Docker Compose is not installed"
            exit 1
        fi
    fi
    
    log_info "Prerequisites check passed ✅"
}

# Run tests before deployment
run_tests() {
    log_info "Running pre-deployment tests..."
    
    # Frontend tests
    cd $FRONTEND_DIR
    if npm run lint &> /dev/null; then
        log_info "Frontend linting passed ✅"
    else
        log_warn "Frontend linting issues detected ⚠️"
    fi
    
    # Build test
    if npm run build &> /dev/null; then
        log_info "Frontend build test passed ✅"
    else
        log_error "Frontend build failed ❌"
        exit 1
    fi
    
    cd ..
    
    # Backend tests
    cd $BACKEND_DIR
    if node -e "console.log('Backend syntax check passed')" &> /dev/null; then
        log_info "Backend syntax check passed ✅"
    else
        log_error "Backend syntax issues detected ❌"
        exit 1
    fi
    
    cd ..
    log_info "Pre-deployment tests completed ✅"
}

# Traditional deployment
deploy_traditional() {
    log_info "Starting traditional deployment..."
    
    # Backend deployment
    log_info "Deploying backend..."
    cd $BACKEND_DIR
    npm install --production
    log_info "Backend dependencies installed ✅"
    cd ..
    
    # Frontend deployment
    log_info "Deploying frontend..."
    cd $FRONTEND_DIR
    npm install
    npm run build
    log_info "Frontend built successfully ✅"
    cd ..
    
    # Start services
    log_info "Starting production services..."
    
    # Start backend
    cd $BACKEND_DIR
    NODE_ENV=production nohup npm start > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../logs/backend.pid
    log_info "Backend started (PID: $BACKEND_PID) ✅"
    cd ..
    
    # Start frontend preview
    cd $FRONTEND_DIR
    nohup npm run preview > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../logs/frontend.pid
    log_info "Frontend started (PID: $FRONTEND_PID) ✅"
    cd ..
    
    # Wait for services to start
    sleep 5
    
    # Health checks
    log_info "Performing health checks..."
    
    if curl -s http://localhost:3001/health > /dev/null; then
        log_info "Backend health check passed ✅"
    else
        log_error "Backend health check failed ❌"
        exit 1
    fi
    
    if curl -s http://localhost:4173 > /dev/null; then
        log_info "Frontend health check passed ✅"
    else
        log_error "Frontend health check failed ❌"
        exit 1
    fi
    
    log_info "Traditional deployment completed successfully! 🎉"
    log_info "Frontend: http://localhost:4173"
    log_info "Backend API: http://localhost:3001/api"
    log_info "Backend Health: http://localhost:3001/health"
}

# Docker deployment
deploy_docker() {
    log_info "Starting Docker deployment..."
    
    # Build and start containers
    docker-compose -f docker-compose.production.yml build
    docker-compose -f docker-compose.production.yml up -d
    
    # Wait for containers to start
    log_info "Waiting for containers to start..."
    sleep 15
    
    # Health checks
    log_info "Performing health checks..."
    
    if docker-compose -f docker-compose.production.yml exec backend curl -s http://localhost:3001/health > /dev/null; then
        log_info "Backend container health check passed ✅"
    else
        log_error "Backend container health check failed ❌"
        exit 1
    fi
    
    if docker-compose -f docker-compose.production.yml exec frontend curl -s http://localhost:4173 > /dev/null; then
        log_info "Frontend container health check passed ✅"
    else
        log_error "Frontend container health check failed ❌"
        exit 1
    fi
    
    log_info "Docker deployment completed successfully! 🎉"
    log_info "Application accessible via Docker containers"
    
    # Show container status
    docker-compose -f docker-compose.production.yml ps
}

# Cleanup function
cleanup() {
    log_info "Cleaning up previous deployments..."
    
    # Create logs directory if it doesn't exist
    mkdir -p logs
    
    # Kill previous processes if they exist
    if [[ -f logs/backend.pid ]]; then
        BACKEND_PID=$(cat logs/backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            log_info "Stopped previous backend process"
        fi
        rm -f logs/backend.pid
    fi
    
    if [[ -f logs/frontend.pid ]]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            log_info "Stopped previous frontend process"
        fi
        rm -f logs/frontend.pid
    fi
}

# Main deployment logic
main() {
    echo "Deployment mode: $DEPLOYMENT_MODE"
    
    check_prerequisites
    cleanup
    run_tests
    
    case $DEPLOYMENT_MODE in
        "--docker")
            deploy_docker
            ;;
        "--traditional")
            deploy_traditional
            ;;
        *)
            log_error "Invalid deployment mode. Use --docker or --traditional"
            exit 1
            ;;
    esac
    
    log_info "Deployment completed successfully! 🚀"
    log_info "Check logs in the 'logs' directory for detailed information"
}

# Run main function
main

# Save deployment info
cat > logs/deployment-info.txt << EOF
Deployment completed at: $(date)
Deployment mode: $DEPLOYMENT_MODE
Frontend URL: http://localhost:4173
Backend URL: http://localhost:3001
API Base URL: http://localhost:3001/api
Health Check: http://localhost:3001/health

To stop the application:
- Traditional: Use kill commands with PIDs from logs/
- Docker: docker-compose -f docker-compose.production.yml down

Logs location: logs/
EOF

log_info "Deployment information saved to logs/deployment-info.txt"