import React, { useState, useEffect } from 'react';
import { GitMerge, ArrowRightLeft, Info } from 'lucide-react';
import type { Standard } from '../types';

export default function CompareStandards() {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [std1Id, setStd1Id] = useState('');
  const [std2Id, setStd2Id] = useState('');

  useEffect(() => {
    fetch('/api/standards')
      .then(res => res.json())
      .then(data => {
        setStandards(data);
        if (data.length >= 2) {
          // Pre-select for demo if superseded relations exist
          const oldStd = data.find((s: Standard) => s.isNumber === 'IS 8112');
          const newStd = data.find((s: Standard) => s.isNumber === 'IS 269');
          if (oldStd && newStd) {
            setStd1Id(oldStd.isNumber);
            setStd2Id(newStd.isNumber);
          }
        }
      })
      .catch(console.error);
  }, []);

  const std1 = standards.find(s => s.isNumber === std1Id);
  const std2 = standards.find(s => s.isNumber === std2Id);

  const getStatusBadge = (val1: any, val2: any) => {
    if (val1 === val2) return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">UNCHANGED</span>;
    if (!val1 && val2) return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">ADDED</span>;
    if (val1 && !val2) return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700">REMOVED</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">CHANGED</span>;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Compare Versions</h1>
        <p className="text-slate-500 mt-2">Analyze gaps between old and new standards specifications.</p>
      </header>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Old Standard / Version</label>
          <select 
            className="w-full p-2.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 font-mono"
            value={std1Id}
            onChange={e => setStd1Id(e.target.value)}
          >
            <option value="">Select a standard...</option>
            {standards.map(s => <option key={s.isNumber} value={s.isNumber}>{s.isNumber}</option>)}
          </select>
        </div>
        
        <div className="p-3 bg-slate-100 rounded text-slate-400 mt-6 hidden md:block border border-slate-200">
          <ArrowRightLeft className="w-5 h-5" />
        </div>

        <div className="flex-1 w-full">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">New Standard / Version</label>
          <select 
            className="w-full p-2.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 font-mono"
            value={std2Id}
            onChange={e => setStd2Id(e.target.value)}
          >
            <option value="">Select a standard...</option>
            {standards.map(s => <option key={s.isNumber} value={s.isNumber}>{s.isNumber}</option>)}
          </select>
        </div>
      </div>

      {std1 && std2 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-4 w-1/6 text-slate-500 font-bold uppercase text-[10px] tracking-wider">Category</th>
                <th className="p-4 w-[35%] border-l border-slate-200 font-mono font-bold text-slate-800 text-base">{std1.isNumber} <span className="text-sm font-normal text-slate-500 ml-2">({std1.year})</span></th>
                <th className="p-4 w-[35%] border-l border-slate-200 font-mono font-bold text-slate-800 text-base">{std2.isNumber} <span className="text-sm font-normal text-slate-500 ml-2">({std2.year})</span></th>
                <th className="p-4 w-[13%] border-l border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider text-center">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              <tr>
                <td className="p-4 bg-slate-50 font-semibold text-slate-700">Status</td>
                <td className="p-4 border-l border-slate-200">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${std1.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>{std1.status}</span>
                </td>
                <td className="p-4 border-l border-slate-200">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${std2.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>{std2.status}</span>
                </td>
                <td className="p-4 border-l border-slate-200 text-center">{getStatusBadge(std1.status, std2.status)}</td>
              </tr>
              <tr>
                <td className="p-4 bg-slate-50 font-semibold text-slate-700">Scope</td>
                <td className="p-4 border-l border-slate-200 text-sm text-slate-600">{std1.scope}</td>
                <td className={`p-4 border-l border-slate-200 text-sm text-slate-600 ${std1.scope !== std2.scope ? 'bg-amber-50' : ''}`}>{std2.scope}</td>
                <td className="p-4 border-l border-slate-200 text-center">{getStatusBadge(std1.scope, std2.scope)}</td>
              </tr>
              <tr>
                <td className="p-4 bg-slate-50 font-semibold text-slate-700">Certification</td>
                <td className="p-4 border-l border-slate-200 text-sm text-slate-600">{std1.certificationInformation}</td>
                <td className={`p-4 border-l border-slate-200 text-sm text-slate-600 ${std1.certificationInformation !== std2.certificationInformation ? 'bg-amber-50' : ''}`}>{std2.certificationInformation}</td>
                <td className="p-4 border-l border-slate-200 text-center">{getStatusBadge(std1.certificationInformation, std2.certificationInformation)}</td>
              </tr>
              
              {/* Data unavailable in current dataset fallbacks */}
              <tr>
                <td className="p-4 bg-slate-50 font-semibold text-slate-700">Requirements</td>
                <td colSpan={2} className="p-4 border-l border-slate-200 text-slate-400 italic text-center flex items-center justify-center gap-2">
                  <Info className="w-4 h-4" /> Detailed comparison unavailable with current dataset.
                </td>
                <td className="p-4 border-l border-slate-200 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">NOT AVAILABLE</span></td>
              </tr>
              <tr>
                <td className="p-4 bg-slate-50 font-semibold text-slate-700">Testing</td>
                <td colSpan={2} className="p-4 border-l border-slate-200 text-slate-400 italic text-center flex items-center justify-center gap-2">
                  <Info className="w-4 h-4" /> Detailed comparison unavailable with current dataset.
                </td>
                <td className="p-4 border-l border-slate-200 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">NOT AVAILABLE</span></td>
              </tr>
              <tr>
                <td className="p-4 bg-slate-50 font-semibold text-slate-700">Safety</td>
                <td colSpan={2} className="p-4 border-l border-slate-200 text-slate-400 italic text-center flex items-center justify-center gap-2">
                  <Info className="w-4 h-4" /> Detailed comparison unavailable with current dataset.
                </td>
                <td className="p-4 border-l border-slate-200 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">NOT AVAILABLE</span></td>
              </tr>
              <tr>
                <td className="p-4 bg-slate-50 font-semibold text-slate-700">Marking</td>
                <td colSpan={2} className="p-4 border-l border-slate-200 text-slate-400 italic text-center flex items-center justify-center gap-2">
                  <Info className="w-4 h-4" /> Detailed comparison unavailable with current dataset.
                </td>
                <td className="p-4 border-l border-slate-200 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">NOT AVAILABLE</span></td>
              </tr>
              <tr>
                <td className="p-4 bg-slate-50 font-semibold text-slate-700">Sampling</td>
                <td colSpan={2} className="p-4 border-l border-slate-200 text-slate-400 italic text-center flex items-center justify-center gap-2">
                  <Info className="w-4 h-4" /> Detailed comparison unavailable with current dataset.
                </td>
                <td className="p-4 border-l border-slate-200 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">NOT AVAILABLE</span></td>
              </tr>

            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400 bg-white border border-slate-200 rounded-xl border-dashed">
          <GitMerge className="w-16 h-16 opacity-20 mb-4" />
          <p className="text-lg font-medium">Select two standards to compare them side-by-side.</p>
        </div>
      )}
    </div>
  );
}
