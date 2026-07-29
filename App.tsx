import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import Piano from './components/Piano';
import Microtuner from './components/Microtuner';
import CubaseGuides from './components/CubaseGuides';
import { KEYS } from './constants';
import { calculateScale } from './utils';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'analyzer' | 'cubase'>('analyzer');
  const [maqam, setMaqam] = useState<string>("Bayati");
  const [root, setRoot] = useState<string>("D");

  const scaleNotes = useMemo(() => {
    const rootIndex = KEYS.indexOf(root);
    return calculateScale(rootIndex, maqam);
  }, [maqam, root]);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] flex items-center justify-center p-2 sm:p-6" dir="rtl">
      
      {/* VST Hardware Chassis */}
      <div className="w-full max-w-[800px] bg-[#161619] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] border border-[#2a2a2e] relative overflow-hidden transition-all duration-300">
        
        {/* Top Screw Holes */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-[#0a0a0c] shadow-[inset_0_1px_2px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center z-20">
            <div className="w-1.5 h-1.5 border border-[#333] rounded-full opacity-50"></div>
        </div>
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#0a0a0c] shadow-[inset_0_1px_2px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center z-20">
             <div className="w-1.5 h-1.5 border border-[#333] rounded-full opacity-50"></div>
        </div>

        <div className="p-1 sm:p-2 flex flex-col gap-1">
          {/* Module 1: Branding & Status */}
          <div className="bg-[#1e1e21] rounded border border-black/40 shadow-inner p-4 z-10 relative">
             <Header currentView={currentView} onViewChange={setCurrentView} />
          </div>

          {/* DYNAMIC CONTENT AREA */}
          {currentView === 'analyzer' ? (
            <>
              {/* Module 2: Control Surface */}
              <div className="bg-[#1a1a1d] rounded border border-black/40 shadow-inner p-4 relative animate-in fade-in zoom-in-95 duration-300">
                 <div className="absolute top-2 left-2 text-[9px] text-[#444] font-mono tracking-widest uppercase">Input Stage</div>
                 <Controls 
                    selectedMaqam={maqam}
                    selectedRoot={root}
                    onMaqamChange={setMaqam}
                    onRootChange={setRoot}
                  />
              </div>

              {/* Module 3: Visualization (Piano + DSP) */}
              <div className="bg-[#111113] rounded border border-black/40 shadow-[inset_0_0_20px_black] p-4 relative animate-in fade-in zoom-in-95 duration-300 delay-75">
                 <div className="absolute top-2 left-2 text-[9px] text-[#444] font-mono tracking-widest uppercase">Visualizer</div>
                 <div className="flex flex-col gap-4">
                    <Piano scaleNotes={scaleNotes} />
                    <div className="h-px w-full bg-[#222]"></div>
                    <Microtuner scaleNotes={scaleNotes} />
                 </div>
              </div>
            </>
          ) : (
             /* Module: Cubase Assistant Guides */
             <div className="bg-[#1a1a1d] rounded border border-black/40 shadow-inner p-4 relative min-h-[400px] animate-in fade-in zoom-in-95 duration-300">
                <CubaseGuides />
             </div>
          )}

        </div>

        {/* Footer Hardware Info */}
        <div className="h-8 bg-[#121214] border-t border-black flex items-center justify-between px-4">
           <span className="text-[9px] text-[#444] font-mono">GLS AUDIO ENGINE v2.1</span>
           <div className="flex gap-2">
              <span className={`w-1 h-1 rounded-full ${currentView === 'analyzer' ? 'bg-green-900' : 'bg-[#333]'}`}></span>
              <span className={`w-1 h-1 rounded-full ${currentView === 'cubase' ? 'bg-amber-900' : 'bg-[#333]'}`}></span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default App;
