
import { Link } from 'react-router-dom';
import { Plus, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">Track It Now</span>
        </Link>
        
        <nav>
          <Link to="/add">
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Job</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
