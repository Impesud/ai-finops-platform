// File: src/app/costs/aws/page.tsx
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
  CartesianGrid,
  Legend,
  LabelList,
  Brush,
} from 'recharts';

export default function AwsCostsPage() {
  interface CostItem {
    service: string;
    date: string;
    cost_usd: number;
  }

  const [data, setData] = useState<CostItem[]>([]);
  const [filteredData, setFilteredData] = useState<CostItem[]>([]);
  const [visibleData, setVisibleData] = useState<CostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const observerRef = useRef<HTMLTableRowElement | null>(null);
  const BATCH_SIZE = 100;

  const [service, setService]     = useState(searchParams.get('service')   || '');
  const [startDate, setStartDate] = useState(searchParams.get('start_date') || '');
  const [endDate, setEndDate]     = useState(searchParams.get('end_date')   || '');

  // Fetch AWS‐only cost data (dedupe)
  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (service)   params.set('service', service);
    if (startDate) params.set('start_date', startDate);
    if (endDate)   params.set('end_date', endDate);

    fetch(`/api/v1/costs/aws?${params.toString()}`)
      .then(res => res.json())
      .then((json: CostItem[]) => {
        const unique = Array.from(
          new Map(json.map(r => [`${r.date}|${r.service}|${r.cost_usd}`, r])).values()
        );
        setData(unique);
        setFilteredData(unique);
        setVisibleData(unique.slice(0, BATCH_SIZE));
      })
      .catch(() => setError('Failed to load AWS data.'))
      .finally(() => setLoading(false));
  }, [service, startDate, endDate]);

  // Sync filters → URL + filteredData + visibleData
  useEffect(() => {
    const params = new URLSearchParams();
    if (service)   params.set('service', service);
    if (startDate) params.set('start_date', startDate);
    if (endDate)   params.set('end_date', endDate);
    router.replace(`/costs/aws?${params.toString()}`);

    const filtered = data.filter(item =>
      (!service   || item.service === service) &&
      (!startDate || item.date    >= startDate) &&
      (!endDate   || item.date    <= endDate)
    );
    setFilteredData(filtered);
    setVisibleData(filtered.slice(0, BATCH_SIZE));
  }, [service, startDate, endDate, data, router]);

  // Infinite scroll with dedupe guard
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        if (visibleData.length >= filteredData.length) return;

        const nextBatch = filteredData.slice(
          visibleData.length,
          visibleData.length + BATCH_SIZE
        );
        const uniqueNew = nextBatch.filter(nb =>
          !visibleData.some(v =>
            v.date === nb.date &&
            v.service === nb.service &&
            v.cost_usd === nb.cost_usd
          )
        );
        setVisibleData(v => [...v, ...uniqueNew]);
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) obs.observe(observerRef.current);
    return () => obs.disconnect();
  }, [visibleData, filteredData]);

  // Overview metrics
  const totalCost    = filteredData.reduce((s, x) => s + x.cost_usd, 0);
  const periodStart  = startDate || filteredData[0]?.date || '';
  const periodEnd    = endDate   || filteredData.at(-1)?.date || '';
  let monthCount = 1;
  if (periodStart && periodEnd) {
    const s = new Date(periodStart), e = new Date(periodEnd);
    monthCount = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1;
  }
  const avgMonthly   = monthCount > 0 ? totalCost / monthCount : 0;
  const serviceCount = new Set(filteredData.map(x => x.service)).size;

  // Chart data
  const serviceData = filteredData.reduce((acc, curr) => {
    const f = acc.find(x => x.service === curr.service);
    if (f) f.cost += curr.cost_usd;
    else acc.push({ service: curr.service, cost: curr.cost_usd });
    return acc;
  }, [] as { service: string; cost: number }[]);

  const dates      = Array.from(new Set(filteredData.map(x => x.date))).sort();
  const timeSeries = dates.map(d => ({
    date: d,
    cost: filteredData.filter(x => x.date === d).reduce((s, x) => s + x.cost_usd, 0),
  }));

  const resetFilters = () => {
    setService(''); setStartDate(''); setEndDate('');
  };

  return (
    <>
      <Navbar />
      <main className="p-8 bg-gray-50 min-h-screen space-y-8">
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          AWS Cost Explorer
        </h1>

        {/* Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg text-gray-600">Total Cost</h2>
            <p className="text-2xl font-bold text-blue-600">${totalCost.toFixed(2)}</p>
            <p className="text-sm text-gray-500">{periodStart} – {periodEnd}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg text-gray-600">Avg Monthly</h2>
            <p className="text-2xl font-bold text-green-600">${avgMonthly.toFixed(2)}</p>
            <p className="text-sm text-gray-500">{monthCount} months</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg text-gray-600">Services</h2>
            <p className="text-2xl font-bold text-purple-600">{serviceCount}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg text-gray-600 mb-2">Cost by Service</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceData} margin={{ top: 20, right: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="service"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis
                  tickFormatter={v => `$${v.toLocaleString()}`}
                />
                <Tooltip formatter={v => `$${(v as number).toFixed(2)}`} />
                <Legend verticalAlign="top" />
                <Bar dataKey="cost" name="Cost">
                  <LabelList dataKey="cost" position="top" formatter={(v: number) => `$${(v as number).toFixed(0)}`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg text-gray-600 mb-2">Cost Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeries} margin={{ top: 20, right: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={d => d.slice(5)} minTickGap={20} />
                <YAxis tickFormatter={v => `$${v.toLocaleString()}`} />
                <Tooltip formatter={v => `$${(v as number).toFixed(2)}`} />
                <Legend verticalAlign="top" />
                <Line
                  type="monotone"
                  dataKey="cost"
                  name="Cost"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Brush dataKey="date" height={30} stroke="#8884d8" travellerWidth={10} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters & Table */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              value={service}
              onChange={e => setService(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Services</option>
              {serviceData.map(s => (
                <option key={s.service} value={s.service}>
                  {s.service}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <button
            onClick={resetFilters}
            className="bg-gray-200 p-2 rounded hover:bg-gray-300"
          >
            Reset Filters
          </button>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-2xl shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Service</th>
                    <th className="p-2">Cost (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleData.map((item, i) => (
                    <tr key={i} className="text-center hover:bg-gray-50">
                      <td className="p-2">{item.date}</td>
                      <td className="p-2">{item.service}</td>
                      <td className="p-2">
                        ${item.cost_usd.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr ref={observerRef}><td colSpan={3}></td></tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
