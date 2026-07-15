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

      <ellipse cx="210" cy="150" rx="180" ry="120" fill="url(#nr-brand-soft)" />

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
        d="M130 97h25"
        stroke="url(#nr-brand)"
        strokeWidth="2.5"
        strokeLinecap="round"
        markerEnd="url(#nr-arrow)"
      />

      <rect
        x="166"
        y="34"
        width="112"
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
        x="180"
        y="76"
        width="84"
        height="25"
        rx="12.5"
        fill="url(#nr-brand)"
      />
      <text
        x="222"
        y="93"
        textAnchor="middle"
        fill="#fff"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.6"
      >
        PROOF-CARRYING
      </text>
      <text x="181" y="120" className="fill-secondary" fontSize="10">
        ● BLOBS
      </text>
      <text x="181" y="139" className="fill-secondary" fontSize="10">
        ● PROOF SIDECAR
      </text>

      <path
        d="M280 97h24"
        stroke="url(#nr-brand)"
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
      <circle cx="360" cy="84" r="14" fill="url(#nr-brand)" />
      <path
        d="m353 84 5 5 9-11"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="360"
        y="116"
        textAnchor="middle"
        className="fill-secondary"
        fontSize="10"
        fontWeight="600"
        letterSpacing="0.8"
      >
        PROOF ENGINE
      </text>

      <path
        d="M360 146v35c0 14-12 25-26 25h-31"
        stroke="url(#nr-brand)"
        strokeWidth="2.5"
        strokeLinecap="round"
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
        y="229"
        width="148"
        height="23"
        rx="11.5"
        fill="url(#nr-brand-soft)"
      />
      <text
        x="210"
        y="244"
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
