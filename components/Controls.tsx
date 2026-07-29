import React, { useMemo } from 'react';
import { MAQAMS, KEYS } from '../constants';

interface ControlsProps {
  selectedMaqam: string;
  selectedRoot: string;
  onMaqamChange: (m: string) => void;
  onRootChange: (r: string) => void;
}

const KEY_GRID_ITEMS = [
  { eng: "C", ar: "دو", value: "C" },
  { eng: "C#", ar: "دو#", value: "C#" },
  { eng: "D", ar: "ري", value: "D" },
  { eng: "Eb", ar: "ميb", value: "Eb" },
  { eng: "E", ar: "مي", value: "E" },
  { eng: "F", ar: "فا", value: "F" },
  { eng: "F#", ar: "فا#", value: "F#" },
  { eng: "G", ar: "صول", value: "G" },
  { eng: "Ab", ar: "لاb", value: "Ab" },
  { eng: "A", ar: "لا", value: "A" },
  { eng: "Bb", ar: "سيb", value: "Bb" },
  { eng: "B", ar: "سي", value: "B" },
];

const Controls: React.FC<ControlsProps> = ({ selectedMaqam, selectedRoot, onMaqamChange, onRootChange }) => {
  
  return (
    <div className="flex flex-col gap-6 w-full mt-2" dir="ltr">
      
      {/* SECTION 1: SCALE SELECTOR (PAD GRID) */}
      <div className="flex flex-col gap-2">
        <label className="text-[9px] font-bold text-[#666] uppercase tracking-widest pl-1">
           Algorithm (Maqam)
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {Object.keys(MAQAMS).map((m) => {
            const isActive = selectedMaqam === m;
            return (
              <button
                key={m}
                onClick={() => onMaqamChange(m)}
                className={`
                  relative h-10 rounded text-[10px] sm:text-[11px] font-bold uppercase transition-all duration-100
                  flex items-center justify-center border
                  ${isActive 
                    ? 'bg-[#1a2e35] border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                    : 'bg-[#222] border-[#111] text-[#666] hover:bg-[#2a2a2a] hover:text-[#888]'}
                `}
              >
                {/* Active LED corner */}
                {isActive && <div className="absolute top-1 right-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_cyan]"></div>}
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: ROOT FREQUENCY (CHROMATIC STRIP) */}
      <div className="flex flex-col gap-2">
         <div className="flex justify-between items-end px-1">
            <label className="text-[9px] font-bold text-[#666] uppercase tracking-widest">
              Root Frequency
            </label>
            <span className="text-[9px] font-mono text-cyan-600">
               {selectedRoot} = {KEY_GRID_ITEMS.find(k => k.value === selectedRoot)?.ar}
            </span>
         </div>
         
        <div className="w-full bg-[#111] p-1 rounded-md border border-[#000] shadow-inner flex gap-1 overflow-x-auto">
          {KEY_GRID_ITEMS.map((item) => {
            const isActive = selectedRoot === item.value;
            const isBlackKey = item.value.includes('#') || item.value.includes('b');

            return (
              <button
                key={item.eng}
                onClick={() => onRootChange(item.value)}
                className={`
                  flex-1 min-w-[40px] h-14 rounded-sm flex flex-col items-center justify-center gap-0 border-b-2 transition-all
                  ${isActive 
                    ? 'bg-[#2a2a2e] border-cyan-500 shadow-[0_-4px_10px_rgba(6,182,212,0.1)]' 
                    : 'bg-[#18181b] border-[#000] hover:bg-[#202023]'}
                `}
              >
                 <span className={`text-[12px] font-bold leading-none mb-0.5 ${isActive ? 'text-white' : 'text-[#888]'}`}>
                  {item.ar}
                </span>
                <span className={`text-[9px] font-black font-mono leading-none ${isActive ? 'text-cyan-400' : 'text-[#444]'}`}>
                  {item.eng}
                </span>
                {/* Status Dot */}
                <div className={`mt-1.5 w-3 h-0.5 rounded-full ${isActive ? 'bg-cyan-500 shadow-[0_0_5px_cyan]' : 'bg-[#000]'}`}></div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Controls;