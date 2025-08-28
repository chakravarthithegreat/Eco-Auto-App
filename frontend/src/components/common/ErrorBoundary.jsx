import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
     
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-white dark:bg-dark-surface border border-light-bg-secondary dark:border-dark-bg-secondary rounded-2xl p-6 shadow-glass-md">
            <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
            <p className="text-sm opacity-80 mb-4">The page failed to render. Try reloading. If it persists, share the error below.</p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="text-xs overflow-auto bg-light-bg-secondary dark:bg-dark-bg-secondary p-3 rounded-lg">
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

