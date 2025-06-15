export async function fetchCosts() {
  const res = await fetch("http://127.0.0.1:8000/costs");
  if (!res.ok) throw new Error('Failed to fetch costs');
  return res.json();
}


