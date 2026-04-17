import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  Github, 
  Twitter, 
  Sparkles, 
  Menu,
  X,
} from 'lucide-react';

/** Public files must include Vite `base` (see vite.config.js). */
const publicUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

/**
 * MOCK API DATA
 */
/** Covered APY = base APY − haircut (percentage points). `haircut` is for calculation only, not rendered. */
function coveredApyFromStats({ baseApy, haircut = 0 }) {
  const base = parseFloat(String(baseApy).replace('%', ''));
  if (Number.isNaN(base)) return '0.00%';
  return `${Math.max(0, base - haircut).toFixed(2)}%`;
}

const MOCK_VAULTS = [
  {
    id: 1,
    name: "Gauntlet WETH Prime",
    description: "This is a covered version of the Gauntlet WETH Prime v1 vault on Morpho. The Gauntlet WETH Prime vault aims to optimize for risk-adjusted yield across liquid staking recursive yield markets.",
    icon: publicUrl('gauntlet-logo-full-dark.svg'),
    badges: [
      { text: "Credora A", color: "bg-blue-50 text-blue-600" },
      { text: "15% Protection", color: "bg-[#1E1B4B] text-white" }
    ],
    stats: {
      tvlCap: "$5M",
      baseApy: "1.47%",
      haircut: 0.28,
      apyBoost: "+0.75%",
      currentTvl: "$0.01M"
    },
    status: "active",
    moreInfoUrl: "https://app.morpho.org/ethereum/vault/0x2371e134e3455e0593363cBF89d3b6cf53740618/gauntlet-weth-prime",
    titleUrl: "https://etherscan.io/address/0x45dc31c63a87193555f48c4b95ca61aa119a9b3e"
  },
  {
    id: 2,
    name: "KPK ETH Prime",
    description: "This is a covered version of the ETH Prime Vault on Morpho. The KPK ETH Prime is a low-risk ETH vault with 24h automation. Allocations are continuously rebalanced across liquid markets with strict collateral filters in place to preserve liquidity and mitigate risk.",
    icon: publicUrl('kpk-logo.png'),
    isComingSoon: true,
    badges: [
      { text: "Coming Soon", color: "bg-[#DBEAFE] text-[#1E3A8A]" },
      { text: "Credora A", color: "bg-[#F1F5F9] text-[#475569]" },
      { text: "10% Protection", color: "bg-[#1E293B] text-white" }
    ],
    stats: {
      tvlCap: "$0M",
      baseApy: "0.0%",
      haircut: 0,
      apyBoost: "0.0%",
      currentTvl: "$0.00M"
    },
    status: "inactive",
    moreInfoUrl: "https://app.morpho.org/ethereum/vault/0xd564F765F9aD3E7d2d6cA782100795a885e8e7C8/kpk-eth-prime"
  },
  {
    id: 3,
    name: "Gauntlet USDC Prime",
    description: "This is a covered version of the USDC Prime Vault on Morpho. The Gauntlet USDC Prime vault aims to optimize for risk-adjusted yield across large market cap and high liquidity collateral markets.",
    icon: publicUrl('gauntlet-logo-full-dark.svg'),
    isComingSoon: true,
    badges: [
      { text: "Coming Soon", color: "bg-[#DBEAFE] text-[#1E3A8A]" },
      { text: "Credora A", color: "bg-[#F1F5F9] text-[#475569]" },
      { text: "10% Protection", color: "bg-[#1E293B] text-white" }
    ],
    stats: {
      tvlCap: "$0M",
      baseApy: "0.0%",
      haircut: 0,
      apyBoost: "0.0%",
      currentTvl: "$0.00M"
    },
    status: "inactive",
    moreInfoUrl: "https://app.morpho.org/ethereum/vault/0xdd0f28e19C1780eb6396170735D45153D261490d/gauntlet-usdc-prime"
  },
  {
    id: 4,
    name: "Steakhouse Prime Instant V2",
    description: "This is a covered version of the Steakhouse Prime Instant v2 vault on Morpho. The Steakhouse ETH vault aims to optimize yields by lending ETH against blue chip crypto and real world asset (RWA) collateral markets, depending on market conditions.",
    icon: publicUrl('steakhouse-logo.svg'),
    isComingSoon: true,
    badges: [
      { text: "Coming Soon", color: "bg-[#DBEAFE] text-[#1E3A8A]" },
      { text: "Credora A", color: "bg-[#F1F5F9] text-[#475569]" },
      { text: "10% Protection", color: "bg-[#1E293B] text-white" }
    ],
    stats: {
      tvlCap: "$0M",
      baseApy: "0.0%",
      haircut: 0,
      apyBoost: "0.0%",
      currentTvl: "$0.00M"
    },
    status: "inactive",
    moreInfoUrl: "https://app.morpho.org/ethereum/vault/0xbeef0046fcab1dE47E41fB75BB3dC4Dfc94108E3/steakhouse-prime-instant"
  }
];

const COMING_SOON_DATA = [
  { id: 'nest', name: 'Nest Credit Vaults', href: 'https://nest.credit/' },
  { id: 'upshift', name: 'Upshift Vaults', href: 'https://www.upshift.finance/' },
  { id: 'midas', name: 'Midas Vaults', href: 'https://midas.app/' },
];

/**
 * LOGO COMPONENTS
 */

