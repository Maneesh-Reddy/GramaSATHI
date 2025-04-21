import React from 'react';
import { ExternalLink } from 'lucide-react';

interface CardProps {
  title: string;
  content: string;
  image?: string;
  date?: string;
  location?: string;
  link?: string;
  linkText?: string;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  image,
  date,
  location,
  link,
  linkText,
  onClick,
  className = '',
}) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
      )}
      
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
        
        {(date || location) && (
          <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-600">
            {date && <span className="bg-gray-100 px-2 py-1 rounded">{date}</span>}
            {location && <span className="bg-gray-100 px-2 py-1 rounded">{location}</span>}
          </div>
        )}
        
        <p className="text-gray-600 mb-4">{content}</p>
        
        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            {linkText || 'Learn more'}
            <ExternalLink size={16} className="ml-1" />
          </a>
        )}
      </div>
    </div>
  );
};

export default Card;