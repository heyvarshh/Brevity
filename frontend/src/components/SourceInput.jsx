import React, { useState } from 'react';
import { Video, Upload, Mic, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import useStore from '../store/useStore';

const SourceInput = ({ onComplete }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { setSession } = useStore();

  const handleYoutubeSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      // In a real app, we'd hit the API
      // const res = await axios.post('http://localhost:8000/api/v1/sessions/youtube', { url });
      // setSession(res.data);
      
      // Mocking for now to show the transition
      setTimeout(() => {
        setSession({
          id: 1,
          title: "Quantum Computing Explained",
          source_url: url,
          status: "processing"
        });
        onComplete();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a] z-50 flex items-center justify-center p-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-700"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Turn any video into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 italic">intelligence.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
              DeepDive AI uses state-of-the-art transcription and reasoning to build a semantic knowledge base from your content.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg">
              <Video size={16} className="text-red-500" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">YouTube</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/40 border border-slate-700/50 rounded-lg opacity-60">
              <Upload size={16} className="text-indigo-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upload</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/40 border border-slate-700/50 rounded-lg opacity-60">
              <Mic size={16} className="text-purple-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Meeting</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-3xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
           
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <Video className="text-red-500" />
             Extract from YouTube
           </h3>
           
           <form onSubmit={handleYoutubeSubmit} className="space-y-6 relative">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Video URL</label>
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..." 
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading || !url}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all group active:scale-95"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Initialize Intelligence Pipeline
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
           </form>
           
           <p className="mt-8 text-[11px] text-center text-slate-500 font-medium">
             By clicking initialize, you agree to our terms of processing. <br/> Heavy processing may take a few minutes.
           </p>
        </div>
      </div>
    </div>
  );
};

export default SourceInput;
