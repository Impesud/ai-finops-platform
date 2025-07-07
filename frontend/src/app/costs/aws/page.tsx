import React, { Suspense } from 'react';
const AwsCostsClient = React.lazy(() => import('./AwsCostsClient'));

export default function AwsCostsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading AWS costs…</div>}>
      <AwsCostsClient />
    </Suspense>
  );
}
