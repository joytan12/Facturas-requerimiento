import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  Server, 
  KeyRound, 
  RefreshCw, 
  Building2, 
  CheckCircle,
  FileSpreadsheet,
  Globe2
} from 'lucide-react';
import type { UserRole, SiiEnvironment } from '../../types';

interface HeaderProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  environment: SiiEnvironment;
  setEnvironment: (env: SiiEnvironment) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentRole, 
  setRole, 
  environment, 
  setEnvironment 
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshingToken, setIsRefreshingToken] = useState(false);
  const [tokenTimeLeft, setTokenTimeLeft] = useState(48);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/consulta?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRefreshToken = () => {
    setIsRefreshingToken(true);
    setTimeout(() => {
      setIsRefreshingToken(false);
      setTokenTimeLeft(60);
    }, 900);
  };

  return (
    <header className="bg-dte-primary text-white border-b border-blue-950 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo & Brand */}
        <div 
          className="flex items-center space-x-3 cursor-pointer select-none" 
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center font-headline font-black text-slate-950 text-xl shadow-lg border border-amber-300">
            DTE
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-headline text-lg font-bold tracking-tight text-white">
                Facturación<span className="text-amber-400">SII</span>
              </span>
              <span className="text-[10px] bg-blue-900/90 text-blue-200 border border-blue-700 px-1.5 py-0.2 rounded font-mono font-bold">
                CL
              </span>
            </div>
            <span className="block text-[10px] text-blue-300 tracking-wider font-mono">
              MOTOR CRIPTOGRÁFICO & DTE
            </span>
          </div>
        </div>

        {/* Global Search Bar (Track ID or Folio) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar Track ID (10 dígitos) o Folio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-blue-950/70 border border-blue-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-blue-300 absolute left-2.5 top-2" />
          </div>
        </form>

        {/* Environment Toggle (Maullín vs Palena) */}
        <div className="hidden lg:flex items-center space-x-2 bg-blue-950/90 p-1 rounded-xl border border-blue-800/80 text-xs">
          <button
            onClick={() => setEnvironment('certificacion')}
            className={`flex items-center px-2.5 py-1 rounded-lg transition-all font-semibold ${
              environment === 'certificacion'
                ? 'bg-amber-500 text-slate-950 shadow font-bold'
                : 'text-blue-200 hover:text-white'
            }`}
            title="Servidores maullin.sii.cl y pangal.sii.cl"
          >
            <Server className="w-3.5 h-3.5 mr-1" />
            Maullín (Certificación)
          </button>
          <button
            onClick={() => setEnvironment('produccion')}
            className={`flex items-center px-2.5 py-1 rounded-lg transition-all font-semibold ${
              environment === 'produccion'
                ? 'bg-emerald-600 text-white shadow font-bold'
                : 'text-blue-200 hover:text-white'
            }`}
            title="Servidores palena.sii.cl y rahue.sii.cl"
          >
            <Globe2 className="w-3.5 h-3.5 mr-1" />
            Palena (Producción)
          </button>
        </div>

        {/* SII Session Token Status */}
        <div className="hidden sm:flex items-center bg-blue-950/60 border border-blue-800/70 px-2.5 py-1 rounded-xl text-xs space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <div className="text-[11px] font-mono text-blue-200">
            Token SII: <span className="text-white font-bold">{tokenTimeLeft}m</span>
          </div>
          <button
            onClick={handleRefreshToken}
            disabled={isRefreshingToken}
            className="p-1 text-blue-300 hover:text-amber-400 transition-colors"
            title="Refrescar Semilla (GetSeed -> GetTokenFromSeed)"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshingToken ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Dynamic Role Switcher */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-blue-950/80 p-1 rounded-xl border border-blue-800 text-xs">
            <button
              onClick={() => { setRole('admin'); navigate('/admin'); }}
              className={`flex items-center px-2 py-1 rounded-lg transition-colors font-medium ${
                currentRole === 'admin' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-blue-200 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 mr-1" />
              Emisor
            </button>
            <button
              onClick={() => { setRole('auditor'); navigate('/admin/certificacion'); }}
              className={`flex items-center px-2 py-1 rounded-lg transition-colors font-medium ${
                currentRole === 'auditor' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-blue-200 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Certificación
            </button>
            <button
              onClick={() => { setRole('receiver'); navigate('/admin/intercambio'); }}
              className={`flex items-center px-2 py-1 rounded-lg transition-colors font-medium ${
                currentRole === 'receiver' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-blue-200 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1" />
              Receptor
            </button>
          </div>

          {/* User Avatar */}
          <div className="flex items-center space-x-2 border-l border-blue-900 pl-3">
            <div className="w-8 h-8 bg-blue-900 border border-blue-700 rounded-full flex items-center justify-center font-bold text-xs text-amber-300">
              {currentRole === 'admin' ? 'EM' : currentRole === 'auditor' ? 'CR' : 'RC'}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
