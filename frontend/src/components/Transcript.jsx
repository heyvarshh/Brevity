import React, { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

const Transcript = () => {
  const { transcript, currentVideoTime, setVideoTime } = useStore();
  const activeRef = useRef(null);

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentVideoTime]);

  // Helper to format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
      {transcript.map((chunk, idx) => {
        const isActive = currentVideoTime >= chunk.start_time && currentVideoTime < chunk.end_time;
        
        return (
          <div 
            key={idx}
            ref={isActive ? activeRef : null}
            className={`flex gap-4 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
              isActive 
                ? 'bg-indigo-500/10 border-l-2 border-indigo-500 shadow-sm' 
                : 'hover:bg-slate-800/40 border-l-2 border-transparent'
            }`}
            onClick={() => setVideoTime(chunk.start_time)}
          >
            <span className={`text-xs font-mono tabular-nums shrink-0 mt-1 ${
              isActive ? 'text-indigo-400 font-bold' : 'text-slate-500'
            }`}>
              {formatTime(chunk.start_time)}
            </span>
            <div className="space-y-1">
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                 {chunk.speaker || "Speaker"}
               </span>
               <p className={`text-sm leading-relaxed ${
                 isActive ? 'text-slate-100 font-medium' : 'text-slate-400'
               }`}>
                 {chunk.content}
               </p>
            </div>
          </div>
        );
      })}
      
      {transcript.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 space-y-4">
           <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700"></div>
           <p className="text-sm font-medium">No transcript available yet</p>
        </div>
      )}
    </div>
  );
};

export default Transcript;
