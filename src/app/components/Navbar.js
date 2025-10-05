import Link from 'next/link';
import { FiImage } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
            <FiImage className="text-blue-500" />
            <span>Pro Image Tools</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