const CatalysisNavbarLogo = ({ className }) => (
  <svg width="123" height="26" viewBox="0 0 123 26" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M0 1.5H4.5C4.5 1.5 4.5375 12.5769 15.3 12.5769C6.30008 12.5769 6.3 1.5 6.3 1.5H10.8C10.8 1.5 9.9 11.6538 17.1 11.6538C11.6321 11.6538 12.6 1.5 12.6 1.5H17.1C17.1 1.5 13.5 12.5769 22.5 12.5769H27V14.4231H22.5C13.5 14.4231 17.1 25.5 17.1 25.5H12.6C12.6 25.5 11.632 15.3461 17.1 15.3461C9.9 15.3462 10.8001 25.5 10.8001 25.5H6.30008C6.30008 25.5 6.3 14.4231 15.3 14.4231C4.5375 14.4231 4.50008 25.5 4.50008 25.5H7.6185e-05C7.6185e-05 25.5 0 13.5 12.6 13.5C0 13.5 0 1.5 0 1.5Z" fill="currentColor"/>
    <path d="M39.408 20.288C37.696 20.288 36.336 19.752 35.328 18.68C34.336 17.592 33.84 16.168 33.84 14.408C33.84 12.648 34.336 11.232 35.328 10.16C36.336 9.072 37.696 8.528 39.408 8.528C40.944 8.528 42.176 8.92 43.104 9.704C44.048 10.472 44.584 11.504 44.712 12.8H42.096C41.808 11.504 40.912 10.856 39.408 10.856C38.48 10.856 37.752 11.168 37.224 11.792C36.712 12.4 36.456 13.272 36.456 14.408C36.456 15.544 36.712 16.424 37.224 17.048C37.752 17.656 38.48 17.96 39.408 17.96C40.896 17.96 41.792 17.352 42.096 16.136H44.712C44.584 17.4 44.048 18.408 43.104 19.16C42.176 19.912 40.944 20.288 39.408 20.288ZM51.1729 20.288C49.4289 20.288 48.0769 19.736 47.1169 18.632C46.1569 17.528 45.6769 16.12 45.6769 14.408C45.6769 12.712 46.1809 11.312 47.1889 10.208C48.1969 9.088 49.5489 8.528 51.2449 8.528C51.9969 8.528 52.6849 8.688 53.3089 9.008C53.9329 9.328 54.4129 9.768 54.7489 10.328V8.816H57.3649V20H54.7489V18.488C54.4289 19.032 53.9249 19.472 53.2369 19.808C52.5649 20.128 51.8769 20.288 51.1729 20.288ZM51.5569 17.96C52.6289 17.96 53.4449 17.624 54.0049 16.952C54.5809 16.28 54.8689 15.432 54.8689 14.408C54.8689 13.384 54.5809 12.536 54.0049 11.864C53.4449 11.192 52.6289 10.856 51.5569 10.856C50.5489 10.856 49.7489 11.192 49.1569 11.864C48.5809 12.52 48.2929 13.368 48.2929 14.408C48.2929 15.448 48.5809 16.304 49.1569 16.976C49.7489 17.632 50.5489 17.96 51.5569 17.96ZM64.824 17.792C65.352 17.792 65.792 17.76 66.144 17.696V20C65.6 20.096 64.952 20.144 64.2 20.144C63.768 20.144 63.392 20.112 63.072 20.048C62.752 19.984 62.376 19.84 61.944 19.616C61.512 19.376 61.176 18.968 60.936 18.392C60.696 17.816 60.576 17.088 60.576 16.208V11H58.68V8.816H60.576V5.432H63.192V8.816H65.76V11H63.192V15.608C63.192 16.504 63.32 17.096 63.576 17.384C63.832 17.656 64.248 17.792 64.824 17.792ZM72.1279 20.288C70.3839 20.288 69.0319 19.736 68.0719 18.632C67.1119 17.528 66.6319 16.12 66.6319 14.408C66.6319 12.712 67.1359 11.312 68.1439 10.208C69.1519 9.088 70.5039 8.528 72.1999 8.528C72.9519 8.528 73.6399 8.688 74.2639 9.008C74.8879 9.328 75.3679 9.768 75.7039 10.328V8.816H78.3199V20H75.7039V18.488C75.3839 19.032 74.8799 19.472 74.1919 19.808C73.5199 20.128 72.8319 20.288 72.1279 20.288ZM72.5119 17.96C73.5839 17.96 74.3999 17.624 74.9599 16.952C75.5359 16.28 75.8239 15.432 75.8239 14.408C75.8239 13.384 75.5359 12.536 74.9599 11.864C74.3999 11.192 73.5839 10.856 72.5119 10.856C71.5039 10.856 70.7039 11.192 70.1119 11.864C69.5359 12.52 69.2479 13.368 69.2479 14.408C69.2479 15.448 69.5359 16.304 70.1119 16.976C70.7039 17.632 71.5039 17.96 72.5119 17.96ZM80.715 20V3.2H83.331V20H80.715ZM93.3396 8.816H95.9556V20.048C95.9556 21.76 95.4676 23.088 94.4916 24.032C93.5476 24.896 92.2836 25.328 90.6996 25.328C89.0516 25.328 87.7716 24.944 86.8596 24.176C86.0596 23.472 85.6436 22.504 85.6116 21.272H88.2516C88.3156 21.912 88.5236 22.384 88.8756 22.688C89.2436 23.008 89.8356 23.168 90.6516 23.168C91.4836 23.168 92.1396 22.896 92.6196 22.352C93.0996 21.824 93.3396 20.992 93.3396 19.856V18.44C92.6196 19.672 91.4196 20.288 89.7396 20.288C88.4116 20.288 87.3876 19.864 86.6676 19.016C85.9636 18.152 85.6116 17.024 85.6116 15.632V8.816H88.2276V15.08C88.2276 17.016 89.0356 17.984 90.6516 17.984C91.5316 17.984 92.1956 17.672 92.6436 17.048C93.1076 16.424 93.3396 15.608 93.3396 14.6V8.816ZM102.277 20.288C100.869 20.288 99.7253 19.928 98.8453 19.208C97.9653 18.488 97.5253 17.608 97.5253 16.568H100.141C100.141 17.048 100.349 17.44 100.765 17.744C101.197 18.048 101.749 18.2 102.421 18.2C102.917 18.2 103.309 18.08 103.597 17.84C103.885 17.84 104.173 17.6 104.317 16.88C104.317 16.24 104.037 15.848 103.477 15.704L100.597 14.912C98.9813 14.464 98.1733 13.432 98.1733 11.816C98.1733 10.888 98.5733 10.112 99.3733 9.488C100.173 8.848 101.205 8.528 102.469 8.528C103.893 8.528 104.981 8.848 105.733 9.488C106.501 10.128 106.885 10.968 106.885 12.008H104.317C104.317 11.544 104.141 11.184 103.789 10.928C103.453 10.656 102.981 10.52 102.373 10.52C101.909 10.52 101.525 10.632 101.221 10.856C100.917 11.064 100.765 11.336 100.765 11.672C100.765 12.28 101.085 12.68 101.725 12.872L104.389 13.64C105.157 13.864 105.781 14.248 106.261 14.792C106.741 15.32 106.981 15.936 106.981 16.64C106.981 17.728 106.589 18.608 105.805 19.28C105.037 19.952 103.957 20.288 102.565 20.288L102.277 20.288ZM111.086 6.656C111.454 6.272 111.638 5.808 111.638 5.264C111.638 4.72 111.454 4.264 111.086 3.896C110.718 3.512 110.254 3.32 109.694 3.32C109.134 3.32 108.67 3.512 108.302 3.896C107.934 4.264 107.75 4.72 107.75 5.264C107.75 5.808 107.934 6.272 108.302 6.656C108.67 7.024 109.134 7.208 109.694 7.208C110.254 7.208 110.718 7.024 111.086 6.656ZM108.374 20V8.816H110.99V20H108.374ZM117.303 20.288C115.895 20.288 114.751 19.928 113.871 19.208C112.991 18.488 112.551 17.608 112.551 16.568H115.167C115.167 17.048 115.375 17.44 115.791 17.744C116.223 18.048 116.775 18.2 117.447 18.2C117.943 18.2 118.335 18.08 118.623 17.84C118.911 17.6 119.055 17.28 119.055 16.88C119.055 16.24 118.775 15.848 118.215 15.704L115.335 14.912C113.719 14.464 112.911 13.432 112.911 11.816C112.911 10.888 113.311 10.112 114.111 9.488C114.911 8.848 115.943 8.528 117.207 8.528C118.631 8.528 119.719 8.848 120.471 9.488C121.239 10.128 121.623 10.968 121.623 12.008H119.055C119.055 11.544 118.879 11.184 118.527 10.928C118.191 10.656 117.719 10.52 117.111 10.52C116.647 10.52 116.263 10.632 115.959 10.856C115.655 11.064 115.503 11.336 115.503 11.672C115.503 12.28 115.823 12.68 116.463 12.872L119.127 13.64C119.895 13.864 120.519 14.248 120.999 14.792C121.479 15.32 121.719 15.936 121.719 16.64C121.719 17.728 121.327 18.608 120.543 19.28C119.775 19.952 118.695 20.288 117.303 20.288Z" fill="currentColor"/>
  </svg>
);

