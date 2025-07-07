import React, { Suspense } from 'react';
const GcpCostsClient = React.lazy(() => import('./GcpCostsClient'));

export default function AzureCostsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading GCP costs…</div>}>
      <GcpCostsClient />
    </Suspense>
  );
}