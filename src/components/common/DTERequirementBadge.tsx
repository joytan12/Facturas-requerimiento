import React from 'react';
import { Bookmark, ShieldCheck, Sparkles } from 'lucide-react';

interface RequirementItem {
  num: number;
  title: string;
  category?: string;
}

interface DTERequirementBadgeProps {
  requirements: RequirementItem[];
}

export const DTERequirementBadge: React.FC<DTERequirementBadgeProps> = ({ requirements }) => {
  return (
    <div className="bg-gradient-to-r from-dte-primary-dark via-dte-primary to-slate-900 text-white p-3.5 rounded-2xl shadow-md border border-blue-900/80 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Header Title */}
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <div className="w-6 h-6 bg-amber-500 text-slate-950 rounded-lg flex items-center justify-center font-extrabold text-xs shadow-sm">
            <ShieldCheck className="w-4 h-4 text-slate-950" />
          </div>
          <span className="flex items-center gap-1.5">
            Requerimiento Normativo SII Cubierto
            <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
          </span>
        </div>

        {/* Badges List */}
        <div className="flex flex-wrap gap-2">
          {requirements.map((req) => (
            <div
              key={req.num}
              className="inline-flex items-center bg-blue-950/90 text-blue-100 border border-blue-700/80 px-3 py-1 rounded-xl text-xs font-semibold shadow-sm hover:border-amber-400 transition-all"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400 mr-1.5 flex-shrink-0" />
              <span className="font-extrabold text-amber-300 mr-1.5 font-mono">Req. #{req.num}:</span>
              <span className="text-white">{req.title}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