const NestLogo = ({ className }) => (
  <svg width="75" height="24" viewBox="0 0 75 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_nest)">
      <path d="M63.2259 19.159C63.2433 18.6497 63.3102 18.1433 63.4259 17.647L66.8258 0.40403C66.9258 0.20403 67.026 0.00402832 67.226 0.00402832H69.8258C70.1258 0.00402832 70.326 0.304028 70.226 0.504028L69.526 3.73003C69.5115 3.79011 69.5109 3.8527 69.5243 3.91303C69.5377 3.97336 69.5648 4.02982 69.6034 4.07808C69.642 4.12634 69.691 4.16512 69.7469 4.19146C69.8029 4.2178 69.8641 4.23099 69.9259 4.23003H74.4259C74.8259 4.13003 75.0259 4.33003 74.9259 4.63003L74.526 6.64703C74.426 6.84703 74.3259 7.04703 74.1259 7.04703H69.3258C69.2221 7.05425 69.1247 7.09872 69.0511 7.17222C68.9776 7.24573 68.9331 7.34333 68.9259 7.44703L66.9259 17.43C66.848 17.7601 66.8143 18.0991 66.8258 18.438C66.7888 18.7719 66.8287 19.1098 66.9425 19.4258C67.0563 19.7418 67.241 20.0276 67.4823 20.2612C67.7236 20.4948 68.0153 20.6701 68.3348 20.7735C68.6544 20.877 68.9933 20.9059 69.3258 20.858C70.1322 20.8612 70.9254 20.6526 71.6259 20.253C71.6807 20.2079 71.7474 20.1796 71.818 20.1716C71.8885 20.1636 71.9598 20.1763 72.0233 20.208C72.0868 20.2398 72.14 20.2893 72.1759 20.3505C72.2118 20.4117 72.2292 20.4821 72.226 20.553L72.726 22.368C72.7473 22.4138 72.7589 22.4634 72.7604 22.5138C72.7618 22.5643 72.753 22.6145 72.7343 22.6614C72.7155 22.7082 72.6873 22.7507 72.6515 22.7863C72.6157 22.8218 72.573 22.8497 72.526 22.868C71.256 23.6203 69.8016 24.0046 68.3258 23.978C65.3258 24 63.2259 22.185 63.2259 19.159ZM42.9259 21.882C42.7259 21.782 42.7258 21.482 42.8258 21.282L44.026 19.265C44.0845 19.1643 44.1777 19.0884 44.2882 19.0516C44.3987 19.0148 44.5186 19.0196 44.6259 19.065C46.506 20.2562 48.7014 20.8534 50.9259 20.779C54.3259 20.779 56.026 19.67 56.026 17.855C56.026 14.023 45.3258 16.746 45.3258 10.191C45.3258 6.35903 48.826 3.83803 54.026 3.83803C56.2651 3.79555 58.4747 4.35281 60.4259 5.45203C60.5107 5.52526 60.5671 5.62589 60.5853 5.73643C60.6036 5.84696 60.5827 5.96041 60.526 6.05703L59.526 8.07403C59.5058 8.13163 59.4726 8.18386 59.4291 8.22668C59.3856 8.26951 59.3329 8.30182 59.275 8.32112C59.2171 8.34043 59.1553 8.34622 59.0948 8.33806C59.0343 8.3299 58.9766 8.30799 58.9259 8.27403C57.3039 7.38209 55.4766 6.93044 53.6259 6.96403C50.3259 6.96403 48.7259 8.17403 48.7259 9.88803C48.7259 13.82 59.4259 11.098 59.4259 17.551C59.4259 21.585 55.826 23.904 50.526 23.904C47.8532 23.9562 45.2194 23.2555 42.9259 21.882ZM0.425901 23.9C0.125901 23.9 -0.0740018 23.6 0.0259982 23.4L3.62585 4.54303C3.72585 4.34303 3.826 4.14303 4.026 4.14303H6.526C6.826 4.14303 7.0259 4.44303 6.9259 4.64303L6.72595 5.45003C6.72595 5.85003 7.1259 6.15603 7.4259 5.95003C9.18742 4.64652 11.3355 3.97184 13.526 4.03403C17.926 4.03403 20.526 6.35303 20.526 10.488C20.5004 11.2305 20.4334 11.971 20.3258 12.706L18.226 23.294C18.1259 23.494 18.0258 23.694 17.8258 23.694H15.2259C14.9259 23.694 14.7258 23.394 14.8258 23.194L16.9259 12.807C17.0298 12.2743 17.0966 11.735 17.1259 11.193C17.1259 8.67303 15.6259 7.26103 12.6259 7.26103C8.82585 7.26103 6.326 9.27803 5.526 13.513L3.526 23.496C3.426 23.696 3.32585 23.896 3.12585 23.896L0.425901 23.9ZM23.1259 15.329C23.1259 8.87503 27.726 3.92903 34.026 3.92903C39.126 3.92903 42.6259 6.95503 42.7259 12.501V13.101C42.7259 13.301 42.5258 13.401 42.3258 13.501L27.1259 16.324C26.8259 16.324 26.6259 16.524 26.726 16.824C27.226 19.244 29.1259 20.656 32.6259 20.656C34.6609 20.7033 36.6464 20.024 38.2259 18.74C38.2727 18.6881 38.3314 18.6486 38.3971 18.6248C38.4628 18.601 38.5335 18.5937 38.6027 18.6036C38.6718 18.6134 38.7374 18.6402 38.7938 18.6814C38.8502 18.7227 38.8955 18.7771 38.9259 18.84L40.026 20.655C40.0816 20.7511 40.1019 20.8635 40.0836 20.973C40.0654 21.0825 40.0096 21.1822 39.9259 21.255C37.8011 22.9555 35.1468 23.8561 32.4259 23.8C26.6259 23.8 23.1259 20.472 23.1259 15.329ZM26.726 13.312C26.7045 13.3815 26.7026 13.4555 26.7201 13.5261C26.7376 13.5967 26.7739 13.6612 26.8253 13.7126C26.8767 13.764 26.9413 13.8004 27.0118 13.818C27.0824 13.8355 27.1565 13.8334 27.226 13.812L39.026 11.594C39.226 11.494 39.4259 11.294 39.4259 11.194C39.0259 8.47103 36.9259 6.95903 33.9259 6.95903C30.1259 6.95803 27.426 9.37903 26.726 13.312Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_nest">
        <rect width="74.951" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const MidasLogo = ({ className }) => (
  <img
    src={publicUrl('midas-full-logo-primary.svg')}
    alt=""
    className={`h-6 w-auto max-h-6 object-contain object-left ${className ?? ''}`}
    decoding="async"
  />
);

const UpshiftLogo = ({ className }) => (
  <svg width="78" height="24" viewBox="0 0 78 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_upshift)">
      <path d="M30.5027 19.2728C34.3812 19.2728 37.524 16.1248 37.5149 12.2437C37.5123 11.2806 38.3077 10.5046 39.2709 10.5046H39.4541C39.7414 10.5046 39.974 10.272 39.974 9.98472V5.76832C39.974 5.48107 39.7414 5.24841 39.4541 5.24841H39.2709C35.3924 5.24841 32.2496 8.39642 32.2587 12.2775C32.2613 13.2406 31.4658 14.0166 30.5027 14.0166H30.3194C30.0322 14.0166 29.7995 14.2492 29.7995 14.5365V18.7529C29.7995 19.0401 30.0322 19.2728 30.3194 19.2728H30.5027Z" fill="currentColor"/>
      <path d="M58.7373 5.77609C60.3294 5.77609 61.6201 4.48539 61.6201 2.89324C61.6201 1.30108 60.3294 0.010376 58.7373 0.010376C57.1451 0.010376 55.8544 1.30108 55.8544 2.89324C55.8544 4.48539 57.1451 5.77609 58.7373 5.77609Z" fill="#00FF96"/>
      <path d="M60.8455 7.00439H56.6291C56.342 7.00439 56.1092 7.23716 56.1092 7.5243V18.2252C56.1092 18.5123 56.342 18.7451 56.6291 18.7451H60.8455C61.1326 18.7451 61.3654 18.5123 61.3654 18.2252V7.5243C61.3654 7.23716 61.1326 7.00439 60.8455 7.00439Z" fill="currentColor"/>
      <path d="M69.5487 4.78827V0.532869C69.5487 0.228726 69.2887 -0.0104287 68.9846 0.0142667C65.3752 0.301513 62.5365 3.32085 62.5365 7.00436V18.2252C62.5365 18.5124 62.7692 18.7451 63.0564 18.7451H67.2728C67.5601 18.7451 67.7927 18.5124 67.7927 18.2252V12.7818C67.7927 12.4945 68.0254 12.2619 68.3126 12.2619H69.0288C69.316 12.2619 69.5487 12.0292 69.5487 11.742V7.52556C69.5487 7.23831 69.316 7.00566 69.0288 7.00566H68.4283C68.0488 7.00566 67.7953 6.61183 67.9552 6.26739C68.18 5.78389 68.6181 5.41865 69.1497 5.29518C69.3836 5.24059 69.5487 5.03133 69.5487 4.79087V4.78827Z" fill="currentColor"/>
      <path d="M77.7306 14.4754V18.7308C77.7306 19.0349 77.4707 19.2741 77.1665 19.2494C73.5571 18.9621 70.7184 15.9428 70.7184 12.2593V0.519903C70.7184 0.232656 70.9511 0 71.2383 0H75.4548C75.742 0 75.9747 0.232656 75.9747 0.519903V6.48319C75.9747 6.77043 76.2073 7.00309 76.4946 7.00309H77.2107C77.498 7.00309 77.7306 7.23574 77.7306 7.52299V11.7394C77.7306 12.0266 77.498 12.2593 77.2107 12.2593H76.6102C76.2307 12.2593 75.9773 12.6531 76.1371 12.9976C76.362 13.4811 76.8 13.8463 77.3316 13.9698C77.5656 14.0244 77.7306 14.2336 77.7306 14.4741V14.4754Z" fill="currentColor"/>
      <path d="M46.17 12.2606C46.17 11.2624 47.0031 10.4591 48.0104 10.5072C48.9553 10.5514 49.6819 11.365 49.6819 12.3113V18.2251C49.6819 18.5124 49.9146 18.7451 50.2018 18.7451H54.4182C54.7055 18.7451 54.9381 18.5124 54.9381 18.2251V12.371C54.9381 8.51467 51.8707 5.29907 48.0156 5.24968C47.5932 5.24448 47.1799 5.27698 46.7769 5.34326C46.4585 5.39525 46.1687 5.1535 46.1687 4.83116V1.00208H46.1674C46.1466 0.714832 45.897 0.500372 45.6098 0.521168C45.5383 0.526368 45.4707 0.545864 45.4109 0.577058L41.1958 2.72426C41.0216 2.81264 40.9124 2.99201 40.9124 3.18697V18.2225C40.9124 18.5098 41.1451 18.7425 41.4323 18.7425H45.6488C45.936 18.7425 46.1687 18.5098 46.1687 18.2225V12.2593L46.17 12.2606Z" fill="currentColor"/>
      <path d="M13.5045 18.7438H7.01219C3.13891 18.7438 0 15.6049 0 11.7316V6.29603C0 6.00878 0.232656 5.77612 0.519903 5.77612H4.73631C5.02356 5.77612 5.25621 6.00878 5.25621 6.29603V12.2099C5.25621 13.1548 5.98278 13.9685 6.9277 14.014C7.93631 14.0621 8.76816 13.2575 8.76816 12.2606V6.29733C8.76816 6.01008 9.00081 5.77742 9.28806 5.77742H13.5045C13.7917 5.77742 14.0244 6.01008 14.0244 6.29733V18.2252C14.0244 18.5124 13.7917 18.7451 13.5045 18.7451H13.5045V18.7438Z" fill="currentColor"/>
      <path d="M21.0587 19.1792C21.5461 19.2598 22.0491 19.2897 22.5651 19.2637C26.1563 19.0856 29.0626 16.1559 29.2133 12.5634C29.381 8.56537 26.2005 5.26919 22.2453 5.24839C18.2902 5.22759 15.1955 8.46919 15.1955 12.375V23.5191H15.1968C15.2176 23.805 15.4671 24.0208 15.7544 23.9987C15.8258 23.9935 15.8934 23.974 15.9532 23.9428L20.1683 21.7956C20.3425 21.7072 20.4517 21.5278 20.4517 21.3329V19.6913C20.4517 19.3689 20.7415 19.1272 21.0587 19.1792ZM22.2077 14.0165C21.238 14.0165 20.4517 13.2302 20.4517 12.2606C20.4517 11.291 21.238 10.5046 22.2077 10.5046C23.1773 10.5046 23.9636 11.291 23.9636 12.2606C23.9636 13.2302 23.1773 14.0165 22.2077 14.0165Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_upshift">
        <rect width="77.7306" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const Badge = ({ children, className }) => (
  <span className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide font-sans ${className}`}>
    {children}
  </span>
);

const VaultCard = ({ vault }) => {
  const isComingSoon = Boolean(vault.isComingSoon);
  const isMuted = isComingSoon || vault.status === 'inactive';

  return (
    <div className={`h-full flex flex-col bg-white border border-gray-100 rounded-xl p-6 shadow-sm transition-all ${isMuted ? 'opacity-80' : 'hover:shadow-md'}`}>
      {/* Mobile: Coming Soon pill above all content */}
      {isComingSoon && (
        <div className="sm:hidden mb-3">
          <Badge className={vault.badges[0].color}>
            {vault.badges[0].text}
          </Badge>
        </div>
      )}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img 
              src={vault.icon} 
              alt="" 
              className={`h-10 w-auto max-w-full max-h-10 object-contain object-left shrink-0 ${isMuted ? 'grayscale opacity-50' : ''}`} 
            />
            {/* Desktop: Coming Soon next to icon; mobile: shown at top */}
            {isComingSoon && (
              <Badge className={`${vault.badges[0].color} hidden sm:inline-flex`}>
                {vault.badges[0].text}
              </Badge>
            )}
          </div>
          <div className="flex gap-1.5">
            {vault.badges.map((badge, idx) => (
              (!isComingSoon || idx !== 0) && (
                <Badge key={idx} className={badge.color}>
                  {badge.text}
                </Badge>
              )
            ))}
          </div>
        </div>
        
        <h3 className={`font-bold leading-tight flex items-center gap-1 font-satoshi text-2xl ${isMuted ? 'text-gray-400' : 'text-gray-900'}`}>
          {vault.titleUrl ? (
            <a
              href={vault.titleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-sm hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${isMuted ? 'text-inherit hover:text-gray-500' : 'text-inherit hover:text-blue-700'}`}
              aria-label={`${vault.name} on Etherscan (opens in a new tab)`}
            >
              {vault.name}
            </a>
          ) : (
            vault.name
          )}
        </h3>
      </div>

      <p className={`flex-1 text-sm mb-6 leading-relaxed font-sans min-h-0 ${isMuted ? 'text-gray-400' : 'text-gray-500'}`}>
        {vault.description}{' '}
        {vault.moreInfoUrl ? (
          <a
            href={vault.moreInfoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex align-baseline ml-0.5 ${isMuted ? 'text-gray-300 hover:text-gray-400' : 'text-gray-400 hover:text-blue-600'} transition-colors`}
            aria-label={`View ${vault.name} on Morpho (opens in a new tab)`}
          >
            <ExternalLink className="inline-block w-3 h-3" />
          </a>
        ) : (
          <ExternalLink className={`inline-block w-3 h-3 ml-1 ${isMuted ? 'text-gray-300' : 'text-gray-400'}`} aria-hidden />
        )}
      </p>

      <div className="grid grid-cols-2 gap-3 border-t border-gray-50 pt-6 shrink-0 lg:flex lg:items-end lg:justify-between lg:gap-8">
        <Stat label="TVL Cap" value={vault.stats.tvlCap} disabled={isMuted} />
        <Stat label="Covered Vault APY" value={coveredApyFromStats(vault.stats)} disabled={isMuted} />
        <Stat label="Base Vault APY (Morpho)" value={vault.stats.baseApy} disabled={isMuted} />
        <Stat 
          label="APY Boost" 
          value={vault.stats.apyBoost} 
          isPositive={!isMuted}
          disabled={isMuted}
          icon={<Sparkles className={`w-4 h-4 ${isMuted ? 'text-gray-300' : 'text-green-500'}`} />} 
        />
        <Stat label="Current TVL" value={vault.stats.currentTvl} disabled={isMuted} className="col-span-2 sm:col-span-1" />
      </div>
    </div>
  );
};

const Stat = ({ label, value, isPositive, disabled, icon, className = '' }) => (
  <div className={`flex flex-col ${className}`}>
    <span className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-sans font-medium">
      {label}
    </span>
    <span className={`text-xl font-bold flex items-center gap-1 font-satoshi tracking-tight ${
      disabled ? 'text-gray-400' : isPositive ? 'text-green-600' : 'text-gray-900'
    }`}>
      {value}
      {icon}
    </span>
  </div>
);

const ComingSoonBrandLogo = ({ id }) => {
  const cls = 'h-6 w-auto text-gray-900';
  switch (id) {
    case 'nest':
      return <NestLogo className={cls} />;
    case 'upshift':
      return <UpshiftLogo className={cls} />;
    case 'midas':
      return <MidasLogo />;
    default:
      return null;
  }
};

const ComingSoonMiniCard = ({ name, id, href }) => {
  const shellClass =
    'bg-white border border-gray-100 rounded-lg p-5 flex flex-col justify-center items-start shadow-sm transition-all group';
  const body = (
    <>
      <div className="mb-3">
        <ComingSoonBrandLogo id={id} />
      </div>
      <span className="text-sm font-medium font-sans text-gray-600">
        {name}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${shellClass} cursor-pointer hover:border-gray-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500`}
      >
        {body}
      </a>
    );
  }

  return (
    <div className={`${shellClass} cursor-default`} aria-disabled="true">
      {body}
    </div>
  );
};

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const VaultCardSkeleton = () => (
  <div className="h-full flex flex-col bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="w-16 h-6 rounded-full" />
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-7 w-3/4 rounded" />
    </div>

    <div className="flex-1 mb-6 space-y-2">
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-2/3 rounded" />
    </div>

    <div className="grid grid-cols-2 gap-3 border-t border-gray-50 pt-6 shrink-0 lg:flex lg:items-end lg:justify-between lg:gap-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col">
          <Skeleton className="h-3 w-16 mb-2 rounded" />
          <Skeleton className="h-6 w-12 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const ComingSoonMiniCardSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-lg p-5 flex flex-col justify-center items-start shadow-sm">
    <Skeleton className="h-6 w-20 mb-3 rounded" />
    <Skeleton className="h-4 w-32 rounded" />
  </div>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = (
    <>
      <a href="https://catalysis.network/" className="hover:text-blue-600 transition-colors" onClick={() => setMenuOpen(false)}>About</a>
      <a href="https://docs.catalysis.network/" className="hover:text-blue-600 transition-colors" onClick={() => setMenuOpen(false)}>Docs</a>
      <a href="https://catalysis.network/contact-us" className="hover:text-blue-600 transition-colors" onClick={() => setMenuOpen(false)}>Contact Us</a>
    </>
  );

  return (
    <div className="sticky top-6 z-50 flex justify-center w-full px-4 mb-16">
      <div className="relative w-full max-w-[668px]">
        <nav
          style={{
            minHeight: '58px',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderBottom: '1px solid rgba(56, 55, 55, 0.15)',
            boxShadow: '0 1px 24px 0 rgba(0, 0, 0, 0.05)'
          }}
          className="backdrop-blur-md rounded-[999px] px-6 md:px-10 py-4 flex justify-between items-center"
        >
          <a href="/" className="flex items-center group cursor-pointer">
            <CatalysisNavbarLogo className="text-[#383737] group-hover:text-blue-600 transition-colors" />
          </a>
          {/* Desktop: links */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-600 font-sans">
            {navLinks}
          </div>
          {/* Mobile: hamburger */}
          <button
            type="button"
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-white/60 hover:text-gray-900 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div
            className="md:hidden absolute top-full left-0 right-0 mt-2 rounded-2xl py-3 px-4 text-sm font-medium text-gray-600 font-sans shadow-lg border border-gray-100"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <a href="https://catalysis.network/" className="block py-3 px-4 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors" onClick={() => setMenuOpen(false)}>About</a>
            <a href="https://docs.catalysis.network/" className="block py-3 px-4 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors" onClick={() => setMenuOpen(false)}>Docs</a>
            <a href="https://catalysis.network/contact-us" className="block py-3 px-4 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors" onClick={() => setMenuOpen(false)}>Contact Us</a>
          </div>
        )}
      </div>
    </div>
  );
};

