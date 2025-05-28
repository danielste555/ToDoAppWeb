import React, { ReactNode } from 'react';
import Sidebar from '../components/sidebar';
import './styles/mainLayout.css';

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
