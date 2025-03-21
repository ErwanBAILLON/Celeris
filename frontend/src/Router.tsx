import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';

const AppContent = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

const AppRouter = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default AppRouter;