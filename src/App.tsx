import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DTERequirementsPage } from './pages/public/DTERequirementsPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { EmitirDTEPage } from './pages/admin/EmitirDTEPage';
import { CicloDeVidaPage } from './pages/admin/CicloDeVidaPage';
import { CertificacionMaullinPage } from './pages/admin/CertificacionMaullinPage';
import { BovedaPage } from './pages/admin/BovedaPage';
import { IntercambioComercialPage } from './pages/admin/IntercambioComercialPage';
import { ConsultaTrackIdPage } from './pages/public/ConsultaTrackIdPage';
import type { UserRole, SiiEnvironment } from './types';

export const App: React.FC = () => {
  const [currentRole, setRole] = useState<UserRole>('admin');
  const [environment, setEnvironment] = useState<SiiEnvironment>('certificacion');

  return (
    <BrowserRouter>
      <Layout 
        currentRole={currentRole} 
        setRole={setRole}
        environment={environment}
        setEnvironment={setEnvironment}
      >
        <Routes>
          {/* Landing / Login & Selection */}
          <Route 
            path="/" 
            element={
              <LoginPage 
                setRole={setRole} 
                environment={environment} 
                setEnvironment={setEnvironment} 
              />
            } 
          />

          {/* DTE Normative & PMV Requirements Matrix */}
          <Route path="/requirements" element={<DTERequirementsPage />} />

          {/* Admin & Operations */}
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/emitir" element={<EmitirDTEPage />} />
          <Route path="/admin/ciclo-de-vida" element={<CicloDeVidaPage />} />
          <Route path="/admin/certificacion" element={<CertificacionMaullinPage />} />
          <Route path="/admin/boveda" element={<BovedaPage />} />
          <Route path="/admin/intercambio" element={<IntercambioComercialPage />} />

          {/* Public Track ID & DTE Lookup */}
          <Route path="/consulta" element={<ConsultaTrackIdPage />} />

          {/* Catch-all redirect to / */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
