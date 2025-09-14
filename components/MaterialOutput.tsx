import React, { useState, useMemo, useEffect } from 'react';
import type { GeneratedMaterial } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';


interface MaterialOutputProps {
  materials: GeneratedMaterial[];
  shaderCode: string;
  isLoading: boolean;
  error: string | null;
  loadingMessage?: string;
}

const Placeholder: React.FC = () => (
    <div className="w-full aspect-square bg-brand-gray-medium rounded-lg flex flex-col items-center justify-center text-center p-8 border border-brand-gray-light animate-pulse-slow">
        <SparklesIcon className="w-16 h-16 text-brand-gray-light mb-4" />
        <h3 className="text-lg font-semibold text-gray-300">Your Material Appears Here</h3>
        <p className="text-sm text-gray-500">Describe a transformation and click "Generate" to start.</p>
    </div>
);

interface LoadingStateProps {
    isLoading: boolean;
    message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ isLoading, message }) => {
    const messages = useMemo(() => [
        "Warming up the material forge...",
        "Teaching pixels to dream...",
        "Compiling procedural magic...",
        "Generating texture dimensions...",
        "Polishing shader instructions...",
    ], []);
    const [messageIndex, setMessageIndex] = useState(0);

    React.useEffect(() => {
        if (!isLoading || message) return; // Don't cycle if a specific message is shown
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [messages, isLoading, message]);

    if (!isLoading) return null;

    return (
        <div className="w-full aspect-square bg-brand-gray-medium rounded-lg flex flex-col items-center justify-center text-center p-8 border border-brand-blue/50">
            <svg className="animate-spin h-12 w-12 text-brand-blue mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-gray-100 transition-opacity duration-500">{message || messages[messageIndex]}</h3>
            <p className="text-sm text-gray-400 mt-1">This can take a moment, especially for complex materials.</p>
        </div>
    );
};


export const MaterialOutput: React.FC<MaterialOutputProps> = ({ materials, shaderCode, isLoading, error, loadingMessage }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Reset slider and pause playback when materials change
  useEffect(() => {
    setIsPlaying(false);
    setSliderValue(materials.length > 0 ? materials.length - 1 : 0);
  }, [materials.length]);

  // Animation effect
  useEffect(() => {
    if (isPlaying && materials.length > 1) {
        const interval = setInterval(() => {
            setSliderValue(prev => (prev + 1) % materials.length);
        }, 1000); // 1 second per state
        return () => clearInterval(interval);
    }
  }, [isPlaying, materials.length]);


  if (isLoading) {
    return (
        <div className="space-y-6">
            <LoadingState isLoading={isLoading} message={loadingMessage} />
            {materials.length > 0 && (
                 <div className="grid grid-cols-4 gap-2 sm:gap-4">
                    {materials.map((material, index) => (
                         <div key={material.id} className="aspect-square bg-brand-gray-medium rounded-lg overflow-hidden border border-brand-gray-light">
                             <img src={`data:image/png;base64,${material.imageData}`} alt={`Generated state ${index + 1}`} className="w-full h-full object-cover"/>
                         </div>
                    ))}
                    {[...Array(4 - materials.length)].map((_, i) => (
                        <div key={`placeholder-${i}`} className="aspect-square bg-brand-gray-medium rounded-lg" />
                    ))}
                 </div>
            )}
        </div>
    );
  }
  
  if (error) {
      return (
          <div className="w-full aspect-square bg-red-900/20 border border-red-500 rounded-lg flex flex-col items-center justify-center p-8 text-center">
              <h3 className="text-xl font-semibold text-red-400">Generation Failed</h3>
              <p className="text-red-300 mt-2 text-sm max-w-md">{error}</p>
          </div>
      );
  }

  if (materials.length === 0) {
    return <div className="space-y-6"><Placeholder /></div>;
  }

  const selectedMaterial = materials[sliderValue];

  return (
    <div className="space-y-6">
      <div className="w-full aspect-square bg-brand-gray-medium rounded-lg overflow-hidden border border-brand-gray-light">
          {selectedMaterial && (
            <img 
                src={`data:image/png;base64,${selectedMaterial.imageData}`} 
                alt={`Material state ${sliderValue + 1}`} 
                className="w-full h-full object-cover"
            />
          )}
      </div>

      <div className="bg-brand-gray-dark p-4 sm:p-6 rounded-lg border border-brand-gray-medium">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 rounded-full text-gray-300 hover:bg-brand-gray-medium hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray-dark focus:ring-brand-blue"
                    aria-label={isPlaying ? "Pause transformation preview" : "Play transformation preview"}
                    disabled={materials.length < 2}
                >
                    {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
                </button>
                <h3 className="font-semibold text-gray-200 text-lg">Preview Transformation</h3>
            </div>
            <span className="text-sm text-gray-300 font-mono bg-brand-gray-medium px-2 py-1 rounded-md">
                State {sliderValue + 1} / {materials.length}
            </span>
        </div>
  
        <div className="mb-4">
            <input
                type="range"
                min="0"
                max={materials.length - 1}
                step="1"
                value={sliderValue}
                onChange={(e) => {
                    setIsPlaying(false);
                    setSliderValue(parseInt(e.target.value, 10));
                }}
                className="w-full h-2 bg-brand-gray-light rounded-lg appearance-none cursor-pointer accent-brand-blue"
                aria-label="Material state slider"
            />
        </div>
  
        <div className="flex justify-between mt-2">
            {materials.map((material, index) => (
                <div key={material.id} className="flex flex-col items-center text-center w-1/4 px-1">
                    <button 
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray-dark focus:ring-brand-blue ${index === sliderValue ? 'border-brand-blue scale-105 shadow-lg shadow-brand-blue/20' : 'border-transparent hover:border-brand-gray-light'}`}
                        onClick={() => {
                            setIsPlaying(false);
                            setSliderValue(index);
                        }}
                        aria-label={`Select material state ${index + 1}`}
                    >
                        <img src={`data:image/png;base64,${material.imageData}`} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                    </button>
                    <span className={`text-xs mt-2 transition-colors ${index === sliderValue ? 'text-white font-medium' : 'text-gray-400'}`}>{index + 1}</span>
                </div>
            ))}
        </div>
  
        <p className="text-center text-xs text-gray-500 mt-5 italic">
            Drag the slider or click a thumbnail to preview the material's transformation.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-brand-cyan mb-2">Generated Shader Logic</h3>
        <div className="bg-brand-gray-dark p-4 rounded-lg border border-brand-gray-medium max-h-96 overflow-y-auto">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
            <code>
              {shaderCode}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
