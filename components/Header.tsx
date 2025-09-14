
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="text-center p-6 border-b border-brand-gray-medium">
        <div className="flex items-center justify-center gap-4">
            <SparklesIcon className="w-10 h-10 text-brand-blue" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-brand-cyan text-transparent bg-clip-text">
                Generative Material Studio
            </h1>
        </div>
      <p className="mt-2 text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
        Author entire material pipelines with AI. Describe a transformation, and generate interconnected textures and shader logic.
      </p>
    </header>
  );
};
