import React from 'react';
import VoiceInstructionButton from './VoiceInstructionButton';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  instructionKey: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, instructionKey }) => {
  return (
    <div className="bg-primary-100 py-8 px-4 sm:px-6 lg:px-8 mb-8 rounded-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary-800">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-lg text-primary-600">{subtitle}</p>
            )}
          </div>
          <div className="mt-4 md:mt-0">
            <VoiceInstructionButton instructionKey={instructionKey} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;