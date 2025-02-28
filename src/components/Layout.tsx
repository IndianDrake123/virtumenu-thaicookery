import React from 'react';
import { NavigationBar } from './NavigationBar';
import { CRMNavigation } from './CRMNavigation';
import { useCRM } from '@/context/CRMContext';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { currentCustomer } = useCRM();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {currentCustomer ? <CRMNavigation /> : <NavigationBar />}
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-gray-100 border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Thai Cookery. All rights reserved.</p>
          <p className="mt-1">Made with ❤️ for delicious food.</p>
        </div>
      </footer>
    </div>
  );
};
