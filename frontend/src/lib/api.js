const trimmedBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const apiRoot = trimmedBaseUrl ? `${trimmedBaseUrl}/api/v1` : '/api/v1';
const sampleRoot = `${import.meta.env.BASE_URL}data`;

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function fetchScenarios(signal) {
  try {
    const data = await fetchJson(`${apiRoot}/scenarios`, { signal });
    return { source: 'api', data };
  } catch {
    const data = await fetchJson(`${sampleRoot}/scenarios.json`, { signal });
    return { source: 'sample', data };
  }
}

export function fetchSampleResult(slug, signal) {
  return fetchJson(`${sampleRoot}/results/${slug}.json`, { signal });
}

export function runSimulation(parameters) {
  return fetchJson(`${apiRoot}/simulations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parameters),
  });
}

export function isRemoteApiConfigured() {
  return Boolean(trimmedBaseUrl);
}
