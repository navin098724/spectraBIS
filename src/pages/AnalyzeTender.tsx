import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileSearch, Loader2, AlertCircle, CheckCircle2, Search, Zap, Printer, ChevronDown, ChevronUp, History as HistoryIcon, ShieldAlert, FileText, CheckSquare, XSquare, MessageSquare, PlusCircle } from 'lucide-react';
import type { ProcurementReport, Standard, SelectedStandardForTender, AnalysisHistoryRecord } from '../types';
import html2pdf from 'html2pdf.js';

export default function AnalyzeTender() {
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ProcurementReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedStandard, setExpandedStandard] = useState<string | null>(null);
  const [verificationState, setVerificationState] = useState<Record<string, string>>({});
  const [addedStandards, setAddedStandards] = useState<Set<string>>(new Set());
  
  const reportRef = useRef<HTMLDivElement>(null);

  // Initialize added standards from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('spectra_tender_standards');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SelectedStandardForTender[];
        setAddedStandards(new Set(parsed.map(s => s.standard.isNumber)));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setError(null);
      
      if (selected.type === 'application/pdf') {
        const formData = new FormData();
        formData.append('file', selected);
        setLoading(true);
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          setInputText(data.text);
        } catch (err: any) {
          setError(err.message || 'Failed to parse PDF');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const saveToHistory = (r: ProcurementReport, input: string) => {
    try {
      const stored = localStorage.getItem('spectra_history');
      const history: AnalysisHistoryRecord[] = stored ? JSON.parse(stored) : [];
      history.unshift({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        input: input,
        report: r,
        status: 'Pending Review'
      });
      // Keep last 20
      localStorage.setItem('spectra_history', JSON.stringify(history.slice(0, 20)));
    } catch (e) {
      console.error(e);
    }
  };

  const analyzeRequirement = async () => {
    if (!inputText.trim()) {
      setError('Please enter procurement text or upload a PDF.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setReport(null);
    
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setReport(data);
      setVerificationState({}); // reset on new run
      saveToHistory(data, inputText);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (reportRef.current) {
      const opt = {
        margin:       0.5,
        filename:     'SpectraIS_Analysis_Report.pdf',
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
      };
      html2pdf().set(opt).from(reportRef.current).save();
    }
  };

  const handleVerification = (isNumber: string, state: string) => {
    setVerificationState(prev => ({ ...prev, [isNumber]: state }));
  };

  const handleAddToTender = (standard: Standard) => {
    try {
      const stored = localStorage.getItem('spectra_tender_standards');
      const currentList: SelectedStandardForTender[] = stored ? JSON.parse(stored) : [];
      
      if (!currentList.some(s => s.standard.isNumber === standard.isNumber)) {
        currentList.push({
          standard,
          addedAt: new Date().toISOString()
        });
        localStorage.setItem('spectra_tender_standards', JSON.stringify(currentList));
        setAddedStandards(prev => new Set(prev).add(standard.isNumber));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadDemo = (type: string) => {
    switch (type) {
      case 'steel': setInputText("We require High Strength Deformed Steel Bars (Fe 500D) for RCC construction in a bridge project."); break;
      case 'cement': setInputText("Supply of 43 grade ordinary portland cement for general civil works."); break;
      case 'aggregate': setInputText("Procurement of fine and coarse aggregate for concrete mix."); break;
      case 'outdated': setInputText("Requirement: 43 Grade Ordinary Portland Cement as per IS 8112."); break;
      case 'incomplete': setInputText("We need 5000 bricks for construction."); break;
      case 'conflict': setInputText("Supply of Fe 500D TMT steel bars. Tensile strength must be at least 400 MPa."); break;
      case 'nostandard': setInputText("Need 100 quantum flux capacitors for the temporal displacement engine."); break;
      case 'tamil': setInputText("பாலம் கட்டுமானப் பணிகளுக்கு உயர் வலிமை கொண்ட சிதைக்கப்பட்ட இரும்பு கம்பிகள் (Fe 500D) தேவை."); break;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Left Column: Input */}
      <div className="w-full lg:w-1/3 bg-white border-r border-slate-200 p-6 flex flex-col h-full overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-indigo-600" />
          Input Requirement
        </h2>
        
        <div className="mb-6">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Demo Scenarios</label>
          <div className="flex flex-wrap gap-2 text-sm">
            <button onClick={() => loadDemo('steel')} className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded text-slate-700 transition-colors text-[10px] font-bold uppercase">1. Steel</button>
            <button onClick={() => loadDemo('cement')} className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded text-slate-700 transition-colors text-[10px] font-bold uppercase">2. Cement</button>
            <button onClick={() => loadDemo('aggregate')} className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded text-slate-700 transition-colors text-[10px] font-bold uppercase">3. Aggregate</button>
            <button onClick={() => loadDemo('outdated')} className="px-2 py-1 bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded text-slate-700 transition-colors text-[10px] font-bold uppercase">4. Outdated</button>
            <button onClick={() => loadDemo('incomplete')} className="px-2 py-1 bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded text-slate-700 transition-colors text-[10px] font-bold uppercase">5. Incomplete</button>
            <button onClick={() => loadDemo('conflict')} className="px-2 py-1 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded text-slate-700 transition-colors text-[10px] font-bold uppercase">6. Conflict</button>
            <button onClick={() => loadDemo('nostandard')} className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded text-slate-700 transition-colors text-[10px] font-bold uppercase">7. No Standard</button>
            <button onClick={() => loadDemo('tamil')} className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded text-slate-700 transition-colors text-[10px] font-bold uppercase">8. Tamil Input</button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Upload Tender Document (PDF)</label>
          <label className="flex items-center justify-center w-full h-24 px-4 transition bg-slate-50 border-2 border-slate-200 border-dashed rounded-lg appearance-none cursor-pointer hover:border-indigo-400 focus:outline-none">
            <div className="flex flex-col items-center space-y-2">
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-500 text-xs">
                {file ? file.name : 'Drop files to attach, or browse'}
              </span>
            </div>
            <input type="file" name="file_upload" className="hidden" accept=".pdf" onChange={handleFileUpload} />
          </label>
        </div>

        <div className="mb-6 flex-1 flex flex-col">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Or Enter Text Specification</label>
          <textarea
            className="flex-1 w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm text-slate-700"
            placeholder="Type or paste procurement requirements here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={analyzeRequirement}
          disabled={loading || !inputText}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Running Pipeline...</>
          ) : (
            <><Zap className="w-5 h-5" /> Analyze Tender</>
          )}
        </button>
      </div>

      {/* Right Column: Results */}
      <div className="w-full lg:w-2/3 bg-slate-50 p-6 flex flex-col h-full overflow-y-auto">
        {!report && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Search className="w-12 h-12 opacity-20" />
            <p className="text-sm font-medium">Submit a requirement to view the analysis</p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center text-indigo-600 space-y-6">
            <Loader2 className="w-12 h-12 animate-spin opacity-50" />
            <div className="space-y-2 text-center">
               <p className="text-sm font-bold uppercase tracking-wider animate-pulse">Analysis Pipeline Running</p>
               <p className="text-xs text-slate-500">Requirement Understanding → Standard Retrieval → Gap Analysis</p>
            </div>
          </div>
        )}

        {report && (
          <div className="space-y-6 pb-20 max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Analysis Results Dashboard</h2>
              <button onClick={handleExportPdf} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm">
                <Printer className="w-4 h-4" /> Export Report
              </button>
            </div>

            <div ref={reportRef} className="space-y-6">
              {/* Context Understanding */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-700 uppercase tracking-tight flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" /> Procurement Requirement
                  </h3>
                  <div className="flex gap-2">
                    {report.requirements.detectedLanguage && report.requirements.detectedLanguage !== 'English' && (
                       <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 flex items-center gap-1">
                          Translated from: {report.requirements.detectedLanguage}
                       </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      report.requirements.classification === 'CLEAR' ? 'bg-emerald-100 text-emerald-700' :
                      report.requirements.classification === 'INCOMPLETE' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Quality: {report.requirements.classification}
                    </span>
                  </div>
                </div>
                
                {report.requirements.detectedLanguage && report.requirements.detectedLanguage !== 'English' && (
                   <div className="px-5 pt-4">
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Normalized Requirement (English)</p>
                     <p className="text-sm text-slate-700 font-mono bg-slate-50 p-2 rounded border border-slate-100">{report.requirements.normalizedRequirement}</p>
                   </div>
                )}

                <div className="p-5 grid grid-cols-2 gap-6">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Identified Product</span>
                    <span className="text-sm font-semibold text-slate-800">{report.requirements.product}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Intended Use</span>
                    <span className="text-sm font-semibold text-slate-800">{report.requirements.intendedUse}</span>
                  </div>
                </div>

                {report.requirements.missingInfo && report.requirements.missingInfo.length > 0 && (
                  <div className="px-5 pb-5">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                      <h4 className="text-[10px] font-bold text-amber-800 mb-2 uppercase tracking-wider">Missing Critical Information</h4>
                      <ul className="list-disc pl-4 text-amber-700 space-y-1 text-xs font-medium">
                        {report.requirements.missingInfo.map((info, idx) => (
                          <li key={idx}>{info}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-700 uppercase tracking-tight flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-indigo-500" /> Recommended Standards
                  </h3>
                </div>
                
                <div className="p-5 space-y-6">
                {report.recommendations.length === 0 ? (
                  <div className="p-8 bg-slate-50 text-center rounded-lg border border-slate-200">
                    <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                    <h4 className="font-bold text-sm text-slate-800">NO APPLICABLE STANDARD FOUND</h4>
                    <p className="text-slate-500 text-xs mt-2 max-w-md mx-auto">No sufficiently supported Indian Standard was identified from the current knowledge base matching this specific requirement.</p>
                    <div className="mt-4 inline-block px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded">Human Verification Required</div>
                  </div>
                ) : (
                  <>
                    {report.recommendations.map((rec, idx) => {
                      const isHigh = rec.classification === 'HIGHLY_APPLICABLE';
                      const isExpanded = expandedStandard === rec.standard.isNumber;
                      const vState = verificationState[rec.standard.isNumber];
                      
                      return (
                      <div key={idx} className={`rounded-xl relative overflow-hidden transition-all ${isHigh ? 'border-2 border-indigo-500 shadow-md' : 'border border-slate-200 bg-white shadow-sm'}`}>
                        {isHigh && (
                          <div className="absolute top-0 right-0 p-2 px-3 bg-indigo-500 text-white font-bold text-[10px] rounded-bl-lg shadow-sm">
                            {rec.relevanceScore}% MATCH
                          </div>
                        )}
                        
                        <div className="p-5">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-3">
                             <div className="flex items-center gap-3">
                               <div className="bg-slate-50 border border-slate-200 px-3 py-1 rounded font-mono text-lg font-black text-slate-800">
                                 {rec.standard.isNumber}
                               </div>
                               <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                                 isHigh ? 'bg-emerald-100 text-emerald-700' :
                                 rec.classification === 'POTENTIALLY_APPLICABLE' ? 'bg-indigo-100 text-indigo-700' :
                                 'bg-slate-200 text-slate-600'
                               }`}>
                                 {rec.classification.replace(/_/g, ' ')}
                               </span>
                             </div>
                             {vState && (
                                <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1 ${
                                  vState === 'verified' ? 'bg-emerald-100 text-emerald-700' : 
                                  vState === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  <CheckCircle2 className="w-3 h-3" /> {vState}
                                </div>
                             )}
                          </div>
                          
                          <p className="text-sm font-bold text-slate-800 leading-snug">{rec.standard.title}</p>
                          
                          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                               <div className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-600 font-bold tracking-wider uppercase">Year: {rec.standard.year}</div>
                               <div className={`text-[10px] px-2 py-0.5 border rounded font-bold tracking-wider uppercase ${
                                 rec.standard.status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                               }`}>Status: {rec.standard.status}</div>
                               <div className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-600 font-bold tracking-wider uppercase">{rec.standard.productCategory}</div>
                            </div>
                            
                            <button 
                              onClick={() => handleAddToTender(rec.standard)}
                              disabled={addedStandards.has(rec.standard.isNumber)}
                              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                                addedStandards.has(rec.standard.isNumber) 
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                                : 'bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 hover:border-indigo-600'
                              }`}
                            >
                              {addedStandards.has(rec.standard.isNumber) ? (
                                <><CheckCircle2 className="w-3.5 h-3.5" /> Added</>
                              ) : (
                                <><PlusCircle className="w-3.5 h-3.5" /> Add to Tender</>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Transparency / Expandable Area */}
                        <div className="border-t border-slate-100 bg-slate-50">
                          <button 
                            onClick={() => setExpandedStandard(isExpanded ? null : rec.standard.isNumber)}
                            className="w-full px-5 py-3 flex items-center justify-between text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors uppercase tracking-wider"
                          >
                            <span>Why was this recommended?</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          
                          {isExpanded && (
                            <div className="px-5 pb-5 pt-2 space-y-5 animate-in slide-in-from-top-2 duration-200">
                              
                              <div className="space-y-2">
                                <p className="text-xs text-slate-700 leading-relaxed border-l-2 border-indigo-400 pl-3">
                                  <span className="font-bold text-slate-800 block mb-1">Retrieval Transparency</span>
                                  {rec.whyRecommended}
                                </p>
                                <p className="text-xs text-slate-500 italic pl-3">Evidence: {rec.evidence}</p>
                              </div>

                              {/* Version History UI */}
                              <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                                  <History className="w-3 h-3" /> Version History & Amendments
                                </h4>
                                <div className="relative pl-4 border-l-2 border-slate-200 space-y-4">
                                  <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white"></div>
                                    <p className="text-xs font-bold text-slate-700">Original Publication <span className="font-normal text-slate-500">({rec.standard.dateIntroduced?.split('-')[0] || 'Unknown'})</span></p>
                                  </div>
                                  <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-400 border-2 border-white"></div>
                                    <p className="text-xs font-bold text-indigo-700">Current Revision <span className="font-normal text-indigo-500">({rec.standard.year}, Rev {rec.standard.revision})</span></p>
                                  </div>
                                  {rec.standard.amendments.map((amd, i) => (
                                    <div key={i} className="relative">
                                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white"></div>
                                      <p className="text-xs font-bold text-amber-700">Amendment {amd.number} <span className="font-normal text-amber-600">({amd.year})</span></p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Human Verification Controls */}
                              <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-2">
                                <button onClick={() => handleVerification(rec.standard.isNumber, 'verified')} className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold rounded flex items-center gap-1 transition-colors">
                                  <CheckSquare className="w-3.5 h-3.5" /> Verify
                                </button>
                                <button onClick={() => handleVerification(rec.standard.isNumber, 'rejected')} className="px-3 py-1.5 bg-white border border-slate-200 hover:border-red-500 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold rounded flex items-center gap-1 transition-colors">
                                  <XSquare className="w-3.5 h-3.5" /> Reject
                                </button>
                                <button onClick={() => handleVerification(rec.standard.isNumber, 'needs review')} className="px-3 py-1.5 bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50 text-slate-700 hover:text-amber-700 text-xs font-bold rounded flex items-center gap-1 transition-colors">
                                  <MessageSquare className="w-3.5 h-3.5" /> Needs Review
                                </button>
                              </div>
                              
                            </div>
                          )}
                        </div>
                      </div>
                    )})}
                  </>
                )}
                </div>
              </div>

              {/* Gaps & Conflicts */}
              {(report.gaps.length > 0 || report.conflicts.length > 0) && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                     <h3 className="font-bold text-sm text-slate-700 uppercase tracking-tight">Standards Applicability & Specification Analysis</h3>
                  </div>
                  <div className="p-5 space-y-6">
                  {report.gaps.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-500 flex items-center gap-2 mb-3 uppercase tracking-wider border-b border-slate-100 pb-2">
                        Tender Compliance & Specification Gaps
                      </h4>
                      <div className="space-y-3">
                        {report.gaps.map((gap, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm flex items-start gap-4">
                            <div className={`mt-0.5 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider shrink-0 ${
                              gap.severity === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' : 
                              gap.severity === 'HIGH' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                              gap.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                              'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}>
                              {gap.severity}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-800">{gap.issue}</p>
                              <p className="text-xs text-slate-500 mt-1 italic">{gap.whyItMatters}</p>
                              <div className="mt-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-indigo-600 uppercase tracking-wider text-[10px] block mb-0.5">Recommended Action</span>
                                {gap.recommendedAction}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.conflicts.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-500 flex items-center gap-2 mb-3 uppercase tracking-wider border-b border-slate-100 pb-2">
                        Potential Conflicts
                      </h4>
                      <div className="space-y-3">
                        {report.conflicts.map((conflict, idx) => (
                          <div key={idx} className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
                             <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                             <div>
                               <p className="font-bold text-sm text-red-900 flex items-center gap-2">
                                 {conflict.conflict}
                                 <span className="font-black uppercase tracking-wider text-[9px] bg-red-200 text-red-800 px-1.5 py-0.5 rounded">{conflict.certainty}</span>
                               </p>
                               <p className="text-xs text-red-800 mt-1">{conflict.details}</p>
                               {conflict.certainty === 'POTENTIAL' && (
                                 <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 mt-2 italic">Human Verification Required</p>
                               )}
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              )}
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
