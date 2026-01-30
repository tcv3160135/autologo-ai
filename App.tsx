
import React, { useState, useCallback } from 'react';
import { generateLogo } from './services/geminiService';
import { LogoConfig, BrandPersonality, GeneratedLogo } from './types';

const PERSONALITIES: BrandPersonality[] = ['Smart', 'Reliable', 'Innovative', 'Scalable'];
const STYLES: Array<LogoConfig['style']> = ['Minimalist', 'Geometric', 'Abstract', 'Symbolic'];

const App: React.FC = () => {
  const [config, setConfig] = useState<LogoConfig>({
    brandName: 'Nexus AI',
    personality: ['Smart', 'Innovative'],
    primaryColor: '#2563eb',
    style: 'Minimalist'
  });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedLogo[]>([]);
  const [currentLogo, setCurrentLogo] = useState<GeneratedLogo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTogglePersonality = (p: BrandPersonality) => {
    setConfig(prev => ({
      ...prev,
      personality: prev.personality.includes(p)
        ? prev.personality.filter(item => item !== p)
        : [...prev.personality, p]
    }));
  };

  const handleGenerate = async () => {
    if (!config.brandName.trim()) {
      setError("Please enter a brand name.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const imageUrl = await generateLogo(config);
      const newLogo: GeneratedLogo = {
        id: Date.now().toString(),
        imageUrl,
        prompt: `Modern ${config.style} logo for ${config.brandName}`,
        timestamp: Date.now()
      };
      setCurrentLogo(newLogo);
      setHistory(prev => [newLogo, ...prev]);
    } catch (err) {
      setError("Failed to generate logo. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/\s+/g, '-').toLowerCase()}-logo.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-microchip"></i>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">AutoLogo <span className="text-blue-600">AI</span></h1>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Beta v1.0</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Controls */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Brand Identity</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={config.brandName}
                    onChange={(e) => setConfig({ ...config, brandName: e.target.value })}
                    placeholder="e.g. Nexus AI"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Personality Traits</label>
                  <div className="flex flex-wrap gap-2">
                    {PERSONALITIES.map(p => (
                      <button
                        key={p}
                        onClick={() => handleTogglePersonality(p)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                          config.personality.includes(p)
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Visual Style</label>
                    <select
                      value={config.style}
                      onChange={(e) => setConfig({ ...config, style: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Primary Color</label>
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                      className="w-full h-10 p-1 bg-white border border-slate-200 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`mt-8 w-full py-3 px-4 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Designing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic"></i>
                    Generate Concept
                  </>
                )}
              </button>

              {error && (
                <p className="mt-4 text-xs text-red-500 text-center font-medium">
                  {error}
                </p>
              )}
            </div>

            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
              <h3 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                <i className="fas fa-info-circle"></i>
                Design Brief
              </h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                The AI will prioritize <strong>flat design</strong> principles. No gradients, shadows, or textures are used to ensure maximum scalability across digital and print media.
              </p>
            </div>
          </aside>

          {/* Canvas Area */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Master Preview</span>
                {currentLogo && (
                  <button
                    onClick={() => downloadImage(currentLogo.imageUrl, config.brandName)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                  >
                    <i className="fas fa-download"></i>
                    Export PNG
                  </button>
                )}
              </div>
              
              <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
                {currentLogo ? (
                  <div className="relative group animate-in fade-in zoom-in duration-500">
                    <img
                      src={currentLogo.imageUrl}
                      alt="Generated Logo"
                      className="max-w-full h-auto rounded-xl shadow-2xl border border-slate-100"
                      style={{ maxWidth: '400px' }}
                    />
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-medium text-slate-500 italic">Generated on {new Date(currentLogo.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 max-w-sm">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mx-auto">
                      <i className="fas fa-image text-3xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-400">Your design will appear here</h3>
                    <p className="text-sm text-slate-400">Adjust the settings on the left and hit generate to see your brand identity come to life.</p>
                  </div>
                )}
              </div>
            </section>

            {/* History Grid */}
            {history.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800">Iteration History</h2>
                  <button onClick={() => setHistory([])} className="text-xs text-slate-400 hover:text-slate-600">Clear all</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {history.map(logo => (
                    <div
                      key={logo.id}
                      onClick={() => setCurrentLogo(logo)}
                      className={`relative aspect-square bg-white rounded-2xl border-2 transition-all cursor-pointer group overflow-hidden ${
                        currentLogo?.id === logo.id ? 'border-blue-500 shadow-md ring-4 ring-blue-50' : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <img src={logo.imageUrl} alt="History" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors"></div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-bold text-slate-800">AutoLogo AI</h4>
            <p className="text-sm text-slate-500 mt-1">Empowering the next generation of automated brands.</p>
          </div>
          <div className="flex gap-8 text-slate-400 text-lg">
            <a href="#" className="hover:text-blue-600 transition-colors"><i className="fab fa-github"></i></a>
            <a href="#" className="hover:text-blue-600 transition-colors"><i className="fab fa-dribbble"></i></a>
            <a href="#" className="hover:text-blue-600 transition-colors"><i className="fab fa-twitter"></i></a>
          </div>
          <p className="text-xs text-slate-400">&copy; 2024 DesignForge Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
