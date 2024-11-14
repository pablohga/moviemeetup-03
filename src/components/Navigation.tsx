import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Film, 
  LogIn, 
  Plus,
  Search,
  Menu as MenuIcon,
  X,
  Play,
  Radio,
  Compass,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import { UserMenu } from './UserMenu';
import { LoginModal } from './auth/LoginModal';
import { NotificationCenter } from './notifications/NotificationCenter';

export function Navigation() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTestMenuOpen, setIsTestMenuOpen] = useState(false);

  // Mock active watch party for demo
  const activeWatchParty = {
    id: '1',
    title: 'Maratona Marvel'
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <Film className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">MovieMeetup</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Test Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsTestMenuOpen(!isTestMenuOpen)}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <span>Teste</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                
                {isTestMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1">
                    <Link
                      to="/discover"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => setIsTestMenuOpen(false)}
                    >
                      <Compass className="w-4 h-4 mr-2" />
                      Descobrir
                    </Link>
                    <Link
                      to="/watch-party/1"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => setIsTestMenuOpen(false)}
                    >
                      <Radio className="w-4 h-4 mr-2" />
                      Interação em Tempo Real
                    </Link>
                    {isAuthenticated && activeWatchParty && (
                      <Link
                        to={`/watch-party/${activeWatchParty.id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsTestMenuOpen(false)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {activeWatchParty.title}
                      </Link>
                    )}
                  </div>
                )}
              </div>
              
              <a href="#community" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Comunidade
              </a>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => navigate('/watch-party/create')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Watch Party
                  </button>
                  <NotificationCenter />
                  <UserMenu />
                </>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/discover"
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <Compass className="w-4 h-4 inline-block mr-2" />
                Descobrir
              </Link>
              <Link 
                to="/watch-party/1" 
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <Radio className="w-4 h-4 inline-block mr-2" />
                Interação em Tempo Real
              </Link>
              {isAuthenticated && activeWatchParty && (
                <button 
                  onClick={() => {
                    navigate(`/watch-party/${activeWatchParty.id}`);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  {activeWatchParty.title}
                </button>
              )}
              <a href="#community" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Comunidade
              </a>
              {isAuthenticated && (
                <button 
                  onClick={() => {
                    navigate('/watch-party/create');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Criar Watch Party
                </button>
              )}
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}