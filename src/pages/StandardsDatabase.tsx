import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { Standard } from '../types';

export default function StandardsDatabase() {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/standards')
      .then(res => res.json())
      .then(data => {
        setStandards(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredStandards = standards.filter(std => 
    std.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    std.isNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    std.productCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Standards Registry</h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-slate-500">Verified construction & building material standards</p>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Local Fallback DB
            </span>
          </div>
        </div>
        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            placeholder="Search IS number, title, category..." 
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>
      </header>

      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading standards database...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">IS Number</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredStandards.map((std) => (
                  <React.Fragment key={std.isNumber}>
                    <tr 
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${expandedId === std.isNumber ? 'bg-slate-50' : ''}`}
                      onClick={() => setExpandedId(expandedId === std.isNumber ? null : std.isNumber)}
                    >
                      <td className="p-4 font-mono font-bold text-slate-800 whitespace-nowrap">{std.isNumber} : {std.year}</td>
                      <td className="p-4 text-slate-700 font-medium max-w-md truncate" title={std.title}>{std.title}</td>
                      <td className="p-4 text-slate-600">{std.productCategory}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          std.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {std.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">
                        {expandedId === std.isNumber ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </td>
                    </tr>
                    {expandedId === std.isNumber && (
                      <tr>
                        <td colSpan={5} className="p-0 border-b border-slate-200 bg-slate-50/50">
                          <div className="p-6 grid grid-cols-3 gap-6">
                            <div className="col-span-2 space-y-4">
                              <div>
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Scope</h4>
                                <p className="text-slate-700">{std.scope}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Certification</h4>
                                <p className="text-slate-700">{std.certificationInformation}</p>
                              </div>
                              {std.relationships.length > 0 && (
                                <div>
                                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Related Standards</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {std.relationships.map((rel, idx) => (
                                      <span key={idx} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-50 text-indigo-800 text-[10px] font-bold tracking-widest border border-indigo-100">
                                        <span className="opacity-75">{rel.type.replace(/_/g, ' ')}:</span> {rel.targetIsNumber}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="space-y-4 bg-white p-4 rounded border border-slate-200 shadow-sm">
                              <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Revision</h4>
                                <p className="text-slate-800 text-sm font-semibold">{std.revision}</p>
                              </div>
                              {std.reaffirmationYear && (
                                <div>
                                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reaffirmed</h4>
                                  <p className="text-slate-800 text-sm font-semibold">{std.reaffirmationYear}</p>
                                </div>
                              )}
                              {std.amendments.length > 0 && (
                                <div>
                                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amendments</h4>
                                  <ul className="text-slate-800 font-semibold text-sm">
                                    {std.amendments.map(a => <li key={a.number}>Amd {a.number} ({a.year})</li>)}
                                  </ul>
                                </div>
                              )}
                              <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Data Provenance</h4>
                                <p className="text-slate-800 text-sm">{std.evidenceNotes}</p>
                                <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-wider">Verified: {std.lastVerifiedDate}</p>
                              </div>
                              {std.sourceUrl && (
                                <a href={std.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800">
                                  View Source <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {filteredStandards.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No standards found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
