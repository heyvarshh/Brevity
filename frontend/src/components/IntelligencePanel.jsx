import React, { useState } from 'react';
import { FileText, ClipboardList, Target, MessageSquare } from 'lucide-react';
import useStore from '../store/useStore';

const IntelligencePanel = () => {
  const [activeTab, setActiveTab] = useState('Summary');
  const { summaries, actionItems, concepts } = useStore();

  const tabs = [
    { name: 'Summary', icon: <FileText size={16} /> },
    { name: 'Actions', icon: <Target size={16} /> },
    { name: 'Key Concepts', icon: <ClipboardList size={16} /> },
    { name: 'Chat', icon: <MessageSquare size={16} /> },
  ];

  return (
    <div className="w-96 flex flex-col bg-[#0f172a]/40 border-l border-slate-800 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 py-4 flex flex-col items-center gap-1.5 transition-all relative ${
              activeTab === tab.name ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.name}</span>
            {activeTab === tab.name && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700">
        {activeTab === 'Summary' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {Object.entries(summaries).length > 0 ? (
              Object.entries(summaries).map(([mode, content]) => (
                <section key={mode}>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                    {mode.replace('_', ' ')}
                  </h4>
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {content}
                  </div>
                </section>
              ))
            ) : (
              <div className="py-20 text-center opacity-40">
                <p className="text-sm">Summary will appear here after processing.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Actions' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {actionItems.length > 0 ? (
              actionItems.map((item, i) => (
                <div key={i} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all group">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      item.type === 'task' ? 'bg-blue-500/10 text-blue-400' :
                      item.type === 'decision' ? 'bg-green-500/10 text-green-400' :
                      'bg-purple-500/10 text-purple-400'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200">{item.content}</p>
                  {item.assignee && (
                    <div className="mt-3 text-[10px] text-slate-500 flex items-center gap-1.5 font-medium uppercase">
                       <div className="w-4 h-4 rounded-full bg-slate-700"></div>
                       {item.assignee}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-20 text-center opacity-40">
                <p className="text-sm">No action items detected.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Key Concepts' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {concepts.length > 0 ? (
              concepts.map((con, i) => (
                <div key={i} className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 hover:border-indigo-400/30 transition-all">
                  <h5 className="text-sm font-bold text-indigo-400 mb-2">{con.name}</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">{con.description}</p>
                </div>
              ))
            ) : (
              <div className="py-20 text-center opacity-40">
                <p className="text-sm">No key concepts identified.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Chat' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex-1 space-y-4 pb-4">
                <div className="p-3 bg-slate-800/40 rounded-xl rounded-tl-none border border-slate-700/50 max-w-[90%]">
                   <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5 leading-none">AI Study Partner</p>
                   <p className="text-sm text-slate-300">I've analyzed the entire video. Ask me anything! For example: "What is the difference between a bit and a qubit?"</p>
                </div>
             </div>
          </div>
        )}
      </div>

      {activeTab === 'Chat' && (
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="relative group">
            <input
              type="text"
              placeholder="Ask anything about this video..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 hover:border-slate-600"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
              ASK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligencePanel;
