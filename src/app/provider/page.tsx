'use client';

import { ProviderViewer } from '@/components/fyaa/provider-viewer';
import { Logo } from '@/components/fyaa/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProviderPage() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center p-4 sm:p-6 lg:p-8 font-body">
      <header className="w-full max-w-4xl flex flex-col sm:flex-row justify-center items-center mb-8 relative gap-4 sm:gap-0">
        <Logo className="w-24 h-auto" />
        <Button asChild variant="default" size="sm" className="sm:absolute sm:left-0">
          <Link href="/">(واجهة المستفيد)</Link>
        </Button>
      </header>
      <main className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-6">
          واجهة مقدم الخدمة
        </h1>
        <ProviderViewer />
      </main>
    </div>
  );
}
