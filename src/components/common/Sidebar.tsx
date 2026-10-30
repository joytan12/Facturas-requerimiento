import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus2, 
  GitFork, 
  KeyRound, 
  Award, 
  Inbox, 
  Search, 
  CheckSquare, 
  LogIn,
  Layers,
  Shield,
  FileCode2,
  Workflow
} from 'lucide-react';
import type { UserRole } from '../../types';

interface SidebarProps {
  currentRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-sm select-none">
      <div className="space-y-6">
        
        {/* Navigation Section */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Módulos del Sistema
          </div>
          <nav className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                  isActive ? 'bg-blue-50 text-dte-primary border-l-4 border-dte-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-dte-primary'
                }`
              }
            >
              <LogIn className="w-4 h-4 mr-2.5 text-slate-400" />
              Acceso y Configuración
            </NavLink>

            {/* PMV Requirements Checklist Page */}
            <NavLink
              to="/requirements"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                  isActive ? 'bg-dte-primary text-white shadow-md' : 'text-dte-primary bg-amber-50/70 border border-amber-200 hover:bg-amber-100 font-bold'
                }`
              }
            >
              <CheckSquare className="w-4 h-4 mr-2.5 text-amber-500" />
              Matriz Requerimientos DTE
            </NavLink>

            {/* Core Operations Flow */}
            <div className="pt-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Motor DTE & Emisión
              </div>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive ? 'bg-blue-50 text-dte-primary font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4 mr-2.5 text-blue-900" />
                Dashboard Operativo SII
              </NavLink>

              <NavLink
                to="/admin/emitir"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive ? 'bg-blue-50 text-dte-primary font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <FilePlus2 className="w-4 h-4 mr-2.5 text-amber-600" />
                Emisión & Motor XMLDSig
              </NavLink>

              <NavLink
                to="/admin/ciclo-de-vida"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive ? 'bg-blue-50 text-dte-primary font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Workflow className="w-4 h-4 mr-2.5 text-indigo-600" />
                Simulador Ciclo de Vida
              </NavLink>
            </div>

            {/* Cryptography & Certification */}
            <div className="pt-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Seguridad & Certificación
              </div>
              <NavLink
                to="/admin/boveda"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive ? 'bg-blue-50 text-dte-primary font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <KeyRound className="w-4 h-4 mr-2.5 text-emerald-600" />
                Bóveda Criptográfica (.pfx / CAF)
              </NavLink>

              <NavLink
                to="/admin/certificacion"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive ? 'bg-blue-50 text-dte-primary font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Award className="w-4 h-4 mr-2.5 text-amber-600" />
                Ambiente Maullín (Certificación)
              </NavLink>
            </div>

            {/* Commercial & Traceability */}
            <div className="pt-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Intercambio & Trazabilidad
              </div>
              <NavLink
                to="/admin/intercambio"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive ? 'bg-blue-50 text-dte-primary font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Inbox className="w-4 h-4 mr-2.5 text-cyan-600" />
                Intercambio Comercial (Ley 19.983)
              </NavLink>

              <NavLink
                to="/consulta"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive ? 'bg-blue-50 text-dte-primary font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Search className="w-4 h-4 mr-2.5 text-slate-500" />
                Consulta Pública de Track ID
              </NavLink>
            </div>

          </nav>
        </div>

      </div>

      {/* Footer Info Box */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between font-bold text-slate-700">
          <span>Esquema SII</span>
          <span className="text-emerald-600 font-mono">DTE_v10.xsd</span>
        </div>
        <p className="text-[10px] leading-tight">
          RSA-SHA1 con Canonicalización W3C C14N e ISO-8859-1 estricta.
        </p>
      </div>
    </aside>
  );
};
