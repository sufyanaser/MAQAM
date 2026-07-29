import React, { useMemo } from 'react';
import { PLAYLISTS, MAQAMS, KEY_LABELS } from '../constants';
import { Music, ExternalLink, PlayCircle } from 'lucide-react';

interface PlaylistProps {
  maqam: string;
  root: string;
}

const Playlist: React.FC<PlaylistProps> = ({ maqam, root }) => {
  const suggestedSongs = useMemo(() => {
    const list = PLAYLISTS[maqam] || [];
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5); 
  }, [maqam, root]);

  const maqamArabicName = MAQAMS[maqam]?.name || maqam;
  const rootArabicName = KEY_LABELS[root]?.split(' (')[0] || root;

  const handleSongClick = (songName: string) => {
    const query = encodeURIComponent(`${songName} مقام ${maqamArabicName} درجة ${rootArabicName}`);
    const url = `https://www.youtube.com/results?search_query=${query}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full bg-daw-panel rounded-xl border border-gray-800 p-4 sm:p-5 h-full flex flex-col" dir="rtl">
       <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800 shrink-0">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Music size={18} className="text-daw-gold" />
          استماعات
        </h3>
        <span className="text-[10px] bg-gray-900 text-gray-400 px-2 py-1 rounded border border-gray-800 font-bold">
          {rootArabicName}
        </span>
      </div>
      
      {/* 
        Responsive Container:
        Mobile: Flex Row + Scrollable (Horizontal List)
        Desktop: Flex Column (Vertical List)
      */}
      <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto pb-2 lg:pb-0 -mx-2 px-2 lg:mx-0 lg:px-0 snap-x hide-scrollbar">
        {suggestedSongs.map((song, idx) => (
          <div 
            key={`${song}-${root}-${idx}`}
            onClick={() => handleSongClick(song)}
            className="
              group relative shrink-0 snap-center
              w-[240px] lg:w-full
              bg-[#18181b] hover:bg-[#27272a] border border-gray-800 hover:border-daw-accent/50 
              rounded-lg p-3 sm:p-4 transition-all duration-200 cursor-pointer
              flex flex-col lg:block
            "
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors truncate w-full">
                  {song}
                </span>
                <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider flex gap-1 items-center">
                   <span>{maqamArabicName}</span>
                   <span className="text-gray-700">•</span>
                   <span className="text-daw-accent font-bold">{rootArabicName}</span>
                </span>
              </div>
              <PlayCircle size={16} className="text-gray-600 group-hover:text-daw-accent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all shrink-0 mr-2" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-daw-bg rounded-lg border border-dashed border-gray-800 text-center shrink-0 hidden lg:block">
        <p className="text-xs text-gray-500 leading-relaxed">
          تم تحديث القائمة لدرجة <span className="text-daw-accent font-bold">{rootArabicName}</span>.
        </p>
      </div>
    </div>
  );
};

export default Playlist;