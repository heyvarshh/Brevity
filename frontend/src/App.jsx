import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import SourceInput from './components/SourceInput';
import useStore from './store/useStore';

function App() {
  const { currentSession } = useStore();
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden selection:bg-indigo-500/30">
      {!showDashboard && !currentSession ? (
        <SourceInput onComplete={() => setShowDashboard(true)} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;
