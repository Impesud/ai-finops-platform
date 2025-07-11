import React, { Suspense } from "react";
const CostsPage = React.lazy(() => import("./CostsPage"));

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center">Loading Costs Page...</div>}
    >
      <CostsPage />
    </Suspense>
  );
}
