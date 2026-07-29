import React from 'react';
import { getKeyStatus } from '../utils';
import { ScaleNote } from '../types';

interface PianoProps {
  scaleNotes: ScaleNote[];
}

const START_MIDI = 60; // C4
const END_MIDI = 72;   // C5

const Piano: React.FC<PianoProps> = ({ scaleNotes }) => {
  const keys = [];
  
  for (let i = START_MIDI; i <= END_MIDI; i++) {
    const isBlack = [1, 3, 6, 8, 10].includes(i % 12);
    keys.push({ midi: i, isBlack });
  }

  const keyStatuses = keys.map(k => ({
    ...k,
    status: getKeyStatus(k.midi, scaleNotes)
  }));

  return (
    <div className="w-full relative mt-4 select-none" dir="ltr">
      
      {/* Synth Chassis */}
      <div className="relative h-40 bg-[#121214] rounded-lg border border-[#333] shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Top Metallic Strip */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#27272a] to-[#18181b] border-b border-[#333] flex justify-between items-center px-4 z-0">
             <div className="flex gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-[#444] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-[#444] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]"></div>
             </div>
             <span className="text-[9px] text-[#666] font-mono tracking-widest uppercase">GLS Virtual Keybed</span>
             <div className="flex gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-[#444] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-[#444] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]"></div>
             </div>
        </div>

        {/* Scroll Container */}
        <div className="overflow-x-auto hide-scrollbar h-full flex justify-center relative z-10 pt-6">
            <div className="relative h-full flex min-w-[600px] px-8 pb-4 gap-1">
                {keyStatuses.map((key) => {
                    // Render White Keys (Black keys are children of previous white key)
                    if (key.isBlack) return null;

                    const nextMidi = key.midi + 1;
                    const nextKey = keyStatuses.find(k => k.midi === nextMidi);
                    const hasBlackNext = nextKey?.isBlack;

                    // --- WHITE KEY STYLING ---
                    const status = key.status; 
                    const isActive = status !== 'none';
                    const isQuarter = status === 'quarter';

                    // Base Colors
                    // Changed to White/Ivory for inactive state
                    let wkBase = "bg-[#e5e5e5]"; 
                    let wkShadow = "shadow-[inset_0_-5px_8px_rgba(0,0,0,0.15)]";
                    let wkLabelColor = "text-[#666]";
                    
                    if (isActive) {
                        if (isQuarter) {
                            wkBase = "bg-[#f59e0b]"; // Gold/Amber-500
                            wkShadow = "shadow-[0_0_35px_rgba(245,158,11,0.6)] z-10";
                            wkLabelColor = "text-black font-bold";
                        } else {
                            wkBase = "bg-[#06b6d4]"; // Cyan-500
                            wkShadow = "shadow-[0_0_35px_rgba(6,182,212,0.6)] z-10";
                            wkLabelColor = "text-black font-bold";
                        }
                    }

                    // --- BLACK KEY STYLING (Nested) ---
                    let bkBase = "bg-[#09090b]"; // Zinc-950 (Inactive)
                    let bkShadow = "shadow-xl";
                    
                    if (hasBlackNext) {
                         const bkStatus = nextKey.status;
                         const bkActive = bkStatus !== 'none';
                         const bkQuarter = bkStatus === 'quarter';
                         
                         if (bkActive) {
                             if (bkQuarter) {
                                 bkBase = "bg-[#d97706]"; // Amber-600
                                 bkShadow = "shadow-[0_0_25px_rgba(245,158,11,0.6)]";
                             } else {
                                 bkBase = "bg-[#0891b2]"; // Cyan-600
                                 bkShadow = "shadow-[0_0_25px_rgba(6,182,212,0.6)]";
                             }
                         }
                    }

                    return (
                        <div key={key.midi} className="relative flex-1 group min-w-[45px]">
                            
                            {/* White Key Physical */}
                            <div className={`
                                h-full rounded-b-[4px] border border-black/80
                                flex flex-col justify-end items-center pb-3
                                transition-all duration-150 ease-out relative
                                ${wkBase} ${wkShadow}
                                ${isActive ? 'translate-y-[1px]' : ''}
                            `}>
                                {/* Gloss Texture */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-b-[4px]"></div>
                                
                                {/* Status Indicator */}
                                {isActive && (
                                   <div className={`w-1.5 h-1.5 rounded-full bg-black/50 mb-1`}></div>
                                )}
                            </div>

                            {/* Black Key Physical (Positioned absolutely relative to the white key) */}
                            {hasBlackNext && (
                                <div className="absolute z-20 top-0 -right-[15px] w-[30px] h-[65%] pointer-events-none">
                                    <div className={`
                                        w-full h-full rounded-b-[3px] border border-black
                                        relative
                                        transition-all duration-150 ease-out
                                        ${bkBase} ${bkShadow}
                                        ${nextKey?.status !== 'none' ? 'translate-y-[1px]' : ''}
                                    `}>
                                        {/* Matte Texture */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-b-[3px]"></div>
                                        
                                        {/* LED Strip (Only if active) */}
                                        {nextKey?.status !== 'none' && (
                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-3 rounded-full bg-white/40"></div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Piano;