'use client';

export function PdfViewer({ fileUrl }: { fileUrl: string }) {
  if (!fileUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        لا يوجد ملف للعرض.
      </div>
    );
  }

  // Using an <object> tag is a robust way to embed PDFs.
  // It uses the browser's native PDF viewer and provides a clear fallback.
  return (
    <object data={fileUrl} type="application/pdf" width="100%" height="100%">
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30 text-center p-4">
        <p className="font-semibold text-lg mb-2">تعذر عرض ملف الـ PDF.</p>
        <p className="text-sm text-muted-foreground mb-4">
          قد لا يدعم متصفحك عرض ملفات PDF مباشرة.
        </p>
        <a
          href={fileUrl}
          download
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          تحميل الملف
        </a>
      </div>
    </object>
  );
}
