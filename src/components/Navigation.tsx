import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, MessageCircle, Bell, Search, PenLine, Menu, X, LogOut, Settings, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, logout } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/feed' },
    { icon: TrendingUp, label: 'News', path: '/news' },
    { icon: Compass, label: 'Discover', path: '/discover' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F4F1EC]/95 backdrop-blur-md border-b border-[#D9D5CE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/feed" className="flex items-center">
              <span className="font-display text-2xl font-bold text-[#141416]">SAYA</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all ${isActive(item.path) ? 'bg-[#141416] text-[#F4F1EC]' : 'text-[#6E6A63] hover:bg-[#E8E4DE] hover:text-[#141416]'}`}>
                  <item.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/search')} className="p-2 rounded-lg text-[#6E6A63] hover:bg-[#E8E4DE]">
                <Search className="w-5 h-5" />
              </button>
              <Button onClick={() => navigate('/write')} className="hidden sm:flex items-center gap-2 bg-[#141416] hover:bg-[#2a2a2c] text-[#F4F1EC]">
                <PenLine className="w-4 h-4" /><span>Write</span>
              </Button>
              {profile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1 rounded-full hover:bg-[#E8E4DE]">
                      <img src={profile.avatar || ''} alt={profile.name || ''} className="w-8 h-8 rounded-full object-cover border-2 border-[#D9D5CE]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#F4F1EC] border-[#D9D5CE]">
                    <div className="px-3 py-2 border-b border-[#D9D5CE]">
                      <p className="font-medium text-[#141416]">{profile.name}</p>
                      <p className="text-sm text-[#6E6A63]">@{profile.username}</p>
                    </div>
                    <DropdownMenuItem onClick={() => navigate(`/profile/${profile.username}`)} className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#D9D5CE]" />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-[#6E6A63] hover:bg-[#E8E4DE]">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-[#F4F1EC] border-b border-[#D9D5CE] p-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive(item.path) ? 'bg-[#141416] text-[#F4F1EC]' : 'text-[#6E6A63] hover:bg-[#E8E4DE]'}`}>
                  <item.icon className="w-5 h-5" /><span>{item.label}</span>
                </Link>
              ))}
              <Link to="/write" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#B48C5A] text-white">
                <PenLine className="w-5 h-5" /><span>Write</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="h-16" />
    </>
  );
}
