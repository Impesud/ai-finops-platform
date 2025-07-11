"use client";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 text-center">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4">
          🌐 AI FinOps Dashboard
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mb-8">
          Welcome to the AI-powered FinOps platform. Monitor, forecast, and
          optimize your cloud costs in real time across AWS, Azure, and GCP.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <Link
            href="/costs/aws"
            className="block p-6 bg-white rounded-2xl shadow hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">AWS</h2>
            <p className="text-gray-600">Explore your AWS cost data</p>
          </Link>
          <Link
            href="/costs/azure"
            className="block p-6 bg-white rounded-2xl shadow hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Azure</h2>
            <p className="text-gray-600">Explore your Azure cost data</p>
          </Link>
          <Link
            href="/costs/gcp"
            className="block p-6 bg-white rounded-2xl shadow hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">GCP</h2>
            <p className="text-gray-600">Explore your GCP cost data</p>
          </Link>
        </div>

        <Link
          href="/costs"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition"
        >
          View Unified Cost Explorer
        </Link>
      </main>
    </>
  );
}
