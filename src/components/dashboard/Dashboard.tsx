import React from 'react';
import { StatsCards } from './StatsCards';
import { Charts } from './Charts';
import { RecentTransactions } from './RecentTransactions';

export function Dashboard() {
  return (
    <div className="space-y-8">
      <StatsCards />
      <Charts />
      <RecentTransactions />
    </div>
  );
}