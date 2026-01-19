import {
  File,
  FileImage,
  FileText,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  type LucideProps,
} from 'lucide-react';

export function FileIcon({
  mimeType,
  ...props
}: { mimeType: string | undefined } & LucideProps) {
  if (!mimeType) {
    return <File {...props} />;
  }
  if (mimeType.startsWith('image/')) {
    return <FileImage {...props} />;
  }
  if (mimeType === 'application/pdf') {
    return <FileText {...props} />;
  }
  if (mimeType.startsWith('video/')) {
    return <FileVideo {...props} />;
  }
  if (mimeType.startsWith('audio/')) {
    return <FileAudio {...props} />;
  }
  if (
    mimeType.startsWith('application/zip') ||
    mimeType.startsWith('application/x-rar') ||
    mimeType.startsWith('application/gzip') ||
    mimeType.startsWith('application/x-7z-compressed')
  ) {
    return <FileArchive {...props} />;
  }
  if (
    mimeType.startsWith('text/') ||
    mimeType === 'application/json' ||
    mimeType === 'application/javascript'
  ) {
    return <FileCode {...props} />;
  }
  return <File {...props} />;
}
