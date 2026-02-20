const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5094";

export async function fetchSummary(start: string, end: string, groupBy: string = "marca") {
    const res = await fetch(`${API_BASE_URL}/dashboard/summary?start=${start}&end=${end}&groupBy=${groupBy}`, {
        next: { revalidate: 3600 } // Cache results for 1 hour on server-side if using SSR
    });
    if (!res.ok) throw new Error("Failed to fetch summary");
    return res.json();
}

export async function fetchMapData(date: string) {
    const res = await fetch(`${API_BASE_URL}/dashboard/map?date=${date}`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch map data");
    return res.json();
}
