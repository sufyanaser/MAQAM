import React from 'react';
import { ScaleNote } from '../types';
import { Activity } from 'lucide-react';

interface AnalysisTableProps {
  notes: ScaleNote[];
}

const AnalysisTable: React.FC<AnalysisTableProps> = ({ notes }) => {
  return (
    <div className="w-full bg-daw-panel rounded-xl border border-gray-800 overflow-hidden shadow-lg" dir="rtl">
      <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-daw-accent" />
          <h3 className="text-lg font-bold text-white tracking-tight">تحليل الأبعاد</h3>
        </div>
        <span className="text-[8px] sm:text-[10px] uppercase font-bold text-gray-600 bg-gray-900 px-2 py-1 rounded">Data</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-[#18181b] text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-wider">
              <th className="px-3 py-2 sm:px-6 sm:py-3 font-bold border-b border-gray-800 whitespace-nowrap">الدرجة</th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 font-bold border-b border-gray-800">النغمة</th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 font-bold border-b border-gray-800 whitespace-nowrap">البعد</th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 font-bold border-b border-gray-800 text-left">MIDI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {notes.map((note) => (
              <tr 
                key={note.degree} 
                className={`
                  transition-colors hover:bg-gray-800/30
                  ${note.isQuarterTone ? 'bg-yellow-500/5' : ''}
                `}
              >
                <td className="px-3 py-2 sm:px-6 sm:py-3 text-xs font-bold text-gray-400">
                  {note.degree === 1 ? '1' : note.degree}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold whitespace-nowrap">
                  <span className={note.isQuarterTone ? 'text-daw-gold' : 'text-daw-accent'}>
                    {note.name}
                  </span>
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-3 text-[10px] sm:text-xs text-gray-300 font-mono whitespace-nowrap">
                  {note.intervalFromPrev}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-3 text-xs text-gray-600 text-left font-mono">
                  {note.midiIndex.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalysisTable;