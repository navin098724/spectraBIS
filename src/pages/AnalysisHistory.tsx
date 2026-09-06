import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, ArrowRight, Trash2, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AnalysisHistoryRecord } from '../types';

export default function AnalysisHistory() {
  const [history, setHistory] = useState<AnalysisHistoryRecord[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const stored = localStorage.getItem('spectra_history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your analysis history?')) {
      localStorage.removeItem('spectra_history');
      setHistory([]);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Analysis History</h1>
          <p className="text-slate-500 mt-2">Recent tender requirement analyses and verifications</p>
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded uppercase tracking-wider transition-colors bg-white">
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </header>

      {history.length === 0 ? (
        <div className="bg-slate-50 p-12 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center">
          <HistoryIcon className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">No History Yet</h2>
          <p className="text-slate-500 mb-6">You haven't run any requirement analyses yet.</p>
          <Link to="/analyze" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded shadow-sm transition-colors text-sm">
            Run an Analysis
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {history.map((record) => (
              <li key={record.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1 pr-8">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                        <Clock className="w-3.5 h-3.5" /> {new Date(record.timestamp).toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        record.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {record.status}
                      </span>
                      {record.report.gaps.length > 0 && (
                        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                          {record.report.gaps.length} Gaps Found
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Identified Product: {record.report.requirements.product}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 italic border-l-2 border-slate-200 pl-2">
                        "{record.input}"
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                       {record.report.recommendations.slice(0, 3).map((rec, i) => (
                         <div key={i} className="text-[10px] px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded font-mono font-bold text-indigo-800">
                           {rec.standard.isNumber}
                         </div>
                       ))}
                       {record.report.recommendations.length > 3 && (
                         <div className="text-[10px] px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-bold text-slate-600">
                           +{record.report.recommendations.length - 3} more
                         </div>
                       )}
                    </div>
                  </div>
                  
                  <Link to="/analyze" className="shrink-0 flex items-center justify-center p-3 rounded-full bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 transition-colors border border-slate-200 hover:border-indigo-200">
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
