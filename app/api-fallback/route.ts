// API Fallback für statisches Hosting
// Diese Datei wird bei statischem Export ignoriert
export function GET() {
  return new Response('API not available in static mode', { status: 503 });
}
