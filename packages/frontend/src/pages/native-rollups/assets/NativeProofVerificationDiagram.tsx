/** Shows Ethereum's proof engine fanning out to the programs it can verify. */
export function NativeProofVerificationDiagram({
  className,
}: {
  className?: string
}) {
  return (
    <svg
      width="360"
      height="204"
      viewBox="0 0 360 204"
      fill="none"
      className={className}
      role="img"
      aria-label="Ethereum's proof engine verifies proofs consumed by native EVM rollups, custom VMs, and other ZK applications"
    >
      <defs>
        <linearGradient
          id="npv-brand"
          x1="30"
          y1="20"
          x2="330"
          y2="190"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-purple-100)" />
          <stop offset="1" stopColor="var(--color-pink-100)" />
        </linearGradient>
        <linearGradient
          id="npv-brand-soft"
          x1="30"
          y1="20"
          x2="330"
          y2="190"
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
          id="npv-arrow"
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
        x="105"
        y="14"
        width="150"
        height="58"
        rx="14"
        fill="url(#npv-brand-soft)"
        stroke="url(#npv-brand)"
        strokeWidth="2"
      />
      <circle cx="180" cy="36" r="11" fill="url(#npv-brand)" />
      <path
        d="m174.5 36 4 4 7-8.5"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="180"
        y="63"
        textAnchor="middle"
        className="fill-secondary"
        fontSize="10"
        fontWeight="600"
        letterSpacing="0.8"
      >
        PROOF ENGINE
      </text>

      <path
        d="M180 76v58"
        stroke="url(#npv-brand)"
        strokeWidth="2.5"
        strokeLinecap="round"
        markerEnd="url(#npv-arrow)"
      />
      <path
        d="M180 76c0 40-116 26-116 62"
        stroke="url(#npv-brand)"
        strokeWidth="2.5"
        strokeLinecap="round"
        markerEnd="url(#npv-arrow)"
      />
      <path
        d="M180 76c0 40 116 26 116 62"
        stroke="url(#npv-brand)"
        strokeWidth="2.5"
        strokeLinecap="round"
        markerEnd="url(#npv-arrow)"
      />

      <rect
        x="16"
        y="144"
        width="96"
        height="44"
        rx="12"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="url(#npv-brand)"
        strokeWidth="2"
      />
      <text
        x="64"
        y="170"
        textAnchor="middle"
        className="fill-secondary"
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="0.6"
      >
        NATIVE EVM
      </text>

      <rect
        x="132"
        y="144"
        width="96"
        height="44"
        rx="12"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="url(#npv-brand)"
        strokeWidth="2"
      />
      <text
        x="180"
        y="170"
        textAnchor="middle"
        className="fill-secondary"
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="0.6"
      >
        CUSTOM VM
      </text>

      <rect
        x="248"
        y="144"
        width="96"
        height="44"
        rx="12"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="url(#npv-brand)"
        strokeWidth="2"
      />
      <text
        x="296"
        y="170"
        textAnchor="middle"
        className="fill-secondary"
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="0.6"
      >
        ZK APP
      </text>
    </svg>
  )
}
