'use client';

import { MainLayout } from '@/components/MainLayout';
import { DailyEntryForm } from '@/components/DailyEntryForm';

export default function DailyPage() {
  return (
    <MainLayout>
      <DailyEntryForm />
    </MainLayout>
  );
}
