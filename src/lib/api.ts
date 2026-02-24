const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5094";

const defaultHeaders = {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json"
};

export async function fetchSummary(start: string, end: string, groupBy: string = "marca") {
    const res = await fetch(`${API_BASE_URL}/dashboard/summary?start=${start}&end=${end}&groupBy=${groupBy}`, {
        headers: defaultHeaders,
        next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error("Failed to fetch summary");
    return res.json();
}

export async function fetchMapData(date: string) {
    const res = await fetch(`${API_BASE_URL}/dashboard/map?date=${date}`, {
        headers: defaultHeaders,
        cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch map data");
    return res.json();
}
