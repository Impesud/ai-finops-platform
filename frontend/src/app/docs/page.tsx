// src/app/docs/page.tsx
"use client";

export default function DocsPage() {
  const docsUrl = `${process.env.NEXT_PUBLIC_API_URL}/docs`;

  return (
    <div style={{ height: "100vh" }}>
      <iframe
        src={docsUrl}
        style={{
          border: "none",
          width: "100%",
          height: "100%",
        }}
        title="API Docs"
      />
    </div>
  );
}






