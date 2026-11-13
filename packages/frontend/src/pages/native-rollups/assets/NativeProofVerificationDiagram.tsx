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
      aria-label="EIP-8288 verifies the proofs that native EVM rollups, custom VMs, and other ZK applications depend on"
    >
      <defs>
        <marker
          id="npv-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0l6 3.5L0 7z" fill="var(--accent)" />
        </marker>
      </defs>

      <rect
        x="105"
        y="14"
        width="150"
        height="58"
        rx="14"
        className="fill-(--accent)/10"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <circle cx="180" cy="36" r="11" fill="var(--accent)" />
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
        className="fill-primary"
        fontSize="14"
        fontWeight="600"
      >
        EIP-8288
      </text>

      <path
        d="M180 96H64v40"
        stroke="var(--accent)"
        strokeWidth="2.5"
        markerEnd="url(#npv-arrow)"
      />
      <path
        d="M180 78v58"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        markerEnd="url(#npv-arrow)"
      />
      <path
        d="M180 96h116v40"
        stroke="var(--accent)"
        strokeWidth="2.5"
        markerEnd="url(#npv-arrow)"
      />

      <rect
        x="16"
        y="144"
        width="96"
        height="44"
        rx="12"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <text
        x="64"
        y="171"
        textAnchor="middle"
        className="fill-primary"
        fontSize="14"
        fontWeight="600"
      >
        Native EVM
      </text>

      <rect
        x="132"
        y="144"
        width="96"
        height="44"
        rx="12"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <text
        x="180"
        y="171"
        textAnchor="middle"
        className="fill-primary"
        fontSize="14"
        fontWeight="600"
      >
        Custom VM
      </text>

      <rect
        x="248"
        y="144"
        width="96"
        height="44"
        rx="12"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <text
        x="296"
        y="171"
        textAnchor="middle"
        className="fill-primary"
        fontSize="14"
        fontWeight="600"
      >
        ZK app
      </text>
    </svg>
  )
}
