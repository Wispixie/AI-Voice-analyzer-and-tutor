
import React, { useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      onFileSelect(file);
    } else if (file) {
      alert("Please upload an audio file.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label 
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
          ${isLoading ? 'border-indigo-500 bg-indigo-500/10 cursor-not-allowed' : 'border-zinc-800 hover:border-indigo-500 hover:bg-zinc-900/50'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <i className={`fas fa-microphone-lines text-4xl mb-4 ${isLoading ? 'animate-pulse text-indigo-400' : 'text-zinc-500'}`}></i>
          <p className="mb-2 text-sm text-zinc-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-zinc-500">MP3, WAV, or AAC (Max 10MB)</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="audio/*" 
          onChange={handleChange} 
          disabled={isLoading}
        />
      </label>
    </div>
  );
};

export default FileUpload;
