import React from 'react';
import { Layout, Play, Clock, FileText, CheckCircle, Settings, Share2, Search } from 'lucide-react';
import Transcript from '../components/Transcript';
import IntelligencePanel from '../components/IntelligencePanel';
import VideoPlayer from '../components/VideoPlayer';
import useStore from '../store/useStore';

const Dashboard = () => {
  const currentSession = useStore((state) => state.currentSession);

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-50 font-sans overflow-hidden selection:bg-indigo-500/30">
      {/* Sidebar - Compact & Elegant */}
      <aside className="w-16 flex flex-col items-center py-6 border-r border-slate-800 bg-[#0f172a]/80 backdrop-blur-2xl z-20">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mb-10 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-105 transition-transform cursor-pointer">
          <Layout className="text-white" size={20} />
        </div>
        <nav className="flex flex-col gap-8 flex-1">
          <button className="text-indigo-400 p-2 bg-indigo-400/10 rounded-xl"><Play size={22} /></button>
          <button className="text-slate-500 hover:text-slate-200 transition-colors p-2"><Clock size={22} /></button>
          <button className="text-slate-500 hover:text-slate-200 transition-colors p-2"><FileText size={22} /></button>
          <button className="text-slate-500 hover:text-slate-200 transition-colors p-2"><CheckCircle size={22} /></button>
        </nav>
        <div className="flex flex-col gap-6 mt-auto">
          <button className="text-slate-500 hover:text-slate-200 transition-colors"><Settings size={22} /></button>
          <div className="w-9 h-9 p-0.5 rounded-full border border-slate-700 bg-slate-800 cursor-pointer hover:border-slate-500 transition-colors">
            <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full shadow-inner"></div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header - Glassmorphism */}
        <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-10 bg-[#0f172a]/40 backdrop-blur-xl z-10 shrink-0">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-slate-100">
                {currentSession?.title || "Welcome to DeepDive AI"}
              </h1>
              <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                v1.0 stable
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Session ID: {currentSession?.id || "N/A"}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg mr-4">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Live Sync Active</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl text-sm font-semibold transition-all border border-slate-700/50 group">
              <Share2 size={16} className="group-hover:rotate-12 transition-transform" /> Share
            </button>
            <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(79,70,229,0.25)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all active:scale-95">
              Export Analysis
            </button>
          </div>
        </header>

        {/* Dashboard Grid Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Visual Layer: Video & Transcript */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Professional Video Viewport */}
            <div className="aspect-video bg-black shadow-2xl relative">
               <VideoPlayer />
            </div>
            
            {/* Enhanced Transcript Integrated Section */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/30">
               <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800/50">
                  <div className="flex items-center gap-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Transcript Engine</h3>
                    <div className="h-4 w-[1px] bg-slate-800"></div>
                    <div className="flex gap-4">
                       <button className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest border-b border-indigo-500/50 pb-0.5">English</button>
                       <button className="text-[10px] font-bold text-slate-500 hover:text-slate-400 uppercase tracking-widest transition-colors">Spanish</button>
                    </div>
                  </div>
                  <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search semantic history..." 
                      className="bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-6 py-2 text-xs text-slate-300 w-72 focus:ring-1 focus:ring-indigo-500/50 outline-none hover:bg-slate-800 transition-all placeholder:text-slate-600" 
                    />
                  </div>
               </div>
               <Transcript />
            </div>
          </div>

          {/* Intelligence & RAG Engine Side Panel */}
          <IntelligencePanel />
        </div>
      </main>

      {/* Background Decorative Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full -z-1 pointer-events-none"></div>
      <div className="fixed bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-600/5 blur-[100px] rounded-full -z-1 pointer-events-none"></div>
    </div>
  );
};

export default Dashboard;
