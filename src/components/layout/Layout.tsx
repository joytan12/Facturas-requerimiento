import React from 'react';
import { Header } from '../common/Header';
import { Sidebar } from '../common/Sidebar';
import type { UserRole, SiiEnvironment } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  environment: SiiEnvironment;
  setEnvironment: (env: SiiEnvironment) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentRole, 
  setRole, 
  environment, 
  setEnvironment 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-dte-bg">
      <Header 
        currentRole={currentRole} 
        setRole={setRole} 
        environment={environment} 
        setEnvironment={setEnvironment} 
      />
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar currentRole={currentRole} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
