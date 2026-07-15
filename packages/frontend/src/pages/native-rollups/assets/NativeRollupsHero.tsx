/** Shows the proof-carrying transaction flow from an L2 block into Ethereum. */
export function NativeRollupsHeroIllustration({
  className,
}: {
  className?: string
}) {
  return (
    <svg
      width="420"
      height="300"
      viewBox="0 0 420 300"
      fill="none"
      className={className}
      role="img"
      aria-label="An L2 block and its proofs flow through a proof-carrying transaction into Ethereum's proof engine and a rollup contract"
    >
      <defs>
        <linearGradient
          id="nr-brand"
          x1="60"
          y1="40"
          x2="360"
          y2="260"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-purple-100)" />
          <stop offset="1" stopColor="var(--color-pink-100)" />
        </linearGradient>
        <linearGradient
          id="nr-brand-soft"
          x1="60"
          y1="40"
          x2="360"
          y2="260"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-purple-100)" stopOpacity="0.18" />
          <stop
            offset="1"
            stopColor="var(--color-pink-100)"
            stopOpacity="0.18"
          />
        </linearGradient>
        <marker
          id="nr-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0l6 3.5L0 7z" fill="var(--color-purple-100)" />
        </marker>
      </defs>

      <rect
        x="16"
        y="50"
        width="112"
        height="94"
        rx="14"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="url(#nr-brand)"
        strokeWidth="2"
      />
      <text
        x="32"
        y="76"
        className="fill-secondary"
        fontSize="11"
        fontWeight="600"
        letterSpacing="1.2"
      >
        L2 BLOCK
      </text>
      <rect
        x="32"
        y="91"
        width="78"
        height="7"
        rx="3.5"
        className="fill-purple-100/70 dark:fill-pink-200/70"
      />
      <rect
        x="32"
        y="107"
        width="62"
        height="7"
        rx="3.5"
        className="fill-purple-100/45 dark:fill-pink-200/45"
      />
      <rect
        x="32"
        y="123"
        width="45"
        height="7"
        rx="3.5"
        className="fill-purple-100/25 dark:fill-pink-200/30"
      />

      <path
        d="M134 97h22"
        stroke="var(--color-purple-100)"
        strokeWidth="2.5"
        strokeLinecap="round"
        markerEnd="url(#nr-arrow)"
      />

      <rect
        x="162"
        y="34"
        width="120"
        height="126"
        rx="14"
        fill="url(#nr-brand-soft)"
        stroke="url(#nr-brand)"
        strokeWidth="2"
      />
      <text
        x="222"
        y="61"
        textAnchor="middle"
        className="fill-secondary"
        fontSize="10"
        fontWeight="600"
        letterSpacing="1"
      >
        L1 TRANSACTION
      </text>
      <rect
        x="174"
        y="74"
        width="96"
        height="24"
        rx="12"
        fill="url(#nr-brand)"
      />
      <text
        x="222"
        y="90"
        textAnchor="middle"
        fill="#fff"
        fontSize="8.5"
        fontWeight="700"
        letterSpacing="0.5"
      >
        PROOF-CARRYING
      </text>
      <text x="178" y="118" className="fill-secondary" fontSize="10">
        ● BLOBS
      </text>
      <text x="178" y="137" className="fill-secondary" fontSize="10">
        ● PROOF SIDECAR
      </text>

      <path
        d="M288 97h22"
        stroke="var(--color-purple-100)"
        strokeWidth="2.5"
        strokeLinecap="round"
        markerEnd="url(#nr-arrow)"
      />

      <rect
        x="316"
        y="50"
        width="88"
        height="94"
        rx="14"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="url(#nr-brand)"
        strokeWidth="2"
      />
      <circle cx="360" cy="82" r="14" fill="url(#nr-brand)" />
      <path
        d="m353 82 5 5 9-11"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="360"
        y="114"
        textAnchor="middle"
        className="fill-secondary"
        fontSize="10"
        fontWeight="600"
        letterSpacing="0.8"
      >
        PROOF ENGINE
      </text>

      <path
        d="M360 150v78h-48"
        stroke="var(--color-purple-100)"
        strokeWidth="2.5"
        markerEnd="url(#nr-arrow)"
      />

      <rect
        x="116"
        y="190"
        width="188"
        height="76"
        rx="14"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="url(#nr-brand)"
        strokeWidth="2"
      />
      <text
        x="210"
        y="216"
        textAnchor="middle"
        className="fill-secondary"
        fontSize="10"
        fontWeight="600"
        letterSpacing="1"
      >
        ROLLUP CONTRACT
      </text>
      <rect
        x="136"
        y="228"
        width="148"
        height="23"
        rx="11.5"
        fill="url(#nr-brand-soft)"
      />
      <text
        x="210"
        y="243"
        textAnchor="middle"
        className="fill-purple-100 dark:fill-pink-200"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.4"
      >
        ETHEREUM&apos;S EVM ✓
      </text>
    </svg>
  )
}
