import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, ShieldCheck, Database, FileSearch, CheckSquare, Layers, Map, FileText, History as HistoryIcon } from 'lucide-react';
import type { AnalysisHistoryRecord } from '../types';

export default function Dashboard() {
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisHistoryRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('spectra_history');
    if (stored) {
      try {
        setRecentAnalyses(JSON.parse(stored).slice(0, 5));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const pendingReviews = recentAnalyses.filter(a => a.status === 'Pending Review').length;

  return (
    <div className="p-8 max-w-6xl mx-auto w-full h-full overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">SpectraIS Overview</h1>
        <p className="text-slate-500 mt-2 text-lg">AI-Powered Recommendation Engine for Indian Standards</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-700">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Standards in DB</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-emerald-700">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Tenders Analyzed</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{recentAnalyses.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-amber-700">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Pending Reviews</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{pendingReviews}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Avg Confidence</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">94%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-tight mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link to="/analyze" className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded text-indigo-700">
                  <FileSearch className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">Analyze New Tender</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Extract requirements and run AI analysis</p>
                </div>
              </div>
              <ArrowRight className="text-slate-400 group-hover:text-indigo-600 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link to="/tender" className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded text-indigo-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">Tender Builder</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Generate specification PDFs</p>
                </div>
              </div>
              <ArrowRight className="text-slate-400 group-hover:text-indigo-600 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link to="/database" className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded text-indigo-700">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">Browse Standards</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Explore the BIS knowledge base</p>
                </div>
              </div>
              <ArrowRight className="text-slate-400 group-hover:text-indigo-600 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link to="/graph" className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded text-indigo-700">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">Standards Graph</h4>
                  <p className="text-xs text-slate-500 mt-0.5">View normative relationships and mapping</p>
                </div>
              </div>
              <ArrowRight className="text-slate-400 group-hover:text-indigo-600 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Recent Analyses</h2>
              <Link to="/history" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            {recentAnalyses.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm flex flex-col items-center">
                <HistoryIcon className="w-8 h-8 mb-2 opacity-50" />
                No recent analyses.
              </div>
            ) : (
              <ul className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <li key={analysis.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{analysis.report.requirements.product}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(analysis.timestamp).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      analysis.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {analysis.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-tight mb-4">Infrastructure Status</h2>
            <ul className="space-y-5">
              <li className="flex justify-between items-center">
                <span className="text-slate-600 text-sm font-semibold">Gemini AI Engine</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-600 text-sm font-semibold flex flex-col">
                  Standards Database (SQL)
                  <span className="text-[10px] text-slate-400 font-normal mt-0.5">PostgreSQL / pgvector fallback</span>
                </span>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Local In-Memory
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-600 text-sm font-semibold flex flex-col">
                  Knowledge Graph (Neo4j)
                  <span className="text-[10px] text-slate-400 font-normal mt-0.5">Graph DB fallback</span>
                </span>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Local Adapter
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
