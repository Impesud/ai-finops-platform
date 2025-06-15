// app/layout.tsx
import './styles/globals.css';
export const metadata = {
  title: 'AI FinOps Dashboard',
  description: 'Cloud cost optimization platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}

