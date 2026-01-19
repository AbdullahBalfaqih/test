'use client';

import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileIcon } from './file-icon';
import { Download, ChevronsUpDown } from 'lucide-react';
import { ServerFile } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import { PdfViewer } from './pdf-viewer';

const documentCategoryDisplay: Record<string, string> = {
    lawsuit: 'لائحة دعوى',
    supporting: 'مرفقات مساندة',
    proxy: 'الوكالة'
};


export function ProviderViewer() {
  const [filesByClient, setFilesByClient] = useState<Record<string, ServerFile[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Ensure loading is true at the start
        if (!isLoading) setIsLoading(true);

        const response = await fetch('/api/upload');
        if (!response.ok) {
          throw new Error('فشل في جلب قائمة الملفات');
        }
        const files: ServerFile[] = await response.json();
        
        const grouped = files.reduce((acc, file) => {
          const clientName = file.clientName;
          if (!acc[clientName]) {
            acc[clientName] = [];
          }
          acc[clientName].push(file);
          return acc;
        }, {} as Record<string, ServerFile[]>);

        setFilesByClient(grouped);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-destructive">{error}</div>;
  }

  if (Object.keys(filesByClient).length === 0) {
    return <div className="text-center text-muted-foreground pt-10">لا توجد ملفات مرسلة بعد.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="p-2 bg-card rounded-md font-semibold flex justify-between">
        <span>اسم المستفيد</span>
        <span>الملفات</span>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-2" defaultValue={Object.keys(filesByClient)[0]}>
        {Object.entries(filesByClient).map(([clientName, files]) => (
          <AccordionItem value={clientName} key={clientName} className="border-none">
            <div className="bg-card p-2 rounded-md">
                <AccordionTrigger>
                    <div className="flex items-center justify-between w-full">
                        <span>{clientName}</span>
                        <Badge variant="secondary">{`${files.length} ملفات`}</Badge>
                    </div>
                </AccordionTrigger>
            </div>
            <AccordionContent className="p-2 space-y-2">
              {files.map((file) => (
                <Collapsible key={file.id} className="border rounded-md bg-background">
                    <div className="flex items-center justify-between p-3 w-full">
                        <CollapsibleTrigger asChild>
                           <div role="button" className="flex items-center gap-4 text-right flex-grow justify-start w-full cursor-pointer">
                            <FileIcon mimeType={file.type} className="h-7 w-7 text-muted-foreground" />
                                <div className="text-right">
                                    <div className="font-semibold text-foreground">{file.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {documentCategoryDisplay[file.category] || file.category} - {((file.compressedSize || 0) / 1024).toFixed(1)} KB
                                    </div>
                                </div>
                                <ChevronsUpDown className="h-4 w-4 text-muted-foreground mr-auto" />
                            </div>
                        </CollapsibleTrigger>
                        <a href={file.compressedUrl} download={`${file.name}.zip`} className="flex-shrink-0 mr-4">
                            <Button variant="outline" size="sm">
                                <Download className="ml-2 h-4 w-4" />
                                تحميل
                            </Button>
                        </a>
                    </div>
                    <CollapsibleContent>
                       <div className="p-4 bg-muted/10 border-t">
                         <div className="rounded-lg shadow-lg border overflow-hidden bg-white flex flex-col h-96">
                            <div className="flex-1 min-h-0 overflow-auto">
                              {(file.url && file.type.startsWith('image/')) ? (
                                  <Image
                                      src={file.url}
                                      alt={`معاينة ${file.name}`}
                                      width={800}
                                      height={600}
                                      className="w-full h-full object-contain"
                                  />
                              ) : (file.url && file.type === 'application/pdf') ? (
                                  <PdfViewer fileUrl={file.url} />
                              ) : (
                                  <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/30">
                                      المعاينة غير متاحة لهذا النوع من الملفات
                                  </div>
                              )}
                            </div>
                            {file.url && (
                              <div className="preview-footer">
                                  <a href={file.url} download={file.name} className="preview-footer-button" title="تحميل الملف الأصلي">
                                      <Download className="w-4 h-4" />
                                  </a>
                              </div>
                            )}
                          </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
