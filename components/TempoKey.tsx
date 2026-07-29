import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Clipboard,
  FileAudio,
  Gauge,
  Link2,
  Music2,
  Play,
  Upload,
  X,
} from 'lucide-react';
import { analyzeAudioFile } from '../audioAnalysis';

type AnalysisState = 'ready' | 'analyzing' | 'done' | 'error';

const SUPPORTED_EXTENSIONS = ['wav', 'mp3', 'flac', 'm4a', 'aac', 'ogg'];

const TempoKey: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('ready');
  const [bpm, setBpm] = useState<number | null>(null);
  const [musicalKey, setMusicalKey] = useState<string | null>(null);
  const [message, setMessage] = useState('READY');

  useEffect(() => {
    const preventWindowDrop = (event: DragEvent) => event.preventDefault();
    window.addEventListener('dragover', preventWindowDrop);
    window.addEventListener('drop', preventWindowDrop);
    return () => {
      window.removeEventListener('dragover', preventWindowDrop);
      window.removeEventListener('drop', preventWindowDrop);
    };
  }, []);

  const chooseFile = (selectedFile?: File) => {
    if (!selectedFile) return;
    const extension = selectedFile.name.split('.').pop()?.toLowerCase() ?? '';
    if (!SUPPORTED_EXTENSIONS.includes(extension)) {
      setAnalysisState('error');
      setMessage('UNSUPPORTED FILE');
      return;
    }

    setFile(selectedFile);
    setBpm(null);
    setMusicalKey(null);
    setAnalysisState('ready');
    setMessage('READY TO ANALYZE');
  };

  const clearFile = (event: React.MouseEvent) => {
    event.stopPropagation();
    setFile(null);
    setBpm(null);
    setMusicalKey(null);
    setAnalysisState('ready');
    setMessage('READY');
    if (inputRef.current) inputRef.current.value = '';
  };

  const pasteUrl = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setYoutubeUrl(clipboardText);
    } catch {
      setAnalysisState('error');
      setMessage('PASTE PERMISSION DENIED');
    }
  };

  const analyze = async () => {
    if (!file) {
      setAnalysisState('error');
      setMessage(youtubeUrl.trim() ? 'YOUTUBE: NEXT UPDATE' : 'SELECT AUDIO FILE');
      return;
    }

    setAnalysisState('analyzing');
    setMessage('ANALYZING AUDIO');
    setBpm(null);
    setMusicalKey(null);

    try {
      const result = await analyzeAudioFile(file);
      setBpm(result.bpm);
      setMusicalKey(result.key);
      setAnalysisState('done');
      setMessage(result.confidence >= 0.35 ? 'ANALYSIS COMPLETE' : 'LOW KEY CONFIDENCE');
    } catch (error) {
      setAnalysisState('error');
      setMessage(error instanceof Error ? error.message : 'ANALYSIS FAILED');
    }
  };

  const statusColor = analysisState === 'error'
    ? 'text-red-400'
    : analysisState === 'done'
      ? 'text-emerald-400'
      : analysisState === 'analyzing'
        ? 'text-cyan-400'
        : 'text-amber-400';

  return (
    <div className="w-full h-full flex flex-col gap-3" dir="ltr">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-[#666]">
          <Activity size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Audio Detection Engine</span>
        </div>
        <span className="text-[9px] text-cyan-500 font-mono bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/70">
          BPM + MUSICAL KEY
        </span>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          chooseFile(event.dataTransfer.files[0]);
        }}
        className={`
          min-h-[180px] flex-1 rounded-lg border bg-[#111318] transition-all duration-200
          flex flex-col items-center justify-center gap-3 relative overflow-hidden
          ${isDragging
            ? 'border-cyan-400 bg-cyan-950/20 shadow-[inset_0_0_30px_rgba(6,182,212,0.12)]'
            : 'border-[#343842] hover:border-cyan-700 hover:bg-[#13161c]'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".wav,.mp3,.flac,.m4a,.aac,.ogg,audio/*"
          className="hidden"
          onChange={(event) => chooseFile(event.target.files?.[0])}
        />

        {file ? (
          <>
            <div className="w-12 h-12 rounded-lg border border-cyan-900/70 bg-cyan-950/30 flex items-center justify-center">
              <FileAudio size={24} className="text-cyan-400" />
            </div>
            <div className="text-center px-12 max-w-full">
              <div className="text-sm font-bold text-white truncate max-w-[520px]">{file.name}</div>
              <div className="text-[10px] text-[#68717e] mt-1">
                {(file.size / 1024 / 1024).toFixed(1)} MB · Click to replace
              </div>
            </div>
            <span
              role="button"
              tabIndex={0}
              onClick={clearFile}
              className="absolute top-3 right-3 w-7 h-7 rounded border border-[#343842] bg-[#17191f] text-[#69717d] hover:text-red-400 hover:border-red-900 flex items-center justify-center"
              aria-label="Remove selected file"
            >
              <X size={14} />
            </span>
          </>
        ) : (
          <>
            <Upload size={28} className="text-cyan-500" />
            <div className="text-center">
              <div className="text-base font-bold text-white">Drop audio file here</div>
              <div className="text-[10px] text-[#68717e] mt-1">
                or click to choose WAV / MP3 / FLAC / M4A
              </div>
            </div>
          </>
        )}
      </button>

      <div className="h-11 flex items-center rounded-lg border border-[#343842] bg-[#111318] overflow-hidden">
        <Link2 size={15} className="ml-4 text-[#647080] shrink-0" />
        <input
          value={youtubeUrl}
          onChange={(event) => setYoutubeUrl(event.target.value)}
          placeholder="Paste YouTube link — support coming next update"
          className="flex-1 h-full bg-transparent px-3 text-xs text-[#aab3c0] outline-none placeholder:text-[#46505e]"
        />
        <button
          type="button"
          onClick={pasteUrl}
          className="h-8 mx-2 px-4 rounded-md border border-[#353d49] bg-[#191d25] text-[10px] font-bold text-[#9aa6b5] hover:text-white hover:border-cyan-800 flex items-center gap-2"
        >
          <Clipboard size={12} />
          Paste
        </button>
      </div>

      <button
        type="button"
        disabled={analysisState === 'analyzing'}
        onClick={analyze}
        className="h-11 rounded-lg border border-cyan-400/60 bg-cyan-600 text-white text-xs font-black tracking-wide hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(6,182,212,0.12)]"
      >
        {analysisState === 'analyzing' ? (
          <Activity size={14} className="animate-pulse" />
        ) : (
          <Play size={13} fill="currentColor" />
        )}
        {analysisState === 'analyzing' ? 'ANALYZING' : 'ANALYZE'}
      </button>

      <div className="grid grid-cols-3 gap-3">
        <div className="h-24 rounded-lg border border-[#2c3038] bg-[#171a21] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[9px] font-bold text-[#7787a5]">
            <span>BPM</span>
            <Gauge size={13} />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">{bpm ?? '—'}</div>
        </div>
        <div className="h-24 rounded-lg border border-[#2c3038] bg-[#171a21] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[9px] font-bold text-[#7787a5]">
            <span>KEY</span>
            <Music2 size={13} />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono truncate">{musicalKey ?? '—'}</div>
        </div>
        <div className="h-24 rounded-lg border border-[#2c3038] bg-[#171a21] p-4 flex flex-col justify-between">
          <div className="text-[9px] font-bold text-[#7787a5]">STATUS</div>
          <div className={`text-[12px] leading-tight font-black font-mono break-words ${statusColor}`}>
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempoKey;
