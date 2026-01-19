import { DocumentCategory } from "@/app/page";


// For files held in the beneficiary uploader state before sending
export interface ClientFile {
  file: File;
  objectUrl: string;
}

// Mirrors the structure of the 'file' object in a 'Task' from the backend API
// Used in the provider viewer
export interface ServerFile {
  id: string;
  token: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  progress: number;
  uploadedAt: Date;
  category: DocumentCategory;
  clientName: string;
  compressedUrl?: string;
  compressedSize?: number;
  errorMessage?: string;
  url?: string;
}


// Mirrors the type from the backend API to ensure type safety
export interface TaskResult {
    analysis: {
        documentType: string;
        isMatch: boolean;
        reason: string;
    };
    compression: {
        compressionAlgorithm: string;
        originalSizeInBytes: number;
        finalSizeInBytes: number;
        savingsPercentage: number;
        additionalNotes: string;
    };
    url: string; 
    compressedUrl: string;
}

// This type is used by the backend API route internally
export interface FyaaFile {
  id: string;
  token?: string;
  name: string;
  size: number;
  type: string;
  category: DocumentCategory;
  clientName: string;
  status: 'pending' | 'uploading' | 'processing' | 'done' | 'error';
  progress: number;
  uploadedAt: Date;
  file?: File;
  objectUrl?: string;
  url?: string;
  compressedUrl?: string;
  compressedSize?: number;
  errorMessage?: string;
}
