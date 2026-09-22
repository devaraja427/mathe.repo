import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { Dashboard } from './pages/Dashboard';
import { NewAnalysis } from './pages/NewAnalysis';
import { Results } from './pages/Results';
import { MathSteps } from './pages/MathSteps';
import { Visualization } from './pages/Visualization';
import { History } from './pages/History';
import { About } from './pages/About';
import { Help } from './pages/Help';
import { AnalysisResponse } from './types/analysis';
import { checkBackendHealth } from './services/api';
import { analyzeAcademicPerformanceClient } from './services/clientMath';
import { AIAssistant } from './components/AIAssistant/AIAssistant';

const INITIAL_SAMPLE = [
  { name: 'Mathematics', marks: 92 },
  { name: 'Physics', marks: 84 },
  { name: 'Programming', marks: 95 },
  { name: 'Data Structures', marks: 89 },
  { name: 'Database Systems', marks: 82 },
  { name: 'Computer Networks', marks: 78 },
  { name: 'Operating Systems', marks: 85 },
  { name: 'Communication Skills', marks: 80 },
];

export const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResponse | null>(null);

  // Health check and initial sample analysis
  useEffect(() => {
    // Generate immediate default analysis so results & visualizations have rich initial content
    const sample = analyzeAcademicPerformanceClient(INITIAL_SAMPLE, 'Aarav Sharma');
    sample.id = 1;
    sample.created_at = new Date().toISOString();
    setCurrentAnalysis(sample);

    // Check backend health
    const verifyHealth = async () => {
      const online = await checkBackendHealth();
      setIsBackendOnline(online);
    };
    verifyHealth();

    const interval = setInterval(verifyHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalysisSuccess = (analysis: AnalysisResponse) => {
    setCurrentAnalysis(analysis);
    setCurrentPage('results');
  };

  const handleSelectHistoryItem = (analysis: AnalysisResponse) => {
    setCurrentAnalysis(analysis);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        isBackendOnline={isBackendOnline}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          hasCurrentAnalysis={currentAnalysis !== null}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 lg:px-8 py-8 lg:ml-64 transition-all overflow-x-hidden">
          {currentPage === 'dashboard' && (
            <Dashboard onNavigate={setCurrentPage} latestAnalysis={currentAnalysis} />
          )}

          {currentPage === 'new-analysis' && (
            <NewAnalysis onAnalysisSuccess={handleAnalysisSuccess} />
          )}

          {currentPage === 'results' && currentAnalysis && (
            <Results analysis={currentAnalysis} onNavigate={setCurrentPage} />
          )}

          {currentPage === 'math-steps' && currentAnalysis && (
            <MathSteps analysis={currentAnalysis} />
          )}

          {currentPage === 'visualization' && currentAnalysis && (
            <Visualization analysis={currentAnalysis} />
          )}

          {currentPage === 'history' && (
            <History
              onSelectAnalysis={handleSelectHistoryItem}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'about' && <About />}

          {currentPage === 'help' && <Help />}
        </main>
      </div>

      <Footer />

      {/* Floating AI Assistant Widget */}
      <AIAssistant
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
