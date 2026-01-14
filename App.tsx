
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import { analyzeVocal } from './services/geminiService';
import { AnalysisState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    result: null,
    error: null,
    file: null,
  });

  const handleFileSelect = async (file: File) => {
    setState(prev => ({ ...prev, loading: true, error: null, file }));
    
    try {
      const result = await analyzeVocal(file);
      setState(prev => ({ ...prev, loading: false, result }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "The analysis engine stalled. This typically happens if the file is too complex or the network failed during the Pro-reasoning pass. Try a clean 15-30 second high-quality clip." 
      }));
    }
  };

  const reset = () => {
    setState({ loading: false, result: null, error: null, file: null });
  };

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={reset}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <i className="fas fa-bolt text-white"></i>
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">
              Vocal<span className="text-indigo-500">Truth</span>
            </h1>
          </div>
          <div className="hidden sm:block text-[10px] mono text-zinc-500 font-bold uppercase tracking-[0.2em]">
            Gemini 3 Pro Engine • Clinical Vocal Forensics
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {!state.result && !state.loading && (
          <div className="text-center mb-12 animate-in slide-in-from-bottom duration-700">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 gradient-text">
              The A&amp;R who knows exactly who you are.
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              Powered by the Pro Reasoning Engine. We identify original masters, covers, and AI-mimicry with clinical precision. Upload your tracks for a forensic teardown of your voice and engineering.
            </p>
            <FileUpload onFileSelect={handleFileSelect} isLoading={state.loading} />
          </div>
        )}

        {state.loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-pulse">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <i className="fas fa-brain text-xl text-indigo-500"></i>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-zinc-200">Deep Reasoning Active...</h3>
              <p className="text-zinc-500 text-sm mono">Performing Forensic Vocal Printing (Pro Engine Pass)...</p>
            </div>
          </div>
        )}

        {state.error && (
          <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl text-center mb-8">
            <i className="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
            <p className="text-red-200">{state.error}</p>
            <button 
              onClick={reset}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors"
            >
              Restart Engine
            </button>
          </div>
        )}

        {state.result && (
          <div className="pb-20">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black text-white">Forensic Analysis Result</h2>
                <p className="text-zinc-500 text-sm mono uppercase">Verified via Pro Engine</p>
              </div>
              <button 
                onClick={reset}
                className="px-4 py-2 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all text-sm font-bold"
              >
                New Analysis
              </button>
            </div>
            <AnalysisDashboard data={state.result} />
          </div>
        )}
      </main>

      {/* Footer / Disclaimer */}
      <footer className="border-t border-zinc-900 py-10 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
            Gemini 3 Pro Consistency Engine • VocalTruth Pro v2.0
          </p>
          <p className="text-zinc-700 text-[10px] max-w-xl mx-auto leading-tight italic">
            Note: Our Pro engine performs deep reasoning on harmonic content. It is designed to distinguish between authentic recordings and mimicry by analyzing spectral artifacts that human ears often miss.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