const FooterLogo = () => (
  <svg 
    width="1434" 
    height="222" 
    viewBox="0 0 1434 222" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto opacity-[0.07]"
  >
    <path d="M764.46 6.45703V278.057H806.752V6.45703H764.46ZM1255.46 62.33C1249.51 68.28 1242.01 71.254 1232.96 71.254C1223.9 71.254 1216.4 68.28 1210.45 62.33C1204.5 56.122 1201.53 48.621 1201.53 39.826C1201.53 31.032 1204.5 23.66 1210.45 17.71C1216.4 11.502 1223.9 8.39803 1232.96 8.39803C1242.01 8.39803 1249.51 11.502 1255.46 17.71C1261.41 23.66 1264.38 31.032 1264.38 39.826C1264.38 48.621 1261.41 56.122 1255.46 62.33ZM1211.62 278.058V97.25H1253.91V278.058H1211.62ZM1355.96 282.714C1333.2 282.714 1314.7 276.894 1300.48 265.254C1286.25 253.614 1279.14 239.387 1279.14 222.574H1321.43C1321.43 230.334 1324.79 236.671 1331.52 241.586C1338.5 246.5 1347.42 248.958 1358.29 248.958C1366.31 248.958 1372.64 247.018 1377.3 243.138C1381.96 239.258 1384.28 234.084 1384.28 227.618C1384.28 217.271 1379.76 210.934 1370.7 208.606L1324.14 195.802C1298.02 188.559 1284.96 171.875 1284.96 145.75C1284.96 130.747 1291.42 118.202 1304.36 108.114C1317.29 97.767 1333.97 92.594 1354.41 92.594C1377.43 92.594 1395.02 97.767 1407.18 108.114C1419.59 118.46 1425.8 132.04 1425.8 148.854H1384.28C1384.28 141.352 1381.44 135.532 1375.75 131.394C1370.32 126.996 1362.69 124.798 1352.86 124.798C1345.35 124.798 1339.15 126.608 1334.23 130.23C1329.32 133.592 1326.86 137.99 1326.86 143.422C1326.86 153.251 1332.03 159.718 1342.38 162.822L1385.45 175.238C1397.86 178.859 1407.95 185.067 1415.71 193.862C1423.47 202.398 1427.35 212.356 1427.35 223.738C1427.35 241.327 1421.01 255.554 1408.34 266.418C1395.92 277.282 1378.46 282.714 1355.96 282.714ZM1057.57 265.254C1071.79 276.894 1090.29 282.714 1113.05 282.714C1135.56 282.714 1153.02 277.282 1165.43 266.418C1178.11 255.554 1184.44 241.327 1184.44 223.738C1184.44 212.356 1180.56 202.398 1172.8 193.862C1165.04 185.067 1154.95 178.859 1142.54 175.238L1099.47 162.822C1089.12 159.718 1083.95 153.251 1083.95 143.422C1083.95 137.99 1086.41 133.592 1091.32 130.23C1096.24 126.608 1102.45 124.798 1109.95 124.798C1119.78 124.798 1127.41 126.996 1132.84 131.394C1138.53 135.532 1141.38 141.352 1141.38 148.854H1182.89C1182.89 132.04 1176.68 118.46 1164.27 108.114C1152.11 97.767 1134.52 92.594 1111.5 92.594C1091.06 92.594 1074.38 97.767 1061.45 108.114C1048.51 118.202 1042.05 130.747 1042.05 145.75C1042.05 171.875 1055.11 188.559 1081.23 195.802L1127.8 208.606C1136.85 210.934 1141.38 217.271 1141.38 227.618C1141.38 234.084 1139.05 239.258 1134.39 243.138C1129.73 247.018 1123.4 248.958 1115.38 248.958C1104.52 248.958 1095.59 246.5 1088.61 241.586C1081.88 236.671 1078.52 230.334 1078.52 222.574H1036.23C1036.23 239.387 1043.34 253.614 1057.57 265.254ZM968.557 97.25H1010.85V278.834C1010.85 306.511 1002.96 327.981 987.181 343.242C971.92 357.21 951.485 364.194 925.877 364.194C899.235 364.194 878.541 357.986 863.797 345.57C850.864 334.189 844.139 318.539 843.621 298.622H886.301C887.336 308.969 890.699 316.599 896.389 321.514C902.339 326.687 911.909 329.274 925.101 329.274C938.552 329.274 949.157 324.877 956.917 316.082C964.677 307.546 968.557 294.095 968.557 275.73V252.838C956.917 272.755 937.517 282.714 910.357 282.714C888.888 282.714 872.333 275.859 860.693 262.15C849.312 248.182 843.621 229.946 843.621 207.442V97.25H885.913V198.518C885.913 229.817 898.976 245.466 925.101 245.466C939.328 245.466 950.063 240.422 957.305 230.334C964.807 220.246 968.557 207.054 968.557 190.758V97.25ZM625.635 282.714C597.44 282.714 575.583 273.79 560.063 255.942C544.543 238.094 536.783 215.331 536.783 187.654C536.783 160.235 544.931 137.602 561.227 119.754C577.523 101.647 599.38 92.594 626.799 92.594C638.956 92.594 650.079 95.18 660.167 100.354C670.255 105.527 678.015 112.64 683.447 121.694V97.25H725.739V278.058H683.447V253.614C678.274 262.408 670.126 269.522 659.003 274.954C648.139 280.127 637.016 282.714 625.635 282.714ZM631.843 245.078C649.174 245.078 662.366 239.646 671.419 228.782C680.731 217.918 685.387 204.208 685.387 187.654C685.387 171.099 680.731 157.39 671.419 146.526C662.366 135.662 649.174 130.23 631.843 130.23C615.547 130.23 602.614 135.662 593.043 146.526C583.731 157.131 579.075 170.84 579.075 187.654C579.075 204.467 583.731 218.306 593.043 229.17C602.614 239.775 615.547 245.078 631.843 245.078ZM528.896 240.807C523.205 241.842 516.092 242.359 507.556 242.359C498.244 242.359 491.518 240.16 487.38 235.763C483.241 231.107 481.172 221.536 481.172 207.051V132.555H522.688V97.247H481.172V42.539H438.88V97.247H408.228V132.555H438.88V216.751C438.88 230.978 440.82 242.747 444.7 252.059C448.58 261.371 454.012 267.967 460.996 271.847C467.98 275.468 474.058 277.796 479.232 278.831C484.405 279.866 490.484 280.383 497.468 280.383C509.625 280.383 520.101 279.607 528.896 278.055V240.807ZM286.862 282.714C258.668 282.714 236.811 273.79 221.29 255.942C205.77 238.094 198.01 215.331 198.01 187.654C198.01 160.235 206.158 137.602 222.454 119.754C238.751 101.647 260.608 92.594 288.026 92.594C300.184 92.594 311.306 95.18 321.395 100.354C331.483 105.527 339.242 112.64 344.674 121.694V97.25H386.966V278.058H344.674V253.614C339.501 262.408 331.353 269.522 320.23 274.954C309.367 280.127 298.244 282.714 286.862 282.714ZM293.07 245.078C310.401 245.078 323.593 239.646 332.647 228.782C341.958 217.918 346.615 204.208 346.615 187.654C346.615 171.099 341.958 157.39 332.647 146.526C323.593 135.662 310.401 130.23 293.07 130.23C276.775 130.23 263.841 135.662 254.271 146.526C244.959 157.131 240.303 170.84 240.303 187.654C240.303 204.467 244.959 218.306 254.271 229.17C263.841 239.775 276.775 245.078 293.07 245.078ZM30.704 256.718C47 274.048 68.986 282.714 96.664 282.714C121.496 282.714 141.413 276.635 156.416 264.478C171.677 252.32 180.342 236.024 182.412 215.59H140.12C135.205 235.248 120.72 245.078 96.664 245.078C81.661 245.078 69.892 240.163 61.356 230.334C53.078 220.246 48.94 206.019 48.94 187.654C48.94 169.288 53.078 155.191 61.356 145.362C69.892 135.274 81.661 130.23 96.664 130.23C120.978 130.23 135.464 140.706 140.12 161.658H182.412C180.342 140.706 171.677 124.022 156.416 111.606C141.413 98.931 121.496 92.594 96.664 92.594C68.986 92.594 47 101.388 30.704 118.978C14.666 136.308 6.648 159.2 6.648 187.654C6.648 216.107 14.666 239.128 30.704 256.718Z" fill="black"/>
  </svg>
);

