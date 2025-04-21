import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, Tractor, FileText, Leaf, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  

  return (
    <footer className="bg-primary-900 text-white pt-8 pb-6">

        <div className="mt-1 pt-0  border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} GramaSathi. All rights reserved.</p>
        </div>
      
    </footer>
  );
};

export default Footer;