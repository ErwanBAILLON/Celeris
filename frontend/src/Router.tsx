import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound/NotFound';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import NotificationPermission from './components/NotificationPermission';
import NetworkStatusNotification from './components/NetworkStatusNotification';
import HomePage from './pages';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectsPage from './pages/ProjectsPage';
import NewProjectPage from './pages/NewProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import Header from './components/Header';
import CalendarPage from './pages/Calendar/CalendarPage';
import { useUserStore } from './store/userStore';

const AppContent = () => {

  const user = useUserStore(state => state.user);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <ProjectsPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/new"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <NewProjectPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <ProjectDetailPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <CalendarPage token={user.accessToken || ''} />
              </>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
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
