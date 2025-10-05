import Link from 'next/link';

const ToolCard = ({ icon, title, description, href }) => {
  return (
    <Link href={href}>
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer h-full">
        <div className="text-4xl text-blue-500 mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

export default ToolCard;
