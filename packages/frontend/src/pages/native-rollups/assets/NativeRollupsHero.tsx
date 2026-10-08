/**
 * Shows how an L2 block reaches Ethereum: a frame transaction whose
 * dependency frame EIP-8288 proves, and whose advance call the rollup contract
 * checks against the EIP-8357 registry.
 */
export function NativeRollupsHeroIllustration({
  className,
}: {
  className?: string
}) {
  return (
    <svg
      width="420"
      height="306"
      viewBox="0 0 420 306"
      fill="none"
      className={className}
      role="img"
      aria-label="An L2 block is posted in an EIP-8141 frame transaction. Its dependency frame declares the proof, which EIP-8288 aggregates, and its advance call reaches the rollup contract, which checks the proof's verification key against the EIP-8357 registry."
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
        <radialGradient
          id="nr-glow"
          cx="210"
          cy="150"
          r="190"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-purple-100)" stopOpacity="0.14" />
          <stop offset="1" stopColor="var(--color-pink-100)" stopOpacity="0" />
        </radialGradient>
        <marker
          id="nr-arrow"
          markerUnits="userSpaceOnUse"
          markerWidth="9"
          markerHeight="9"
          refX="5"
          refY="4.5"
          orient="auto"
        >
          <path d="M0 .5l8 4-8 4z" fill="var(--accent)" />
        </marker>
      </defs>

      <ellipse cx="210" cy="150" rx="210" ry="150" fill="url(#nr-glow)" />

      {/* The L2 block, on top of the chain before it. */}
      <rect
        x="16"
        y="40"
        width="96"
        height="88"
        rx="12"
        fill="url(#nr-brand-soft)"
        stroke="url(#nr-brand)"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <rect
        x="13"
        y="50"
        width="96"
        height="88"
        rx="12"
        className="fill-(--accent)/10"
      />
      <rect
        x="10"
        y="46"
        width="96"
        height="88"
        rx="12"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="url(#nr-brand)"
        strokeWidth="2"
      />
      <text
        x="24"
        y="70"
        className="fill-secondary dark:fill-primary"
        fontSize="10"
        fontWeight="700"
        letterSpacing="1.2"
      >
        L2 BLOCK
      </text>
      <rect
        x="24"
        y="84"
        width="66"
        height="6"
        rx="3"
        className="fill-(--accent)/70"
      />
      <rect
        x="24"
        y="98"
        width="52"
        height="6"
        rx="3"
        className="fill-(--accent)/45"
      />
      <rect
        x="24"
        y="112"
        width="38"
        height="6"
        rx="3"
        className="fill-(--accent)/25 dark:fill-(--accent)/30"
      />

      <path
        d="M112 90h20"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd="url(#nr-arrow)"
      />

      {/* The frame transaction that posts it, with its blobs and frames. */}
      <rect
        x="141"
        y="18"
        width="144"
        height="140"
        rx="14"
        className="fill-(--accent)/10"
      />
      <rect
        x="138"
        y="14"
        width="144"
        height="140"
        rx="14"
        className="fill-pure-white dark:fill-zinc-900"
      />
      <rect
        x="138"
        y="14"
        width="144"
        height="140"
        rx="14"
        fill="url(#nr-brand-soft)"
        stroke="url(#nr-brand)"
        strokeWidth="2"
      />
      <text
        x="151"
        y="34"
        className="fill-secondary dark:fill-primary"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="1"
      >
        FRAME TX
      </text>
      <rect
        x="220"
        y="23"
        width="50"
        height="15"
        rx="7.5"
        fill="url(#nr-brand)"
      />
      <text
        x="245"
        y="33.5"
        textAnchor="middle"
        fill="#fff"
        fontSize="7.5"
        fontWeight="700"
        letterSpacing="0.4"
      >
        EIP-8141
      </text>
      <circle cx="156" cy="49" r="4.5" fill="url(#nr-brand)" />
      <circle
        cx="168"
        cy="49"
        r="4.5"
        fill="url(#nr-brand)"
        fillOpacity="0.65"
      />
      <circle
        cx="180"
        cy="49"
        r="4.5"
        fill="url(#nr-brand)"
        fillOpacity="0.35"
      />
      <text
        x="191"
        y="52"
        className="fill-secondary dark:fill-primary"
        fontSize="8"
        fontWeight="600"
        letterSpacing="0.8"
      >
        BLOBS
      </text>

      <rect
        x="150"
        y="62"
        width="120"
        height="22"
        rx="7"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="var(--accent)"
        strokeOpacity="0.25"
      />
      <text
        x="160"
        y="76.5"
        className="fill-secondary dark:fill-primary"
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="0.6"
      >
        VERIFY
      </text>
      <text
        x="261"
        y="76.5"
        textAnchor="end"
        className="fill-secondary"
        fontSize="7.5"
        fontWeight="600"
        opacity="0.6"
      >
        0
      </text>

      <rect
        x="150"
        y="90"
        width="120"
        height="22"
        rx="7"
        fill="url(#nr-brand)"
      />
      <text
        x="160"
        y="104.5"
        fill="#fff"
        fontSize="8.5"
        fontWeight="700"
        letterSpacing="0.6"
      >
        DEPENDENCY
      </text>
      <text
        x="261"
        y="104.5"
        textAnchor="end"
        fill="#fff"
        fontSize="7.5"
        fontWeight="600"
        opacity="0.75"
      >
        1
      </text>

      <rect
        x="150"
        y="118"
        width="120"
        height="22"
        rx="7"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="var(--accent)"
        strokeOpacity="0.5"
      />
      <text
        x="160"
        y="132.5"
        className="fill-(--accent)"
        fontSize="8.5"
        fontWeight="700"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      >
        advance()
      </text>
      <text
        x="261"
        y="132.5"
        textAnchor="end"
        className="fill-secondary"
        fontSize="7.5"
        fontWeight="600"
        opacity="0.6"
      >
        2
      </text>

      <path
        d="M286 101h18"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd="url(#nr-arrow)"
      />

      {/* EIP-8288, which aggregates the declared proof. */}
      <rect
        x="313"
        y="56"
        width="100"
        height="98"
        rx="14"
        className="fill-(--accent)/10"
      />
      <rect
        x="310"
        y="52"
        width="100"
        height="98"
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
        y="117"
        textAnchor="middle"
        className="fill-secondary dark:fill-primary"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="0.8"
      >
        EIP-8288
      </text>
      <text
        x="360"
        y="131"
        textAnchor="middle"
        className="fill-secondary"
        fontSize="7.5"
        fontWeight="600"
        letterSpacing="0.8"
      >
        AGGREGATED
      </text>

      <path
        d="M210 158v34"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd="url(#nr-arrow)"
      />
      <path
        d="M360 154v85q0 8-8 8h-65"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd="url(#nr-arrow)"
      />
      <path
        d="M118 247h16"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd="url(#nr-arrow)"
      />

      <text
        x="126"
        y="240"
        textAnchor="middle"
        className="fill-(--accent)"
        fontSize="7"
        fontWeight="700"
        letterSpacing="0.6"
      >
        KEY
      </text>
      <text
        x="322"
        y="240"
        textAnchor="middle"
        className="fill-(--accent)"
        fontSize="7"
        fontWeight="700"
        letterSpacing="0.6"
      >
        PROOF ✓
      </text>

      {/* EIP-8357, which holds the EVM program's key for each fork. */}
      <rect
        x="13"
        y="202"
        width="104"
        height="98"
        rx="14"
        className="fill-(--accent)/10"
      />
      <rect
        x="10"
        y="198"
        width="104"
        height="98"
        rx="14"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="url(#nr-brand)"
        strokeWidth="2"
      />
      <circle
        cx="27"
        cy="220"
        r="5"
        stroke="url(#nr-brand)"
        strokeWidth="2.2"
      />
      <path
        d="M32 220h11m-4 0v4m4-4v3"
        stroke="url(#nr-brand)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="49"
        y="223.5"
        className="fill-secondary dark:fill-primary"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="0.8"
      >
        EIP-8357
      </text>
      <text
        x="22"
        y="240"
        className="fill-secondary"
        fontSize="7.5"
        fontWeight="600"
        letterSpacing="0.8"
      >
        KEY REGISTRY
      </text>
      <rect
        x="22"
        y="252"
        width="66"
        height="7"
        rx="3.5"
        className="fill-(--accent)/20"
      />
      <rect
        x="22"
        y="264"
        width="66"
        height="7"
        rx="3.5"
        className="fill-(--accent)/20"
      />
      <rect
        x="22"
        y="276"
        width="66"
        height="7"
        rx="3.5"
        fill="url(#nr-brand)"
      />
      <path d="M100 279.5l-6 3.5v-7z" fill="var(--accent)" />

      {/* The rollup contract, which takes the block once both checks pass. */}
      <rect
        x="143"
        y="202"
        width="140"
        height="98"
        rx="14"
        className="fill-(--accent)/10"
      />
      <rect
        x="140"
        y="198"
        width="140"
        height="98"
        rx="14"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="url(#nr-brand)"
        strokeWidth="2"
      />
      <text
        x="210"
        y="222"
        textAnchor="middle"
        className="fill-secondary dark:fill-primary"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="1"
      >
        ROLLUP CONTRACT
      </text>
      <rect
        x="153"
        y="236"
        width="114"
        height="22"
        rx="11"
        fill="url(#nr-brand-soft)"
        stroke="url(#nr-brand)"
        strokeOpacity="0.5"
      />
      <text
        x="210"
        y="250.5"
        textAnchor="middle"
        className="fill-(--accent)"
        fontSize="8.5"
        fontWeight="700"
        letterSpacing="0.4"
      >
        ETHEREUM&apos;S EVM ✓
      </text>
      <text
        x="210"
        y="280"
        textAnchor="middle"
        className="fill-secondary"
        fontSize="7.5"
        fontWeight="600"
        letterSpacing="0.8"
      >
        NEW STATE ROOT
      </text>
    </svg>
  )
}
