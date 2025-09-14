
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptControls } from './components/PromptControls';
import { MaterialOutput } from './components/MaterialOutput';
import type { GeneratedMaterial } from './types';
import { generateNextTexture, generateShaderLogic } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("a stone wall that gets mossy over time");
  const [baseImage, setBaseImage] = useState<{ file: File; data: string; mimeType: string; } | null>(null);
  const [generatedMaterials, setGeneratedMaterials] = useState<GeneratedMaterial[]>([]);
  const [shaderCode, setShaderCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');


  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a material description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedMaterials([]);
    setShaderCode('');
    setLoadingMessage('Initializing material sequence...');

    try {
        const materialSequence: GeneratedMaterial[] = [];
        let currentImageState: { data: string; mimeType: string; } | null = null;
        
        // If there's a base image, use it as the first state.
        if (baseImage) {
            currentImageState = { data: baseImage.data, mimeType: baseImage.mimeType };
            materialSequence.push({
                id: `material_0_${Date.now()}`,
                imageData: baseImage.data,
            });
            setGeneratedMaterials([...materialSequence]);
        }

        const totalStates = 4;
        const startLoop = baseImage ? 1 : 0;

        // Iteratively generate textures
        for (let i = startLoop; i < totalStates; i++) {
            setLoadingMessage(`Generating state ${i + 1} of ${totalStates}...`);
            
            const newImageData = await generateNextTexture(prompt, currentImageState);
            
            // The model can return different image types, but we'll treat them as PNG for display.
            currentImageState = { data: newImageData, mimeType: 'image/png' }; 
            materialSequence.push({
                id: `material_${i}_${Date.now()}`,
                imageData: newImageData,
            });
            setGeneratedMaterials([...materialSequence]);
        }

        // Generate shader logic at the end
        setLoadingMessage('Generating shader logic...');
        const finalShaderCode = await generateShaderLogic(prompt);
        setShaderCode(finalShaderCode);

    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Generation failed: ${errorMessage} Check the console for more details.`);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [prompt, baseImage]);

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 xl:col-span-3">
          <PromptControls
            prompt={prompt}
            setPrompt={setPrompt}
            baseImage={baseImage}
            setBaseImage={setBaseImage}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-8 xl:col-span-9">
          <MaterialOutput
            materials={generatedMaterials}
            shaderCode={shaderCode}
            isLoading={isLoading}
            error={error}
            loadingMessage={loadingMessage}
          />
        </div>
      </main>
      <footer className="text-center p-4 text-xs text-gray-500">
        <p>Powered by Gemini. For creative and illustrative purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
