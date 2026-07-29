import React from 'react';
import { Activity, Gauge, Sliders } from 'lucide-react';

interface HeaderProps {
  currentView: 'analyzer' | 'tempo';
  onViewChange: (view: 'analyzer' | 'tempo') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full select-none gap-4 sm:gap-0" dir="ltr">
      
      {/* Brand Identity */}
      <div className="flex items-center gap-3 self-start sm:self-center">
        <div className="w-10 h-10 bg-gradient-to-b from-[#2a2a2e] to-[#1a1a1d] rounded border border-[#333] shadow-[0_2px_5px_black] flex items-center justify-center relative">
          <Activity size={20} className="text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 rounded pointer-events-none"></div>
        </div>
        
        <div className="flex flex-col leading-none">
          <h1 className="text-xl font-black text-[#e1e1e6] tracking-tighter shadow-black drop-shadow-md">
            MAQAM<span className="text-cyan-500">LAB</span>
          </h1>
          <span className="text-[9px] text-[#666] font-mono tracking-[0.3em] uppercase">
            Harmonic Analyzer
          </span>
        </div>
      </div>

      {/* Navigation Switch (Hardware Style) */}
      <div className="bg-[#111] p-1 rounded-lg border border-[#222] shadow-inner flex gap-1">
         <button 
           onClick={() => onViewChange('analyzer')}
           className={`
             flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all
             ${currentView === 'analyzer' 
               ? 'bg-[#2a2a2e] text-cyan-400 border border-cyan-900/50 shadow-[0_1px_5px_rgba(0,0,0,0.5)]' 
               : 'text-[#555] hover:text-[#888] hover:bg-[#1a1a1d] border border-transparent'}
           `}
         >
           <Sliders size={12} />
           <span>Analyzer</span>
         </button>
         
         <div className="w-px bg-[#222] my-1"></div>

         <button 
           onClick={() => onViewChange('tempo')}
           className={`
             flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all
             ${currentView === 'tempo'
               ? 'bg-[#2a2a2e] text-cyan-400 border border-cyan-900/50 shadow-[0_1px_5px_rgba(0,0,0,0.5)]'
               : 'text-[#555] hover:text-[#888] hover:bg-[#1a1a1d] border border-transparent'}
           `}
         >
           <Gauge size={12} />
           <span>Tempo Key</span>
         </button>
      </div>

      {/* Rack Mount Info / Power */}
      <div className="hidden sm:flex flex-col items-end gap-1">
         <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-[#333] uppercase">Power</span>
            <div className="w-2 h-2 rounded-full shadow-[0_0_8px] animate-pulse transition-colors bg-cyan-500 shadow-cyan-500"></div>
         </div>
         <div className="text-[10px] text-[#444] font-mono">
            44.1 kHz / 24-bit
         </div>
      </div>

    </div>
  );
};

export default Header;
