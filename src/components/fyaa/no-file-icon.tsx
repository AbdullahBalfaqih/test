import { File, Ban } from 'lucide-react';

export function NoFileIcon({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <File className="w-full h-full text-gray-300" strokeWidth={1} />
      <Ban
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 text-red-500/70"
        strokeWidth={1.5}
      />
    </div>
  );
}
