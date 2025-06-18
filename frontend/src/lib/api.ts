export async function fetchCosts() {
  const res = await fetch("/costs");
  if (!res.ok) throw new Error('Failed to fetch costs');
  return res.json();
}


