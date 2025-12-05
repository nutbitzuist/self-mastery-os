'use client';

import { MainLayout } from '@/components/MainLayout';
import { DailyCockpit } from '@/components/DailyCockpit';

export default function HomePage() {
  return (
    <MainLayout>
      <DailyCockpit />
    </MainLayout>
  );
}
