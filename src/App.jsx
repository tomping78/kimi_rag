import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Chattt from './pages/chattt';

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-tc-light dark:bg-black text-black dark:text-white font-sans selection:bg-black/10 dark:selection:bg-white/10 relative overflow-hidden transition-colors duration-500">

        {/* Navigation (Global) */}
        <Header />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chattt" element={<Chattt />} />
        </Routes>

      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
