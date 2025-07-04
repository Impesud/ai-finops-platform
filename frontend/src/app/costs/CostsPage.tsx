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
  Brush,
} from 'recharts';

export default function CostsPage() {
  interface CostItem {
    provider: 'AWS' | 'Azure' | 'GCP';
    service: string;
    date: string;
    cost_usd: number;
  }

  // Types for the stacked and time‐series data entries
  interface StackedEntry {
    service: string;
    [provider: string]: string | number;
  }
  interface TimeSeriesEntry {
    date: string;
    [provider: string]: string | number;
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

  const [provider, setProvider] = useState(searchParams.get('provider') || '');
  const [service, setService]     = useState(searchParams.get('service')   || '');
  const [startDate, setStartDate] = useState(searchParams.get('start_date') || '');
  const [endDate, setEndDate]     = useState(searchParams.get('end_date')   || '');

  // FETCH unified cost data
  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (provider)   params.set('provider', provider);
    if (service)    params.set('service', service);
    if (startDate)  params.set('start_date', startDate);
    if (endDate)    params.set('end_date', endDate);

    fetch(`/api/v1/costs?${params.toString()}`)
      .then(res => res.json())
      .then((json: CostItem[]) => {
        const unique = Array.from(
          new Map(json.map(r => [`${r.provider}|${r.date}|${r.service}|${r.cost_usd}`, r])).values()
        );
        const nonEmpty = unique.filter(r => r.service.trim() !== '');
        const sortedAll = [...nonEmpty].sort((a,b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setData(sortedAll);
        setFilteredData(sortedAll);
        setVisibleData(sortedAll.slice(0, BATCH_SIZE));
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, [provider, service, startDate, endDate]);

  // UPDATE URL & FILTERED LIST
  useEffect(() => {
    const params = new URLSearchParams();
    if (provider)   params.set('provider', provider);
    if (service)    params.set('service', service);
    if (startDate)  params.set('start_date', startDate);
    if (endDate)    params.set('end_date', endDate);
    router.replace(`/costs?${params.toString()}`);

    const filtered = data.filter(item =>
      (!provider  || item.provider === provider) &&
      (!service   || item.service  === service)  &&
      (!startDate || item.date     >= startDate) &&
      (!endDate   || item.date     <= endDate)
    );
    const sorted = [...filtered].sort((a,b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setFilteredData(sorted);
    setVisibleData(sorted.slice(0, BATCH_SIZE));
  }, [provider, service, startDate, endDate, data, router]);

  // INFINITE SCROLL OBSERVER
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (visibleData.length >= filteredData.length) return;
        const next = filteredData.slice(
          visibleData.length,
          visibleData.length + BATCH_SIZE
        );
        const uniqueNew = next.filter(nb =>
          !visibleData.some(v =>
            v.provider === nb.provider &&
            v.date === nb.date &&
            v.service === nb.service &&
            v.cost_usd === nb.cost_usd
          )
        );
        setVisibleData(v => [...v, ...uniqueNew]);
      }, { threshold: 1.0 }
    );
    if (observerRef.current) obs.observe(observerRef.current);
    return () => obs.disconnect();
  }, [visibleData, filteredData]);

  // Overview metrics
  const totalCost = filteredData.reduce((sum, x) => sum + x.cost_usd, 0);
  const periodStart = startDate || filteredData[0]?.date || '';
  const periodEnd   = endDate   || filteredData.at(-1)?.date || '';
  let monthCount = 0;
  if (periodStart && periodEnd) {
    const s = new Date(periodStart), e = new Date(periodEnd);
    monthCount = (e.getFullYear() - s.getFullYear())*12 + (e.getMonth() - s.getMonth()) + 1;
  }
  const avgMonthly = monthCount > 0 ? totalCost/monthCount : 0;
  const serviceCount = new Set(filteredData.map(x => x.service)).size;
  const providers = Array.from(new Set(data.map(x => x.provider)));

  // Stacked data for Cost by Service
  const services = Array.from(new Set(filteredData.map(x => x.service)));
  const stackedData: StackedEntry[] = services.map(svc => {
    const entry: StackedEntry = { service: svc };
    providers.forEach(p => {
      entry[p] = filteredData
        .filter(x => x.service === svc && x.provider === p)
        .reduce((sum, x) => sum + x.cost_usd, 0);
    });
    return entry;
  });

  // Time series multi‐line data
  const dates = Array.from(new Set(filteredData.map(x => x.date))).sort();
  const timeSeries: TimeSeriesEntry[] = dates.map(d => {
    const obj: TimeSeriesEntry = { date: d };
    providers.forEach(p => {
      obj[p] = filteredData
        .filter(x => x.date === d && x.provider === p)
        .reduce((sum, x) => sum + x.cost_usd, 0);
    });
    return obj;
  });

  const resetFilters = () => {
    setProvider('');
    setService('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <>
      <Navbar/>
      <main className="p-8 bg-gray-50 min-h-screen space-y-8">
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          Unified Cloud Cost Explorer
        </h1>

        {/* Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <select
            value={provider}
            onChange={e=>setProvider(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Providers</option>
            {providers.map(p=>(
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
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
            <h2 className="text-lg text-gray-600">Services Count</h2>
            <p className="text-2xl font-bold text-purple-600">{serviceCount}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stacked Cost by Service */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg text-gray-600 mb-2">Cost by Service</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stackedData} margin={{ top:20, right:30, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" angle={-45} textAnchor="end" height={60} interval={0}/>
                <YAxis tickFormatter={v=>`$${v}`} />
                <Tooltip formatter={v=>`$${(v as number).toFixed(2)}`} />
                <Legend verticalAlign="top" />
                {providers.map(p=>(
                  <Bar key={p} dataKey={p} name={p} stackId="a"/>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Multi‐line Cost Over Time */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg text-gray-600 mb-2">Cost Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeries} margin={{ top:20, right:30, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={d=>d.slice(5)} minTickGap={20}/>
                <YAxis tickFormatter={v=>`$${v}`} />
                <Tooltip formatter={v=>`$${(v as number).toFixed(2)}`} />
                <Legend verticalAlign="top" />
                {providers.map(p=>(
                  <Line
                    key={p}
                    type="monotone"
                    dataKey={p}
                    name={p}
                    dot={false}
                    strokeWidth={2}
                  />
                ))}
                <Brush dataKey="date" height={30} stroke="#8884d8"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters & Table */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <select
              value={service}
              onChange={e=>setService(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Services</option>
              {services.map(s=>(
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input
              type="date"
              value={startDate}
              onChange={e=>setStartDate(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={e=>setEndDate(e.target.value)}
              className="border p-2 rounded"
            />
            <button
              onClick={resetFilters}
              className="bg-gray-200 p-2 rounded hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-2xl shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Provider</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Service</th>
                    <th className="p-2">Cost (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleData.map((item,i)=>(
                    <tr key={i} className="text-center hover:bg-gray-50">
                      <td className="p-2">{item.provider}</td>
                      <td className="p-2">{item.date}</td>
                      <td className="p-2">{item.service}</td>
                      <td className="p-2">${item.cost_usd.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr ref={observerRef}><td colSpan={4}></td></tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}