const Footer = () => (
  <footer className="mt-auto w-full bg-white relative overflow-visible">
    {/* Background watermark - matches Figma footer */}
    <div className="absolute inset-0 flex items-end justify-center select-none pointer-events-none overflow-visible min-h-[343px]">
      <div className="w-full max-w-[1440px] px-6 pb-0">
        <FooterLogo />
      </div>
    </div>

    {/* Content - 1440 Fill x 343 Hug per Figma */}
    <div className="relative z-10 w-full max-w-[1440px] mx-auto px-14 pb-14 pt-6 flex flex-col justify-center">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 md:gap-16">
        {/* Left: Logo + social */}
        <div className="flex flex-col gap-6">
          <a href="/" className="inline-block">
            <CatalysisNavbarLogo className="h-6 w-auto text-[#383737]" />
          </a>
          <div className="flex gap-3">
            <a href="https://x.com/0xcatalysis" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="X (Twitter)" rel="noopener noreferrer" target="_blank">
              <Twitter className="w-4 h-4 text-gray-600" />
            </a>
            <a href="https://github.com/0xcatalysis" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="GitHub" rel="noopener noreferrer" target="_blank">
              <Github className="w-4 h-4 text-gray-600" />
            </a>
          </div>
        </div>

        {/* Right: Three columns - Resources, Developers, Company */}
        <nav className="flex flex-wrap gap-x-16 gap-y-8 md:gap-x-20" aria-label="Footer">
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-4 font-sans">Resources</h4>
            <ul className="text-sm text-gray-500 space-y-3 font-sans">
              <li>
                <a
                  href="https://glowing-force-2df.notion.site/Catalysis-a68f0b2f34bc82d3905981e37be36063"
                  className="hover:text-blue-600 transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Brand
                </a>
              </li>
              <li><a href="https://catalysis.network/contact-us" className="hover:text-blue-600 transition-colors">Help & Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-4 font-sans">Developers</h4>
            <ul className="text-sm text-gray-500 space-y-3 font-sans">
              <li><a href="https://docs.catalysis.network/" className="hover:text-blue-600 transition-colors">Docs</a></li>
              <li>
                <a
                  href="https://arxiv.org/abs/2505.03843"
                  className="hover:text-blue-600 transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Technical Paper
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-4 font-sans">Company</h4>
            <ul className="text-sm text-gray-500 space-y-3 font-sans">
              <li><a href="https://catalysis.network/contact-us" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
              <li><a href="https://catalysis.network/t-and-c" className="hover:text-blue-600 transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </footer>
);

