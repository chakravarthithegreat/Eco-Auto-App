import React, { useEffect, useState } from 'react';
import { useAuthStore } from './state/authStore';
import Login from './components/auth/Login';
import MainLayout from './layouts/MainLayout';
import { DarkModeProvider } from './contexts/DarkModeContext';
import DashboardSkeleton from './components/ui/DashboardSkeleton';

function App() {
  console.log('App component rendering...');
  
  try {
    // Use a more reliable way to access the auth store
    const authStore = useAuthStore();
    const { isAuthenticated, hasHydrated, user } = authStore;
    
    const [isStoreReady, setIsStoreReady] = useState(false);
    
    console.log('App state:', { isAuthenticated, hasHydrated, user, isStoreReady });

    useEffect(() => {
      // Wait for auth store to hydrate
      if (hasHydrated !== undefined) {
        setIsStoreReady(true);
      }
      
      // Fallback: if hydration takes too long, proceed anyway
      const timeout = setTimeout(() => {
        if (!isStoreReady) {
          console.log('Auth store hydration timeout - proceeding anyway');
          setIsStoreReady(true);
        }
      }, 3000);
      
      return () => clearTimeout(timeout);
    }, [hasHydrated, isStoreReady]);

    console.log('App rendering - with hydration handling, isAuthenticated:', isAuthenticated, 'hasHydrated:', hasHydrated, 'user:', user);

    // Show loading state while store is hydrating
    if (!isStoreReady) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background-gray">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading application...</p>
          </div>
        </div>
      );
    }

    // Show login screen if not authenticated
    if (!isAuthenticated) {
      console.log('App: Showing login screen');
      return <Login />;
    }

    // Show skeleton while loading main layout
    if (!user) {
      console.log('App: Showing dashboard skeleton');
      return <DashboardSkeleton />;
    }

    // Show main application when authenticated
    console.log('App: Showing main layout');
    return (
      <DarkModeProvider>
        <MainLayout />
      </DarkModeProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-500">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading App</h1>
          <p className="text-lg mb-4">{error.message}</p>
          <pre className="text-sm bg-black/20 p-4 rounded">{error.stack}</pre>
        </div>
      </div>
    );
  }
}

export default App;