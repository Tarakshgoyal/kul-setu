import { Link, useLocation } from 'react-router-dom';
import { Home, UserPlus, Search, Heart, TreePine } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/register', label: 'Register Family', icon: UserPlus },
    { path: '/search', label: 'Search Family', icon: Search },
    { path: '/tree', label: 'Family Tree', icon: TreePine },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-spiritual font-bold text-xl">
            <Heart className="w-6 h-6 text-spiritual animate-glow" />
            <span className="bg-gradient-spiritual bg-clip-text text-transparent">Kul Setu</span>
          </Link>
          
          <div className="flex space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-spiritual text-spiritual-foreground shadow-spiritual'
                    : 'text-muted-foreground hover:text-spiritual hover:bg-spiritual/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;