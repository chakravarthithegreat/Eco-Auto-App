#!/usr/bin/env node

/**
 * MongoDB Setup Script for Artgifts Manufacturing App
 * This script helps set up MongoDB connection for the application
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 MongoDB Setup for Artgifts Manufacturing App');
console.log('================================================\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupMongoDB() {
  try {
    console.log('Choose your MongoDB setup option:\n');
    console.log('1. Local MongoDB (MongoDB Community Server)');
    console.log('2. MongoDB Atlas (Cloud Database)');
    console.log('3. Skip setup (use default local connection)\n');

    const choice = await askQuestion('Enter your choice (1-3): ');

    let mongoUri = '';
    let envContent = '';

    switch (choice) {
      case '1':
        console.log('\n📋 Local MongoDB Setup');
        console.log('Make sure MongoDB Community Server is installed and running on your machine.');
        console.log('Default connection: mongodb://localhost:27017/artgifts_manufacturing');
        
        const localPort = await askQuestion('Enter MongoDB port (default: 27017): ') || '27017';
        const localDbName = await askQuestion('Enter database name (default: artgifts_manufacturing): ') || 'artgifts_manufacturing';
        
        mongoUri = `mongodb://localhost:${localPort}/${localDbName}`;
        break;

      case '2':
        console.log('\n☁️ MongoDB Atlas Setup');
        console.log('Please provide your MongoDB Atlas connection string.');
        console.log('Format: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority\n');
        
        const atlasUri = await askQuestion('Enter your MongoDB Atlas connection string: ');
        if (!atlasUri.includes('mongodb+srv://')) {
          console.log('❌ Invalid MongoDB Atlas connection string format');
          process.exit(1);
        }
        mongoUri = atlasUri;
        break;

      case '3':
        console.log('\n⏭️ Using default local MongoDB connection');
        mongoUri = 'mongodb://localhost:27017/artgifts_manufacturing';
        break;

      default:
        console.log('❌ Invalid choice');
        process.exit(1);
    }

    // Create .env file
    envContent = `# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=${mongoUri}

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:4173,https://artgifts.com

# JWT Configuration (for future authentication)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
`;

    const envPath = path.join(__dirname, '.env');
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ MongoDB configuration saved to .env file');
    console.log(`📡 Connection URI: ${mongoUri}`);
    
    if (choice === '2') {
      console.log('\n🔒 Security Note:');
      console.log('- Make sure to add .env to your .gitignore file');
      console.log('- Never commit your MongoDB Atlas credentials to version control');
      console.log('- Consider using environment variables in production');
    }

    console.log('\n📋 Next Steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Start the server: npm run dev');
    console.log('3. The database will be automatically seeded with sample data');
    console.log('4. Access the API at: http://localhost:3001');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️ .env file already exists');
  rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      setupMongoDB();
    } else {
      console.log('Setup cancelled');
      rl.close();
    }
  });
} else {
  setupMongoDB();
}