/**
 * MAIN APPLICATION COMPONENT
 */
export default function App() {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVaults(MOCK_VAULTS);
      setLoading(false);
    };

    fetchData();
  }, []);

  const sortedVaults = [...vaults].sort((a, b) => a.id - b.id);
  const vaultsFirstRow = sortedVaults.slice(0, 2);
  const vaultsSecondRow = sortedVaults.slice(2, 4);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 flex flex-col">
      <Navbar />

      <main className="container mx-auto max-w-6xl px-6 flex-1 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg shadow-blue-500/20 shrink-0 ring-1 ring-black/5">
            <img
              src={publicUrl('morpho-with-background-logo.svg')}
              alt="Morpho"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              decoding="async"
            />
          </div>
          <h1 className="text-xl font-bold text-[#0F172A] font-sans">Morpho Covered Vaults</h1>
        </div>

        {loading ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {[1, 2].map(i => (
                <VaultCardSkeleton key={i} />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-24">
              {[1, 2].map((i) => (
                <VaultCardSkeleton key={`row2-${i}`} />
              ))}
            </div>
            <section className="mt-16">
              <Skeleton className="h-8 w-40 mb-8" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <ComingSoonMiniCardSkeleton key={i} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {vaultsFirstRow.map((vault) => (
                <VaultCard key={vault.id} vault={vault} />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-24">
              {vaultsSecondRow.map((vault) => (
                <VaultCard key={vault.id} vault={vault} />
              ))}
            </div>

            <section className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 font-sans">Coming Soon</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {COMING_SOON_DATA.map((item) => (
                        <ComingSoonMiniCard key={item.id} name={item.name} id={item.id} href={item.href} />
                    ))}
                </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}