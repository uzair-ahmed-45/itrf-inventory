import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Search } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-96">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search equipments..."
              className="bg-transparent border-none outline-none w-full text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          {/* <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button> */}

          {/* User Avatar - Clickable */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/profile')}
            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center cursor-pointer transition-all hover:shadow-lg"
            title="My Profile"
          >
            <User className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;

