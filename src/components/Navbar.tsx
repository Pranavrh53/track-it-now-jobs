
import { Link } from 'react-router-dom';
import { Plus, Briefcase, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">Track It Now</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <div className="relative group">
            <a 
              href="https://www.ibm.com/certifications" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Certificates</span>
            </a>
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md border border-gray-200 py-2 px-2 hidden group-hover:block z-20">
              <a 
                href="https://www.ibm.com/certifications" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block py-1 px-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                IBM Certificates
              </a>
              <a 
                href="https://coursera.org/share/37498e95d854dc02386cd4c7b69bf29c" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block py-1 px-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Generative AI Certificate
              </a>
              <a 
                href="https://coursera.org/share/09687839f2aac7342329976d9c5c86ff" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block py-1 px-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                AI Professional Certificate
              </a>
            </div>
          </div>
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
