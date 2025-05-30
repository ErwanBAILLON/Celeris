import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useReminderStore, Reminder } from '../store/reminderStore';
import userService from '../services/user/userService';
import { getOfflineRequests, purgeExpiredRequests } from '../utils/offlineRequests';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore(s => s.user);
  const clearUser = useUserStore(s => s.clearUser);

  const getReminders = useReminderStore(s => s.getReminders);
  const deleteReminder = useReminderStore(s => s.deleteReminder);

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [offlineRequestsOpen, setOfflineRequestsOpen] = useState(false);
  const [offlineRequests, setOfflineRequests] = useState<any[]>([]);
  const offlineDropdownRef = useRef<HTMLDivElement>(null);

  const purgeExpiredRqs = async () => {
    purgeExpiredRequests();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      purgeExpiredRqs();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchOfflineRequests = async () => {
      try {
        const requests = await getOfflineRequests();
        setOfflineRequests(requests || []);
      } catch (err) {
        console.error('Error fetching offline requests:', err);
      }
    };

    fetchOfflineRequests();
    const interval = setInterval(fetchOfflineRequests, 30000);
    return () => clearInterval(interval);
  }, [isOnline]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (offlineDropdownRef.current && !offlineDropdownRef.current.contains(event.target as Node)) {
        setOfflineRequestsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setReminderOpen(false);
    setOfflineRequestsOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const calculateTimeRemaining = (timestamp: string) => {
    const expirationTime = 24 * 60 * 60 * 1000;
    const createdTime = new Date(timestamp).getTime();
    const now = Date.now();
    const timeElapsed = now - createdTime;
    const timeRemaining = expirationTime - timeElapsed;

    if (timeRemaining <= 0) {
      return "Expired";
    }

    const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));

    return `${hours}h ${minutes}m`;
  };

  const getBodyName = (bodyString: string) => {
    try {
      const parsed = JSON.parse(bodyString);
      return parsed.title || parsed.name || "Unnamed";
    } catch (e) {
      return "Invalid body";
    }
  };

  const handleLogout = async () => {
    try {
      if (user.accessToken) {
        await userService.logout();
      }
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      clearUser();
      navigate('/login');
    }
  };

  const handleDeleteReminder = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (!user.accessToken) return;

    try {
      await deleteReminder(id, user.accessToken);

      setReminders(prev => prev.filter(r => r.id !== id));

      const notificationElement = document.createElement('div');
      notificationElement.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notificationElement.textContent = 'Rappel supprimé avec succès';
      document.body.appendChild(notificationElement);

      setTimeout(() => {
        if (document.body.contains(notificationElement)) {
          document.body.removeChild(notificationElement);
        }
      }, 3000);

    } catch (err) {
      console.error('Error deleting reminder:', err);

      const errorElement = document.createElement('div');
      errorElement.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorElement.textContent = 'Erreur lors de la suppression du rappel';
      document.body.appendChild(errorElement);

      setTimeout(() => {
        if (document.body.contains(errorElement)) {
          document.body.removeChild(errorElement);
        }
      }, 3000);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setReminderOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setReminderOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!user.accessToken) return;

    const fetchReminders = async () => {
      try {
        const data = await getReminders(user.accessToken!);
        if (!data) {
          console.error('No reminders found or error fetching reminders');
          return;
        }
        setReminders(data);
      } catch (err) {
        console.error('Error fetching reminders:', err);
      }
    };

    fetchReminders();
  }, [user.accessToken]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date invalide';

      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        ...(isToday ? {} : { day: 'numeric', month: 'short' })
      };

      return `${isToday ? 'Aujourd\'hui' : ''} ${date.toLocaleTimeString('fr-FR', options)}`;
    } catch (e) {
      return 'Date invalide';
    }
  };

  const unreadCount = reminders.filter(r => !r.completed).length;

  return (
    <header className="bg-gradient-to-r from-red-700 to-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/home" className="text-2xl font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Celeris</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/home"
              className={`py-1 hover:text-white transition-all duration-200 border-b-2 ${
                location.pathname === '/home'
                  ? 'border-white text-white font-medium'
                  : 'border-transparent hover:border-white/50'
              }`}
            >
              Projects
            </Link>
            <Link
              to="/calendar"
              className={`py-1 hover:text-white transition-all duration-200 border-b-2 ${
                location.pathname === '/calendar'
                  ? 'border-white text-white font-medium'
                  : 'border-transparent hover:border-white/50'
              }`}
            >
              Calendar
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-6">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setReminderOpen(prev => !prev)}
                className="p-2 rounded-full transition-colors hover:bg-blue-600/50 focus:outline-none relative"
                aria-label="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V9a6 6 0 10-12 0v5c0 .386-.145.735-.405 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {reminderOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white text-gray-800 rounded-lg shadow-xl z-50 overflow-hidden transform transition-all duration-200 ease-out origin-top-right">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium flex justify-between items-center">
                    <h3>Reminders</h3>
                    <span className="bg-white text-blue-600 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                      {reminders.length}
                    </span>
                  </div>

                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                    {reminders.length ? (
                      reminders.map(reminder => (
                        <div key={reminder.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors relative group">
                          <div className="flex justify-between items-start">
                            <h4 className="text-gray-800 font-medium pr-6">{reminder.title}</h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                              {formatDate(reminder.date)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {reminder.title}
                          </p>

                          <button
                            onClick={(e) => handleDeleteReminder(reminder.id, e)}
                            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Supprimer ce rappel"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <p>No reminder</p>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                    <Link to="/reminders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      See all reminders
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={offlineDropdownRef}>
              <button
                onClick={() => setOfflineRequestsOpen(prev => !prev)}
                className="p-2 rounded-full transition-colors hover:bg-blue-600/50 focus:outline-none relative"
                aria-label="Offline Requests"
                title="Offline Requests"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                {offlineRequests.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-xs text-white font-bold">
                    {offlineRequests.length}
                  </span>
                )}
              </button>

              {offlineRequestsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white text-gray-800 rounded-lg shadow-xl z-50 overflow-hidden transform transition-all duration-200 ease-out origin-top-right">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium flex justify-between items-center">
                    <h3>Offline Requests</h3>
                    <span className="bg-white text-orange-500 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                      {offlineRequests.length}
                    </span>
                  </div>

                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                    {offlineRequests.length ? (
                      offlineRequests.map(request => (
                        <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors relative">
                          <div className="flex justify-between items-start">
                            <h4 className="text-gray-800 font-medium flex items-center">
                              <span className={`inline-block px-2 py-1 text-xs rounded-full mr-2 ${
                                request.method === 'POST' ? 'bg-green-100 text-green-800' :
                                request.method === 'PUT' ? 'bg-blue-100 text-blue-800' :
                                request.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {request.method}
                              </span>
                              {getBodyName(request.body)}
                            </h4>
                          </div>
                          <div className="mt-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                              <span>Expires in:</span>
                              <span className="font-medium">{calculateTimeRemaining(request.timestamp)}</span>
                            </div>
                            <div className="mt-1 text-xs text-gray-500 truncate">
                              {request.url}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <p>No pending offline requests</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div title={isOnline ? 'Online' : 'Offline'} className="p-2">
              {isOnline ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.832 12.06a15.952 15.952 0 0118.336 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.655 15.272a10.968 10.968 0 0112.688 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.48 18.485a6 6 0 017.04 0" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.832 12.06a15.952 15.952 0 0118.336 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.655 15.272a10.968 10.968 0 0112.688 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.48 18.485a6 6 0 017.04 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              )}
            </div>

            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate">{user.username}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl z-50 scale-0 group-hover:scale-100 transform transition-all duration-150 origin-top-right opacity-0 group-hover:opacity-100">
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-red-50 text-red-600 flex items-center space-x-2 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={() => setReminderOpen(prev => !prev)}
              className="p-2 rounded-full transition-colors hover:bg-blue-600/50 focus:outline-none relative"
              aria-label="Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V9a6 6 0 10-12 0v5c0 .386-.145.735-.405 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setOfflineRequestsOpen(prev => !prev)}
              className="p-2 rounded-full transition-colors hover:bg-blue-600/50 focus:outline-none relative"
              aria-label="Offline Requests"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              {offlineRequests.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-xs text-white font-bold">
                  {offlineRequests.length > 9 ? '9+' : offlineRequests.length}
                </span>
              )}
            </button>

            <div title={isOnline ? 'Online' : 'Offline'} className="p-2">
              {isOnline ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.832 12.06a15.952 15.952 0 0118.336 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.655 15.272a10.968 10.968 0 0112.688 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.48 18.485a6 6 0 017.04 0" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.832 12.06a15.952 15.952 0 0118.336 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.655 15.272a10.968 10.968 0 0112.688 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.48 18.485a6 6 0 017.04 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-60' : 'max-h-0'}`}>
        <div className="container mx-auto px-4 pb-3 space-y-1">
          <Link to="/home" className="block py-2 px-3 rounded-md hover:bg-blue-600/40">
            Projects
          </Link>
          <Link to="/calendar" className="block py-2 px-3 rounded-md hover:bg-blue-600/40">
            Calendar
          </Link>
          <Link to="/reminders" className="block py-2 px-3 rounded-md hover:bg-blue-600/40">
            Reminders
          </Link>
          <hr className="border-blue-400/30 my-2" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center py-2 px-3 text-white rounded-md hover:bg-blue-600/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {reminderOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50 max-h-96 overflow-y-auto" ref={dropdownRef}>
          <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium">
            <h3>Reminders ({reminders.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {reminders.length ? (
              reminders.map(reminder => (
                <div key={reminder.id} className="p-4 hover:bg-gray-50 relative">
                  <div className="flex justify-between items-start pr-6">
                    <h4 className="text-gray-800 font-medium">{reminder.title}</h4>
                    <span className="text-xs text-gray-500">{formatDate(reminder.date)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{reminder.title}</p>

                  <button
                    onClick={(e) => handleDeleteReminder(reminder.id, e)}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 rounded-full"
                    title="Delete this reminder"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No reminder</div>
            )}
          </div>
          <Link to="/reminders" className="block p-3 bg-gray-50 text-center text-blue-600 font-medium">
            See all reminders
          </Link>
        </div>
      )}

      {offlineRequestsOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50 max-h-96 overflow-y-auto" ref={offlineDropdownRef}>
          <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium">
            <h3>Offline Requests ({offlineRequests.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {offlineRequests.length ? (
              offlineRequests.map(request => (
                <div key={request.id} className="p-4 hover:bg-gray-50 relative">
                  <div className="flex justify-between items-start">
                    <h4 className="text-gray-800 font-medium flex items-center">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mr-2 ${
                        request.method === 'POST' ? 'bg-green-100 text-green-800' :
                        request.method === 'PUT' ? 'bg-blue-100 text-blue-800' :
                        request.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.method}
                      </span>
                      {getBodyName(request.body)}
                    </h4>
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Expires in:</span>
                      <span className="font-medium">{calculateTimeRemaining(request.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No pending offline requests</div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
