'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export default function CostsPage() {
  interface CostItem {
    service: string;
    region: string;
    account_id: string;
    date: string;
    cost_usd: number;
    usage_type?: string; 
  }

  const [data, setData] = useState<CostItem[]>([]);
  const [filteredData, setFilteredData] = useState<CostItem[]>([]);
  const [visibleData, setVisibleData] = useState<CostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const BATCH_SIZE = 100;

  const [service, setService] = useState(searchParams.get('service') || '');
  const [region, setRegion] = useState(searchParams.get('region') || '');
  const [account, setAccount] = useState(searchParams.get('account_id') || '');

  useEffect(() => {
    fetch('http://localhost:8000/costs')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setFilteredData(json);
        setVisibleData(json.slice(0, BATCH_SIZE));
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (service) params.set('service', service);
    if (region) params.set('region', region);
    if (account) params.set('account_id', account);
    router.replace(`/costs?${params.toString()}`);

    let result = data;
    if (service) result = result.filter((item) => item.service === service);
    if (region) result = result.filter((item) => item.region === region);
    if (account) result = result.filter((item) => item.account_id === account);
    setFilteredData(result);
    setVisibleData(result.slice(0, BATCH_SIZE));
  }, [service, region, account, data, router]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleData.length < filteredData.length) {
          const nextBatch = filteredData.slice(visibleData.length, visibleData.length + BATCH_SIZE);
          setVisibleData((prev) => [...prev, ...nextBatch]);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [visibleData, filteredData]);

  const services = [...new Set(data.map((item) => item.service))];
  const regions = [...new Set(data.map((item) => item.region))];
  const accounts = [...new Set(data.map((item) => item.account_id))];

  const resetFilters = () => {
    setService('');
    setRegion('');
    setAccount('');
  };

  interface ServiceCost {
    service: string;
    cost: number;
  }

  interface CostItem {
    service: string;
    cost_usd: number;
    account_id: string;
    date: string;
    region: string;
  }

  interface AccountCost {
    account: string;
    cost: number;
  }

  interface LineCost {
    date: string;
    cost: number;
  }

  interface RegionCost {
    key: string;
    cost: number;
  }

  const barDataService = filteredData.reduce((acc: ServiceCost[], curr: CostItem) => {
    const existing = acc.find((x: ServiceCost) => x.service === curr.service);
    if (existing) existing.cost += curr.cost_usd || 0;
    else acc.push({ service: curr.service, cost: curr.cost_usd || 0 });
    return acc;
  }, []);

  const barDataAccount = filteredData.reduce(
    (acc: AccountCost[], curr: CostItem) => {
      const existing = acc.find((x: AccountCost) => x.account === curr.account_id);
      if (existing) existing.cost += curr.cost_usd || 0;
      else acc.push({ account: curr.account_id, cost: curr.cost_usd || 0 });
      return acc;
    }, []);

  const lineData = filteredData.reduce(
    (acc: LineCost[], curr: CostItem) => {
      const existing = acc.find((x: LineCost) => x.date === curr.date);
      if (existing) existing.cost += curr.cost_usd || 0;
      else acc.push({ date: curr.date, cost: curr.cost_usd || 0 });
      return acc;
    }, []);

  const barDataRegion = filteredData.reduce(
    (acc: RegionCost[], curr: CostItem) => {
      const key = `${curr.service} - ${curr.region}`;
      const existing = acc.find((x: RegionCost) => x.key === key);
      if (existing) existing.cost += curr.cost_usd || 0;
      else acc.push({ key, cost: curr.cost_usd || 0 });
      return acc;
    }, []);

  return (
    <>
      <Navbar />
      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-white min-h-screen">
        <div>
          <h1 className="text-3xl font-bold text-blue-700 mb-4">📊 Cloud Cost Explorer</h1>

          <div className="space-y-4 mb-6">
            <select value={service} onChange={(e) => setService(e.target.value)} className="border p-2 rounded w-full">
              <option value="">All Services</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select value={region} onChange={(e) => setRegion(e.target.value)} className="border p-2 rounded w-full">
              <option value="">All Regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select value={account} onChange={(e) => setAccount(e.target.value)} className="border p-2 rounded w-full">
              <option value="">All Accounts</option>
              {accounts.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            <button onClick={resetFilters} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 w-full">
              Reset Filters
            </button>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Service</th>
                    <th className="p-2 border">Account</th>
                    <th className="p-2 border">Usage</th>
                    <th className="p-2 border">Cost (USD)</th>
                    <th className="p-2 border">Region</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleData.map((item, index) => (
                    <tr key={index} className="text-center hover:bg-gray-50">
                      <td className="p-2 border">{item.date}</td>
                      <td className="p-2 border">{item.service}</td>
                      <td className="p-2 border">{item.account_id}</td>
                      <td className="p-2 border">{item.usage_type}</td>
                      <td className="p-2 border">
                        {typeof item.cost_usd === 'number' ? `$${item.cost_usd.toFixed(2)}` : 'N/A'}
                      </td>
                      <td className="p-2 border">{item.region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div ref={observerRef} className="h-10"></div>
            </div>
          )}
        </div>

        <div className="space-y-10">
          <div style={{ height: '300px' }}>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Cost by Service</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barDataService}>
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cost" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ height: '300px' }}>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Cost by Account</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barDataAccount}>
                <XAxis dataKey="account" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cost" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ height: '300px' }}>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Cost Over Time</h2>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ height: '300px' }}>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Service / Region Breakdown</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barDataRegion}>
                <XAxis dataKey="key" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cost" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </>
  );
}