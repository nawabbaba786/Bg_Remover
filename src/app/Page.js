import ToolCard from './components/ToolCard';
import { FaMagic, FaCompressArrowsAlt } from 'react-icons/fa';

export default function Home() {
  const tools = [
    {
      icon: <FaMagic />,
      title: 'Background Remover',
      description: 'Remove background from any image and select specific objects to keep.',
      href: '/background-remover',
    },
    {
      icon: <FaCompressArrowsAlt />,
      title: 'Image Resizer & Compressor',
      description: 'Easily resize, compress, and reduce the file size of your images.',
      href: '/image-resizer',
    },
  ];

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
        Free & Powerful Image Editing Tools
      </h1>
      <p className="text-lg text-gray-600 mb-12">
        Edit your images with professional-grade tools, right in your browser.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            href={tool.href}
          />
        ))}
      </div>
    </div>
  );
                   }
