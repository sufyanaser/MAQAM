import React from 'react';
import { Settings, Music2, AlertCircle } from 'lucide-react';

const GUIDES = [
  {
    id: 'bayati-d',
    title: 'Bayati D',
    arabicTitle: 'بياتي ري',
    root: 'D',
    scaleName: 'Bayati',
    description: 'الأكثر استخداماً. يجب خفض نوتة المي بيمول ربع تون.',
    settings: [
        { label: 'Scale Assistant Key', value: 'D Major' },
        { label: 'Micro Tuner Note', value: 'Eb', highlight: true, detail: '-50 cents' }
    ],
    notes: ['D', 'Eb', 'F', 'G', 'A', 'Bb', 'C']
  },
  {
    id: 'rast-c',
    title: 'Rast C',
    arabicTitle: 'راست دو',
    root: 'C',
    scaleName: 'Rast',
    description: 'مقام أساسي. يحتاج تشريق (ربع تون) لنوتتي المي والسي.',
    settings: [
        { label: 'Scale Assistant Key', value: 'C Major' },
        { label: 'Micro Tuner Notes', value: 'Eb & Bb', highlight: true, detail: '-50 cents' }
    ],
    notes: ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb']
  },
  {
    id: 'hijaz-d',
    title: 'Hijaz D',
    arabicTitle: 'حجاز ري',
    root: 'D',
    scaleName: 'Hijaz',
    description: 'يتميز بنوتة الفا دييز التي تعطيه الطابع الشرقي الروحاني.',
    settings: [
        { label: 'Scale Assistant Key', value: 'D Major' },
        { label: 'Distinctive Note', value: 'F#', highlight: true, detail: 'Natural' }
    ],
    notes: ['D', 'Eb', 'F#', 'G', 'A', 'Bb', 'C']
  },
  {
    id: 'saba-d',
    title: 'Saba D',
    arabicTitle: 'صبا ري',
    root: 'D',
    scaleName: 'Saba',
    description: 'مقام الحزن. يتميز بنوتة الصول بيمول (Gb) الفريدة.',
    settings: [
        { label: 'Scale Assistant Key', value: 'D Major' },
        { label: 'Distinctive Note', value: 'Gb', highlight: true, detail: 'Diminished 4th' }
    ],
    notes: ['D', 'Eb', 'F', 'Gb', 'A', 'Bb', 'C']
  }
];

const CubaseGuides: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-4" dir="rtl">
      
      {/* Header Info */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-[#666]">
            <Settings size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Cubase Integration Utils</span>
        </div>
        <span className="text-[9px] text-cyan-600 font-mono bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900">
            SCALE ASSISTANT PRESETS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GUIDES.map((guide) => (
            <div key={guide.id} className="bg-[#18181b] border border-[#333] rounded-lg p-4 relative overflow-hidden group hover:border-cyan-700/50 transition-colors">
                
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-transparent opacity-50"></div>
                <div className="absolute -right-10 -bottom-10 text-[80px] font-black text-[#222] opacity-50 select-none pointer-events-none">
                    {guide.root}
                </div>

                {/* Card Header */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {guide.arabicTitle}
                            <span className="text-xs font-mono text-cyan-500 opacity-80">[{guide.title}]</span>
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-1 max-w-[90%] leading-relaxed">
                            {guide.description}
                        </p>
                    </div>
                    <div className="w-8 h-8 rounded bg-[#111] border border-[#222] flex items-center justify-center shadow-inner">
                        <Music2 size={16} className="text-gray-500" />
                    </div>
                </div>

                {/* Technical Settings Box */}
                <div className="bg-[#111] rounded border border-[#222] p-3 mb-4 space-y-2 relative z-10" dir="ltr">
                    {guide.settings.map((setting, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-mono uppercase text-[9px]">{setting.label}</span>
                            <div className="flex items-center gap-2">
                                <span className={`font-bold font-mono ${setting.highlight ? 'text-amber-500' : 'text-gray-300'}`}>
                                    {setting.value}
                                </span>
                                {setting.detail && (
                                    <span className="text-[9px] bg-[#222] px-1.5 rounded text-gray-500">
                                        {setting.detail}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Visual Notes Strip */}
                <div className="flex gap-1 overflow-x-auto pb-1" dir="ltr">
                    {guide.notes.map((note, idx) => {
                        // Check if this note is one of the highlighted ones in settings
                        const isHighlighted = guide.settings.some(s => s.highlight && s.value.includes(note));
                        
                        return (
                            <div key={idx} className={`
                                flex-1 min-w-[30px] h-8 rounded-sm flex items-center justify-center text-[10px] font-bold font-mono border
                                ${isHighlighted 
                                    ? 'bg-amber-900/20 border-amber-600/50 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                                    : 'bg-[#222] border-[#333] text-gray-600'}
                            `}>
                                {note}
                            </div>
                        );
                    })}
                </div>

                {/* Info Footer */}
                <div className="mt-3 pt-2 border-t border-[#222] flex items-center gap-2 relative z-10">
                    <AlertCircle size={12} className="text-cyan-600" />
                    <span className="text-[9px] text-gray-500">
                        استخدم <span className="text-gray-300">Micro Tuner</span> لتعديل النوتات الملونة.
                    </span>
                </div>

            </div>
        ))}
      </div>
    </div>
  );
};

export default CubaseGuides;
