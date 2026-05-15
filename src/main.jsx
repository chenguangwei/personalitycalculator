import { createRoot } from 'react-dom/client';
import { HomePage } from './pages/home/HomePage.jsx';
import { MbtiPage } from './pages/mbti/MbtiPage.jsx';
import { TomodachiPage } from './pages/tomodachi/TomodachiPage.jsx';
import './styles.css';

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';

  if (pathname.endsWith('/mbti-personality-test.html')) return <MbtiPage />;
  if (pathname.endsWith('/tomodachi-life-personality-calculator.html')) return <TomodachiPage />;
  return <HomePage />;
}

createRoot(document.getElementById('root')).render(<App />);
