import { VaultsSdk } from '@vaultsfyi/sdk';

export function createVaultsFyiClient() {
  const key = import.meta.env.VITE_VAULTS_FYI_API_KEY;
  if (!key || typeof key !== 'string') return null;
  return new VaultsSdk({ apiKey: key.trim() });
}

/** Maps Vaults.fyi `getVault` response to `baseApy` / `currentTvl` display strings (no mock fallbacks). */
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
