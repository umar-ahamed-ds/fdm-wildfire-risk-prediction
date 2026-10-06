import { Routes, Route } from 'react-router-dom';
import WildfireRiskLandingPage from './pages/WildfireRisklandingpage';
import WildfireDashboard from './pages/WildfireDashboard';
import PredictionHistoryPage from './pages/PredictionHistoryPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<WildfireRiskLandingPage />} />
      <Route path="/predict" element={<WildfireDashboard />} />
      <Route path="/history" element={<PredictionHistoryPage />} />
    </Routes>
  );
}

export default App;
