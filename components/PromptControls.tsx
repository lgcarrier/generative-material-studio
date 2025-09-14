
import React, { useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  baseImage: { file: File; data: string } | null;
  setBaseImage: (image: { file: File; data: string; mimeType: string } | null) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const toBase64 = <T extends File,>(file: T): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

export const PromptControls: React.FC<PromptControlsProps> = ({
  prompt,
  setPrompt,
  baseImage,
  setBaseImage,
  onGenerate,
  isLoading,
}) => {

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) { // 4MB limit for inline data
          alert("File size exceeds 4MB. Please choose a smaller image.");
          return;
      }
      const data = await toBase64(file);
      setBaseImage({ file, data, mimeType: file.type });
    }
  }, [setBaseImage]);

  return (
    <div className="bg-brand-gray-dark p-6 rounded-lg border border-brand-gray-medium h-full flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-brand-cyan">Material Controls</h2>
      
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          1. Describe the Material Transformation
        </label>
        <textarea
          id="prompt"
          rows={5}
          className="w-full bg-brand-gray-medium border border-brand-gray-light rounded-md p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
          placeholder="e.g., 'a desert road that becomes flooded after a flash rainstorm'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          2. (Optional) Provide a Base Texture
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-gray-light border-dashed rounded-md">
            <div className="space-y-1 text-center">
                {baseImage ? (
                    <div>
                        <img src={`data:image/png;base64,${baseImage.data}`} alt="Preview" className="mx-auto h-24 w-24 object-cover rounded-md" />
                        <p className="text-xs text-gray-400 mt-2 truncate max-w-xs">{baseImage.file.name}</p>
                        <button onClick={() => setBaseImage(null)} className="text-xs text-red-400 hover:text-red-300 mt-1" disabled={isLoading}>Remove</button>
                    </div>
                ) : (
                    <>
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
                        <div className="flex text-sm text-gray-400">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-brand-gray-dark rounded-md font-medium text-brand-blue hover:text-brand-cyan focus-within:outline-none"
                        >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" disabled={isLoading} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 4MB</p>
                    </>
                )}
            </div>
        </div>
      </div>
      
      <button
        onClick={onGenerate}
        disabled={isLoading || !prompt}
        className="w-full flex items-center justify-center gap-3 bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-sky-500 transition-all duration-300 disabled:bg-brand-gray-light disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Material...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5"/>
            Generate Material
          </>
        )}
      </button>
    </div>
  );
};
