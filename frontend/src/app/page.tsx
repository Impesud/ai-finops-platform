'use client';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen p-10 bg-white text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          🌐 AI FinOps Dashboard
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mb-6">
          Welcome to the AI-powered FinOps platform. Monitor, forecast, and optimize your cloud costs in real time.
        </p>
        <Link
          href="/costs"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          View Cost Explorer
        </Link>
      </main>
    </>
  );
}


