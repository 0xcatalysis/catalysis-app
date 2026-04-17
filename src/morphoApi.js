const MORPHO_GRAPHQL_URL = 'https://api.morpho.org/graphql';

function formatApyPercent(decimal) {
  if (decimal == null || Number.isNaN(decimal)) return null;
  return `${(decimal * 100).toFixed(2)}%`;
}

function formatTvlUsd(usd) {
  if (usd == null || Number.isNaN(usd)) return null;
  return `$${(usd / 1e6).toFixed(2)}M`;
}

/**
 * Fetches Morpho base APY (`state.netApy` / `netApy`) and TVL from Morpho’s public GraphQL API.
 * Tries Vault V1 (`vaultByAddress.state`) then Vault V2 (`vaultV2ByAddress`).
 *
 * @returns {{ baseApy: string | null, currentTvl: string | null }}
 */
export async function fetchMorphoVaultBaseApyAndTvl(address, chainId) {
  const variables = { address, chainId };
  const post = (query) =>
    fetch(MORPHO_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    }).then((r) => r.json());

  const v1Json = await post(`
    query VaultV1($address: String!, $chainId: Int!) {
      vaultByAddress(address: $address, chainId: $chainId) {
        state {
          totalAssetsUsd
          netApy
        }
      }
    }
  `);
  if (!v1Json.errors?.length && v1Json.data?.vaultByAddress?.state) {
    const s = v1Json.data.vaultByAddress.state;
    return {
      baseApy: formatApyPercent(s.netApy),
      currentTvl: formatTvlUsd(s.totalAssetsUsd),
    };
  }

  const v2Json = await post(`
    query VaultV2($address: String!, $chainId: Int!) {
      vaultV2ByAddress(address: $address, chainId: $chainId) {
        totalAssetsUsd
        netApy
      }
    }
  `);
  if (!v2Json.errors?.length && v2Json.data?.vaultV2ByAddress) {
    const s = v2Json.data.vaultV2ByAddress;
    return {
      baseApy: formatApyPercent(s.netApy),
      currentTvl: formatTvlUsd(s.totalAssetsUsd),
    };
  }

  throw new Error(v1Json.errors?.[0]?.message ?? v2Json.errors?.[0]?.message ?? 'Morpho vault not found');
}
