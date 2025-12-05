'use client';

import { MainLayout } from '@/components/MainLayout';
import { DailyPlanner } from '@/components/DailyPlanner';

export default function PlannerPage() {
  return (
    <MainLayout>
      <DailyPlanner />
    </MainLayout>
  );
}
