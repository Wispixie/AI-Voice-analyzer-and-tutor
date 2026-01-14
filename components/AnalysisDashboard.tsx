
import React from 'react';
import { AnalysisResult, CareerDecision } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface AnalysisDashboardProps {
  data: AnalysisResult;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  const chartData = data.metrics.map(m => ({
    subject: m.label,
    A: m.score,
    fullMark: 100,
  }));

  const getScoreColor = (score: number) => {
    if (score > 85) return 'text-cyan-400';
    if (score > 70) return 'text-emerald-400';
    if (score > 50) return 'text-yellow-400';
    if (score > 30) return 'text-orange-500';
    return 'text-red-600';
  };

  const getDecisionBadge = (decision: CareerDecision) => {
    switch (decision) {
      case 'PROCEED': 
        return { label: 'MARKET READY', color: 'bg-emerald-500', text: 'text-emerald-50', icon: 'fa-check-double' };
      case 'TRAIN': 
        return { label: 'NEEDS REFINEMENT', color: 'bg-yellow-500', text: 'text-yellow-950', icon: 'fa-graduation-cap' };
      case 'PIVOT': 
        return { label: 'ROLE PIVOT REQUIRED', color: 'bg-indigo-500', text: 'text-indigo-50', icon: 'fa-shuffle' };
      case 'STOP': 
        return { label: 'NOT RECOMMENDED', color: 'bg-red-600', text: 'text-red-50', icon: 'fa-ban' };
      default: 
        return { label: 'UNKNOWN', color: 'bg-zinc-500', text: 'text-white', icon: 'fa-question' };
    }
  };

  const badge = getDecisionBadge(data.careerDecision);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Identity & Career Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${badge.color} ${badge.text} px-8 py-6 rounded-3xl flex items-center justify-between shadow-xl`}>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
              <i className={`fas ${badge.icon} text-2xl`}></i>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Career Verdict</div>
              <div className="text-3xl font-black uppercase tracking-tight">{badge.label}</div>
            </div>
          </div>
          <div className="text-right">
             <div className="text-[10px] font-black uppercase tracking-widest opacity-80">PRO ENGINE STATUS</div>
             <div className="text-xl font-bold font-mono">GEMINI 3 PRO</div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <i className={`fas fa-fingerprint text-xl ${data.identifiedArtist.name !== 'Unknown' ? 'text-indigo-400' : 'text-zinc-600'}`}></i>
            <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Forensic ID</h3>
          </div>
          <div className="text-xl font-bold text-white mb-1">
            {data.identifiedArtist.name}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${data.identifiedArtist.isOriginal ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
              {data.identifiedArtist.isOriginal ? 'ORIGINAL MASTER' : 'COVER / ALTERED'}
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 bg-black/30 p-2 rounded border border-zinc-800/50 italic">
            {data.identifiedArtist.signatureReasoning}
          </div>
        </div>
      </div>

      {/* Hero Score Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
             <span className="text-[10px] mono text-zinc-400 font-bold uppercase tracking-widest bg-zinc-800 px-2 py-1 rounded">KEY: {data.detectedKey}</span>
          </div>
          <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Technical Grade</h3>
          <div className={`text-7xl font-black mb-2 ${getScoreColor(data.overallScore)}`}>
            {data.overallScore}<span className="text-2xl text-zinc-600">/100</span>
          </div>
          <p className="text-zinc-400 text-sm font-medium italic">"{data.verdict}"</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl md:col-span-2 flex flex-col justify-center">
          <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center">
            <i className="fas fa-gavel mr-2"></i> The Brutal Honesty
          </h3>
          <p className="text-zinc-200 text-lg leading-relaxed font-light italic">
            "{data.brutalHonesty}"
          </p>
          <p className="mt-4 text-zinc-500 text-xs">
            <span className="text-indigo-500 font-bold uppercase mr-2">Artifact Analysis:</span>
            {data.identifiedArtist.notes}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {data.strengths.map((s, idx) => (
              <span key={idx} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase rounded-full">
                <i className="fas fa-star mr-1"></i> {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
          <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-6">Spectral Profile</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10 }} />
                <Radar
                  name="Metrics"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          {data.metrics.map((metric, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-zinc-200 font-semibold">{metric.label}</span>
                <span className={`font-bold ${getScoreColor(metric.score)}`}>{metric.score}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${getScoreColor(metric.score).replace('text-', 'bg-')}`} 
                  style={{ width: `${metric.score}%` }} 
                />
              </div>
              <p className="text-zinc-500 text-xs mt-2">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Technical Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
          <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Acoustic Forensics</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-blue-400 text-[10px] font-black uppercase mb-1">Intonation Variance</h4>
              <p className="text-zinc-400 text-sm">{data.musicalTheoryAnalysis.tonalConsistency}</p>
            </div>
            <div>
              <h4 className="text-cyan-400 text-[10px] font-black uppercase mb-1">Frequency Centering</h4>
              <p className="text-zinc-400 text-sm">{data.musicalTheoryAnalysis.pitch}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
          <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Engineering Teardown</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-pink-400 text-[10px] font-black uppercase mb-1">Spectral Balance</h4>
              <p className="text-zinc-400 text-sm">{data.productionAnalysis.mixing}</p>
            </div>
            <div>
              <h4 className="text-orange-400 text-[10px] font-black uppercase mb-1">Dynamic Range (LUFS)</h4>
              <p className="text-zinc-400 text-sm">{data.productionAnalysis.levelization}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy / Pivot */}
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl border-l-4 border-l-indigo-500 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <i className="fas fa-brain text-6xl"></i>
        </div>
        <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center">
          <i className="fas fa-map-signs mr-2"></i> Strategic Path
        </h3>
        <div className="text-2xl font-black text-white mb-2">{data.recommendedPath}</div>
        <p className="text-zinc-400 leading-relaxed italic mb-6">"{data.redirectionAdvice}"</p>
        
        <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800">
          <h4 className="text-zinc-500 text-[10px] font-black uppercase mb-3 tracking-widest">Market Context & Industry Readiness</h4>
          <p className="text-zinc-300 text-sm leading-relaxed">{data.industryViability}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
