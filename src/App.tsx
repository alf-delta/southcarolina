import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SandhillsLanding from './pages/SandhillsLanding';
import StayDetail from './pages/StayDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SandhillsLanding />} />
        <Route path="/stays/:slug" element={<StayDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
