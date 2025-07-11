import React, { Suspense } from "react";
const AzureCostsClient = React.lazy(() => import("./AzureCostsClient"));

export default function AzureCostsPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center">Loading Azure costs…</div>}
    >
      <AzureCostsClient />
    </Suspense>
  );
}
