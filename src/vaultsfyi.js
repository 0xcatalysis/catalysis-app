const VAULTS_FYI_API_BASE = 'https://api.vaults.fyi';

/**
 * GET /v2/detailed-vaults/{network}/{vaultAddress}
 * @see https://docs.vaults.fyi/api-reference/overview
 */
export async function fetchVaultDetailed(network, vaultAddress) {
  const key = import.meta.env.VITE_VAULTS_FYI_API_KEY;
  if (!key || typeof key !== 'string') {
    throw new Error('Missing VITE_VAULTS_FYI_API_KEY');
  }
  const url = `${VAULTS_FYI_API_BASE}/v2/detailed-vaults/${encodeURIComponent(network)}/${encodeURIComponent(vaultAddress)}`;
  const res = await fetch(url, {
    headers: {
      'x-api-key': key.trim(),
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `Vaults.fyi HTTP ${res.status}`);
  }
  return res.json();
}

/** Maps detailed-vault JSON to `baseApy` / `currentTvl` display strings. */
export function liveStatsFromVaultsFyiDetailed(detailed) {
  const baseRaw = detailed.apy?.['7day']?.base;
  const baseApy =
    typeof baseRaw === 'number' && !Number.isNaN(baseRaw)
      ? `${(baseRaw * 100).toFixed(2)}%`
      : null;

  const usd = detailed.tvl?.usd;
  const currentTvl =
    usd != null && usd !== '' ? formatUsdTvl(usd) : null;

  return { baseApy, currentTvl };
}

function formatUsdTvl(usdString) {
  const n = parseFloat(String(usdString).replace(/,/g, ''));
  if (Number.isNaN(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}
