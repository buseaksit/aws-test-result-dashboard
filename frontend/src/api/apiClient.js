const API_URL = import.meta.env.VITE_API_URL;

console.log("API_URL from .env:", API_URL); // 👈 debug log

export async function fetchTestRuns() {
  const url = `${API_URL}/test-runs`;
  console.log("Calling API URL:", url);      // 👈 debug log

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${response.status}: ${text}`);
  }

  return response.json();
}
