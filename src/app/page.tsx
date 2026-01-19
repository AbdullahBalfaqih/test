'use client';

import { BeneficiaryUploader } from '@/components/fyaa/beneficiary-uploader';
import { Logo } from '@/components/fyaa/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export type DocumentCategory = 'lawsuit' | 'supporting' | 'proxy';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center p-4 sm:p-6 lg:p-8 font-body">
      <header className="w-full max-w-2xl flex flex-col sm:flex-row justify-center items-center mb-8 relative gap-4 sm:gap-0">
        <Logo className="w-24 h-auto" />
        <Button asChild variant="default" size="sm" className="sm:absolute sm:left-0">
          <Link href="/provider">(واجهة مقدم الخدمة)</Link>
        </Button>
      </header>
      <main className="w-full max-w-2xl">
        <BeneficiaryUploader />
      </main>
    </div>
  );
}
