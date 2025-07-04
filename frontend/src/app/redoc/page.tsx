"use client";

import dynamic from "next/dynamic";

const RedocStandalone = dynamic(
  () => import("redoc").then((mod) => mod.RedocStandalone),
  { ssr: false }
);

export default function ReDocPage() {
  const specUrl = `${process.env.NEXT_PUBLIC_API_URL}/openapi.json`;
  return (
    <div style={{ height: "100vh" }}>
      <RedocStandalone specUrl={specUrl} />
    </div>
  );
}


