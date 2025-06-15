import { Suspense } from 'react';
import CostsPage from './CostsPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CostsPage />
    </Suspense>
  );
}








