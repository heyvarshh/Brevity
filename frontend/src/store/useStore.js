import { create } from 'zustand';

export const useStore = create((set) => ({
  currentSession: null,
  currentVideoTime: 0,
  isPlaying: false,
  transcript: [],
  summaries: {},
  actionItems: [],
  concepts: [],
  
  setSession: (session) => set({ currentSession: session }),
  setVideoTime: (time) => set({ currentVideoTime: time }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setTranscript: (transcript) => set({ transcript }),
  setSummaries: (summaries) => set({ summaries }),
  setActionItems: (items) => set({ actionItems: items }),
  setConcepts: (concepts) => set({ concepts }),
}));
