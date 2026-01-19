import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
    title: 'مشروع فيه (Fyaa) - نظام المرفقات الذكي',
    description: 'معالجة مستقلة للملفات ومعالجة ذكية وتخزين آمن لمنصتك.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <head>
            </head>
            <body className={cn('font-body antialiased')}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
