import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  Users,
  LogOut,
  Menu,
  X,
  WifiOff,
  Wifi
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function MainLayout({ children, currentView, onViewChange }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const isOnline = useOnlineStatus();

  const handleSignOut = async () => {
    if (confirm('Deseja realmente sair?')) {
      await signOut();
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Indicadores', icon: LayoutDashboard },
    { id: 'plano', label: 'Plano Anual', icon: ClipboardList },
    { id: 'regionais', label: 'Regionais', icon: MapPin },
    { id: 'responsaveis', label: 'Responsáveis', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <ClipboardList className="w-8 h-8" />
              <h1 className="text-xl font-bold">Plano Anual de Segurança</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <>
                    <Wifi className="w-5 h-5 text-green-300" />
                    <span className="text-sm hidden sm:inline">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-red-300" />
                    <span className="text-sm hidden sm:inline">Offline</span>
                  </>
                )}
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg transition-transform duration-300 ease-in-out lg:block`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {!isOnline && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <WifiOff className="w-5 h-5" />
              <span>Você está offline. Algumas funcionalidades podem estar limitadas.</span>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
