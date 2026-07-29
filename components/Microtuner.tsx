import React from 'react';
import { ScaleNote } from '../types';

interface MicrotunerProps {
  scaleNotes: ScaleNote[];
}

const CHROMATIC_KEYS = [
  { label: "C", index: 0 },
  { label: "C#", index: 1 },
  { label: "D", index: 2 },
  { label: "Eb", index: 3 },
  { label: "E", index: 4 },
  { label: "F", index: 5 },
  { label: "F#", index: 6 },
  { label: "G", index: 7 },
  { label: "Ab", index: 8 },
  { label: "A", index: 9 },
  { label: "Bb", index: 10 },
  { label: "B", index: 11 },
];

const Microtuner: React.FC<MicrotunerProps> = ({ scaleNotes }) => {

  const activeIndices = scaleNotes.map(n => ({
      index: Math.ceil(n.midiIndex) % 12,
      isQuarter: n.isQuarterTone
  }));

  return (
    <div className="w-full flex flex-col gap-2" dir="ltr">
      <div className="flex justify-between items-center px-1">
          <label className="text-[9px] font-bold text-[#666] uppercase tracking-widest">
            Signal Analysis (Hz)
          </label>
          <div className="flex gap-2">
             <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                <span className="text-[8px] text-[#555] font-mono">STD</span>
             </div>
             <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                <span className="text-[8px] text-[#555] font-mono">M.TONE</span>
             </div>
          </div>
      </div>

      {/* LED Display Container */}
      <div className="w-full bg-[#050505] p-2 rounded border border-[#333] shadow-inner overflow-x-auto">
         <div className="flex w-full min-w-[500px] h-20 justify-between items-end gap-1">
            {CHROMATIC_KEYS.map((key) => {
              const noteData = activeIndices.find(n => n.index === key.index);
              const isActive = !!noteData;
              const isQuarter = noteData?.isQuarter;

              // LED Bar Colors
              const barColor = isActive 
                ? (isQuarter ? 'bg-amber-500' : 'bg-cyan-500') 
                : 'bg-[#1a1a1a]'; // Very dim for inactive
              
              const shadowColor = isActive
                ? (isQuarter ? 'shadow-[0_0_15px_#f59e0b]' : 'shadow-[0_0_15px_#06b6d4]')
                : 'shadow-none';
              
              const height = isActive ? 'h-[75%]' : 'h-[5%]';

              return (
                <div key={key.label} className="flex-1 flex flex-col items-center justify-end gap-1 group h-full relative">
                  
                   {/* Microtone Identification Badge */}
                   {isActive && isQuarter && (
                      <div className="absolute top-0 animate-pulse flex flex-col items-center">
                          <span className="text-[9px] font-black text-amber-500 tracking-tighter">
                            TASHRIQ
                          </span>
                          <div className="w-0.5 h-2 bg-amber-500/50"></div>
                      </div>
                   )}

                  {/* The LED Bar */}
                  <div className="w-full flex-1 flex items-end justify-center bg-[#111] rounded-sm overflow-hidden relative border border-white/5">
                      {/* Background Grid Lines */}
                      <div className="absolute inset-0 flex flex-col justify-between py-1 opacity-20 pointer-events-none">
                          <div className="w-full h-px bg-white"></div>
                          <div className="w-full h-px bg-white"></div>
                          <div className="w-full h-px bg-white"></div>
                          <div className="w-full h-px bg-white"></div>
                      </div>

                      {/* Active Signal */}
                      <div className={`
                        w-[60%] rounded-t-sm transition-all duration-300 ease-out
                        ${barColor} ${shadowColor}
                        ${height}
                      `}></div>
                  </div>

                  {/* Label */}
                  <div className={`text-[9px] font-mono font-bold ${isActive ? 'text-white' : 'text-[#333]'}`}>
                    {key.label}
                  </div>
                </div>
              )
            })}
         </div>
      </div>
    </div>
  );
};

export default Microtuner;