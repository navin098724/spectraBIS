import { useState, useEffect } from 'react';
import { Standard, StandardRelationship } from '../types';
import { Search, Map, ZoomIn, ZoomOut, ArrowRight, Target, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function StandardsGraph() {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);

  useEffect(() => {
    fetch('/api/standards')
      .then(res => res.json())
      .then(data => {
        setStandards(data);
        if (data.length > 0) {
          setSelectedStandard(data[0]);
        }
      });
  }, []);

  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case 'NORMATIVE_REFERENCE': return <ArrowRight className="w-3 h-3 text-indigo-500" />;
      case 'TEST_METHOD': return <Target className="w-3 h-3 text-amber-500" />;
      case 'SUPERSEDES': return <ShieldCheck className="w-3 h-3 text-emerald-500" />;
      case 'SUPERSEDED_BY': return <AlertTriangle className="w-3 h-3 text-rose-500" />;
      default: return <ArrowRight className="w-3 h-3 text-slate-400" />;
    }
  };

  const formatRelType = (type: string) => {
    return type.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-8 py-6 flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Map className="w-6 h-6 text-indigo-600" />
            Standards Relationship Graph
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-slate-500">Interactive visualization of normative references and dependencies.</p>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Local Graph Fallback
            </span>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button className="p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all"><ZoomOut className="w-5 h-5" /></button>
          <button className="p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all"><ZoomIn className="w-5 h-5" /></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Graph Canvas Area (Simulated) */}
        <div className="flex-1 relative overflow-hidden bg-slate-50 flex items-center justify-center p-8">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {selectedStandard ? (
            <div className="relative w-full max-w-4xl flex items-center justify-center h-full">
              
              {/* Central Node */}
              <div className="absolute z-10 bg-white border-2 border-indigo-500 p-6 rounded-xl shadow-xl max-w-xs text-center">
                <div className="bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded inline-block mb-3">
                  {selectedStandard.isNumber}
                </div>
                <h3 className="font-bold text-slate-800 text-sm">{selectedStandard.title}</h3>
                <div className="mt-4 text-xs font-semibold text-slate-500 bg-slate-50 py-1.5 rounded border border-slate-100">
                  {selectedStandard.relationships.length} Relationships
                </div>
              </div>

              {/* Related Nodes (Simulated Layout) */}
              {selectedStandard.relationships.map((rel, index) => {
                const angle = (index / selectedStandard.relationships.length) * 2 * Math.PI - Math.PI / 2;
                const radius = 220;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                const targetStd = standards.find(s => s.isNumber === rel.targetIsNumber);
                
                return (
                  <div key={index} className="absolute" style={{ transform: `translate(${x}px, ${y}px)` }}>
                    <svg className="absolute w-full h-full" style={{ top: -y, left: -x, width: Math.abs(x) || 1, height: Math.abs(y) || 1, zIndex: 0, overflow: 'visible' }}>
                      <line x1={x} y1={y} x2={0} y2={0} stroke={rel.type === 'TEST_METHOD' ? '#f59e0b' : '#6366f1'} strokeWidth="2" strokeDasharray={rel.type === 'RELATED' ? '4 4' : 'none'} opacity="0.3" />
                    </svg>
                    
                    <button 
                      onClick={() => targetStd && setSelectedStandard(targetStd)}
                      className="relative z-10 bg-white border border-slate-300 p-3 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-400 transition-all text-center w-32 -ml-16 -mt-10"
                    >
                      <div className="flex justify-center mb-1">{getRelationshipIcon(rel.type)}</div>
                      <div className="font-bold text-slate-700 text-xs">{rel.targetIsNumber}</div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-1 truncate">{formatRelType(rel.type)}</div>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-slate-400 flex flex-col items-center">
              <Map className="w-12 h-12 mb-4 opacity-50" />
              <p>Select a standard to view its relationships.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find standard in graph..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Available Nodes</h3>
            {standards.map(std => (
              <button
                key={std.isNumber}
                onClick={() => setSelectedStandard(std)}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                  selectedStandard?.isNumber === std.isNumber
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'bg-white border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className={`font-bold ${selectedStandard?.isNumber === std.isNumber ? 'text-indigo-700' : 'text-slate-700'}`}>
                  {std.isNumber}
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5">{std.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
