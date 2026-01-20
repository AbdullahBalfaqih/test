'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { PdfViewer } from './pdf-viewer';
import Image from 'next/image';
import { Download, Printer, RefreshCw, Trash2, ChevronDown } from 'lucide-react';
import { DocumentCategory } from '@/app/page';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { NoFileIcon } from '@/components/fyaa/no-file-icon';
import { Checkbox } from '../ui/checkbox';
import { PrivacyPolicy } from './privacy-policy';

interface UploadedFile {
  file: File;
  url: string;
}

const documentCategories: { id: DocumentCategory; title: string }[] = [
  { id: 'lawsuit', title: 'لائحة دعوى' },
  { id: 'supporting', title: 'مرفقات مساندة' },
  { id: 'proxy', title: 'الوكالة' },
];

const FilePreview = ({ uploadedFile, onReupload, onDelete }: { uploadedFile: UploadedFile; onReupload: () => void; onDelete: () => void; }) => {
  return (
    <div className="rounded-lg shadow-lg border overflow-hidden bg-white flex flex-col h-96">
       <div className="flex-1 min-h-0 overflow-auto">
        {uploadedFile.file.type.startsWith('image/') ? (
          <Image
            src={uploadedFile.url}
            alt="معاينة المرفق"
            width={800}
            height={600}
            className="w-full h-full object-contain"
          />
        ) : uploadedFile.file.type === 'application/pdf' ? (
          <PdfViewer fileUrl={uploadedFile.url} />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted/30 text-gray-500">
            لا يمكن معاينة هذا النوع من الملفات
          </div>
        )}
      </div>
      <div className="preview-footer">
        <button onClick={onDelete} className="preview-footer-button flex items-center gap-1 text-xs px-2 text-red-400 hover:bg-red-900/50">
            <Trash2 className="w-4 h-4" />
            حذف
        </button>
        <button onClick={onReupload} className="preview-footer-button flex items-center gap-1 text-xs px-2">
            <RefreshCw className="w-3 h-3" />
            إعادة رفع
        </button>
        <button className="preview-footer-button">
          <Printer className="w-4 h-4" />
        </button>
        <a href={uploadedFile.url} download={uploadedFile.file.name} className="preview-footer-button">
          <Download className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export function BeneficiaryUploader() {
  const [clientName, setClientName] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile | null>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, categoryId: DocumentCategory) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedFiles((prev) => ({ ...prev, [categoryId]: { file, url } }));
      setOpenItem(categoryId); 
    }
  };

  const triggerFileInput = (categoryId: string) => {
    fileInputRefs.current[categoryId]?.click();
  };

  const handleDelete = (categoryId: DocumentCategory) => {
    setUploadedFiles(prev => {
      const newFiles = {...prev};
      newFiles[categoryId] = null;
      return newFiles;
    });
    if (openItem === categoryId) {
      setOpenItem(null);
    }
  };

  const handleUpload = async () => {
    if (!clientName.trim()) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "الرجاء إدخال اسم المستفيد.",
      });
      return;
    }

    const filesToUpload = Object.values(uploadedFiles).filter(f => f !== null) as UploadedFile[];
    if (filesToUpload.length === 0) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "الرجاء إرفاق ملف واحد على الأقل.",
      });
      return;
    }

      if (!privacyPolicyAccepted) {
          toast({
              variant: 'destructive',
              title: 'خطأ',
              description: 'يجب الموافقة على سياسة الخصوصية للمتابعة.',
          });
          return;
      }


    setIsUploading(true);
    const formData = new FormData();
    formData.append('clientName', clientName);

    for (const categoryId in uploadedFiles) {
        const uploadedFile = uploadedFiles[categoryId];
        if (uploadedFile) {
            // The backend expects the category to be part of the filename
            const newName = `${categoryId}___${uploadedFile.file.name}`;
            const fileWithCategory = new File([uploadedFile.file], newName, { type: uploadedFile.file.type });
            formData.append('files', fileWithCategory);
        }
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'فشل رفع الملفات.');
      }

      toast({
        title: "نجاح",
        description: "تم إرسال جميع الملفات بنجاح.",
      });

      // Reset state after successful upload
      setClientName('');
      setUploadedFiles({});
      setOpenItem(null);
        setPrivacyPolicyAccepted(false);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message || "لم نتمكن من إكمال الطلب.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isMounted) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-[150px] w-full rounded-md" />
            <div className="space-y-2">
                <Skeleton className="h-[56px] w-full rounded-md" />
                <Skeleton className="h-[56px] w-full rounded-md" />
                <Skeleton className="h-[56px] w-full rounded-md" />
            </div>
            <div className="flex justify-center pt-4">
                <Skeleton className="h-10 w-24 rounded-md" />
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>بيانات المستفيد</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="client-name" className="text-right w-full block">اسم المستفيد</Label>
                    <Input 
                        id="client-name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="ادخل اسم المستفيد هنا..."
                        className="text-right"
                    />
                </div>
            </CardContent>
        </Card>
      <Accordion 
        type="single" 
        collapsible 
        className="w-full space-y-2"
        value={openItem ?? undefined}
        onValueChange={(value) => setOpenItem(value)}
      >
        {documentCategories.map((category) => (
          <AccordionItem value={category.id} key={category.id} className="border-none">
             <div className="bg-card p-2 rounded-md">
             <AccordionTrigger
                className={!uploadedFiles[category.id] ? 'no-chevron' : ''}
                onClick={(e) => {
                  if (!uploadedFiles[category.id]) {
                    e.preventDefault();
                  }
                }}
              >
                  <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex items-center gap-2 overflow-hidden">
                       <span className="font-semibold truncate">{category.title}</span>
                    </div>
                    
                    {!uploadedFiles[category.id] && (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerFileInput(category.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            triggerFileInput(category.id);
                          }
                        }}
                        className="attach-button flex-shrink-0"
                      >
                        ارفق ملف
                      </div>
                    )}
                  </div>
                </AccordionTrigger>
              </div>
            <AccordionContent className="p-2">
              {uploadedFiles[category.id] ? (
                <FilePreview 
                    uploadedFile={uploadedFiles[category.id] as UploadedFile} 
                    onReupload={() => triggerFileInput(category.id)}
                    onDelete={() => handleDelete(category.id)}
                />
              ) : (
                <div className="rounded-lg shadow-lg border overflow-hidden bg-white">
                    <div className="h-96 flex items-center justify-center bg-muted/30">
                        <NoFileIcon className="w-32 h-32" />
                    </div>
                </div>
              )}
            </AccordionContent>
            <input
              type="file"
              accept="image/*,application/pdf"
              ref={(el) => (fileInputRefs.current[category.id] = el)}
              onChange={(e) => handleFileChange(e, category.id)}
              className="hidden"
            />
          </AccordionItem>
        ))}
          </Accordion>
          <div className="flex items-center space-x-2 space-x-reverse my-4 justify-center">
              <Checkbox id="terms" checked={privacyPolicyAccepted} onCheckedChange={(checked) => setPrivacyPolicyAccepted(checked as boolean)} />
              <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                  أوافق على <PrivacyPolicy />
              </label>
          </div>
      <div className="flex justify-center pt-4">
              <Button onClick={handleUpload} disabled={isUploading || !privacyPolicyAccepted}>
          {isUploading ? 'جاري الإرسال...' : 'إرسال'}
        </Button>
      </div>
    </div>
  );
}
