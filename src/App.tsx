import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, FileSearch, Database, GitMerge, FileText, LayoutDashboard, Map, History as HistoryIcon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AnalyzeTender from './pages/AnalyzeTender';
import StandardsDatabase from './pages/StandardsDatabase';
import CompareStandards from './pages/CompareStandards';
import TenderTemplate from './pages/TenderTemplate';
import StandardsGraph from './pages/StandardsGraph';
import AnalysisHistory from './pages/AnalysisHistory';

function Navigation() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200';

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
      <div className="p-6 border-b border-slate-800">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Project Domain</p>
        <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
          <p className="text-sm font-semibold text-white">Construction Materials</p>
          <p className="text-xs text-slate-400 mt-1">Phase 1 Pilot</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link to="/" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/')}`}>
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link to="/analyze" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/analyze')}`}>
          <FileSearch className="w-4 h-4" />
          Analyze Tender
        </Link>
        <Link to="/tender" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/tender')}`}>
          <FileText className="w-4 h-4" />
          Tender Builder
        </Link>
        <Link to="/database" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/database')}`}>
          <Database className="w-4 h-4" />
          Standards Registry
        </Link>
        <Link to="/compare" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/compare')}`}>
          <GitMerge className="w-4 h-4" />
          Compare Versions
        </Link>
        <Link to="/graph" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/graph')}`}>
          <Map className="w-4 h-4" />
          Standards Graph
        </Link>
        <Link to="/history" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/history')}`}>
          <HistoryIcon className="w-4 h-4" />
          Analysis History
        </Link>

        <div className="pt-4 mt-4 border-t border-slate-800">
          <div className="p-2 text-xs font-bold text-slate-500 uppercase tracking-wider">System Status</div>
          <div className="flex items-center gap-3 p-3 text-xs rounded-lg hover:bg-slate-800 transition-colors">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Gemini AI (Live)
          </div>
          <div className="flex items-center gap-3 p-3 text-xs rounded-lg hover:bg-slate-800 transition-colors">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div> DB: Local Fallback
          </div>
          <div className="flex items-center gap-3 p-3 text-xs rounded-lg hover:bg-slate-800 transition-colors">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div> Graph: Local Fallback
          </div>
        </div>
      </nav>
      <div className="p-6 border-t border-slate-800 text-xs text-slate-500 text-center">
        2026 © SpectraIS Engineering
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <Router>
      <div className="h-screen w-full bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="text-xl font-bold tracking-tight text-slate-800">SpectraIS <span className="text-indigo-600 text-sm font-medium ml-1 uppercase">SIH 2026</span></span>
          </div>
        </header>
        <main className="flex-1 flex overflow-hidden">
          <Navigation />
          <section className="flex-1 flex flex-col overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analyze" element={<AnalyzeTender />} />
              <Route path="/database" element={<StandardsDatabase />} />
              <Route path="/compare" element={<CompareStandards />} />
              <Route path="/graph" element={<StandardsGraph />} />
              <Route path="/tender" element={<TenderTemplate />} />
              <Route path="/history" element={<AnalysisHistory />} />
            </Routes>
          </section>
        </main>
      </div>
    </Router>
  );
}
