import { create } from 'zustand';

const useStore = create((set) => ({
  currentSession: {
    id: 1,
    title: "Understanding Quantum Computing L1",
    source_url: "https://www.youtube.com/watch?v=QuR8702XqJc",
    status: "completed"
  },
  currentVideoTime: 0,
  isPlaying: false,
  transcript: [
    { start_time: 0, end_time: 15, speaker: "Professor Sarah", content: "Welcome class. Today we're diving deep into the fundamentals of quantum mechanics and how they enable quantum computation." },
    { start_time: 15, end_time: 42, speaker: "Professor Sarah", content: "The first thing you need to understand is superposition. Unlike classical bits that are either 0 or 1, a qubit can exist in both states simultaneously." },
    { start_time: 42, end_time: 60, speaker: "Student A", content: "Professor, does that mean the processing power increases exponentially with every added qubit?" },
    { start_time: 60, end_time: 95, speaker: "Professor Sarah", content: "Exactly. While a 3-bit classical register holds one of 8 values, a 3-qubit register exists in a superposition of all 8 values at once." }
  ],
  summaries: {
    "Quick_Brief": "• Introduction to Quantum Mechanics\n• Explanation of Superposition & Entanglement\n• Difference between bits and qubits\n• Exponential growth of quantum state space",
    "Meeting_Notes": "Decisions: Move to Shor's algorithm labs next week.\nOpen Questions: Relationship between decoherence and temperature."
  },
  actionItems: [
    { type: "task", content: "Research Shor's Algorithm", assignee: "Student" },
    { type: "task", content: "Complete Quiz 1 by Friday", assignee: "Student" },
    { type: "decision", content: "Lab sessions will be moved to Thursday nights" }
  ],
  concepts: [
    { name: "Superposition", description: "The ability of a quantum system to be in multiple states at the same time until measured." },
    { name: "Entanglement", description: "A phenomenon where particles remain connected so that the state of one affects the other regardless of distance." }
  ],
  
  setSession: (session) => set({ currentSession: session }),
  setVideoTime: (time) => set({ currentVideoTime: time }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setTranscript: (transcript) => set({ transcript }),
  setSummaries: (summaries) => set({ summaries }),
  setActionItems: (items) => set({ actionItems: items }),
  setConcepts: (concepts) => set({ concepts }),
}));

export default useStore;
