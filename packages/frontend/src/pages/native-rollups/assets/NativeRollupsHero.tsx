/**
 * Lightweight decorative hero illustration for the Native Rollups page.
 * Shows an L2 block being verified by a recursive EXECUTE call into the L1 EVM,
 * drawn with the brand gradient (#7E41CC → #FF46C0).
 */
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
      aria-label="A native rollup block verified by Ethereum's EXECUTE precompile"
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
          <stop stopColor="#7E41CC" />
          <stop offset="1" stopColor="#FF46C0" />
        </linearGradient>
        <linearGradient
          id="nr-brand-soft"
          x1="60"
          y1="40"
          x2="360"
          y2="260"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7E41CC" stopOpacity="0.18" />
          <stop offset="1" stopColor="#FF46C0" stopOpacity="0.18" />
        </linearGradient>
      </defs>

      {/* Ambient glow */}
      <ellipse cx="210" cy="150" rx="180" ry="120" fill="url(#nr-brand-soft)" />

      {/* Outer L1 container */}
      <rect
        x="40"
        y="46"
        width="340"
        height="208"
        rx="18"
        className="fill-pure-white dark:fill-zinc-900"
        stroke="url(#nr-brand)"
        strokeWidth="2"
      />
      <text
        x="60"
        y="76"
        className="fill-secondary"
        fontSize="13"
        fontWeight="600"
        letterSpacing="1.5"
      >
        L1 · ETHEREUM EVM
      </text>

      {/* Inner nested "native" block — an L2 block executed inside L1 */}
      <rect
        x="74"
        y="96"
        width="272"
        height="132"
        rx="14"
        fill="url(#nr-brand-soft)"
        stroke="url(#nr-brand)"
        strokeWidth="2"
      />

      {/* EXECUTE pill */}
      <rect
        x="150"
        y="118"
        width="120"
        height="30"
        rx="15"
        fill="url(#nr-brand)"
      />
      <text
        x="210"
        y="138"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="13"
        fontWeight="700"
        letterSpacing="1"
      >
        EXECUTE
      </text>

      {/* Recursion arrow looping back into the block */}
      <path
        d="M210 148v18M210 166c0 22-58 14-58 34M152 200l-6-8M152 200l8-5"
        stroke="url(#nr-brand)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* State transition rows */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x="96"
            y={192 + i * 12}
            width={150 - i * 34}
            height="5"
            rx="2.5"
            className="fill-purple-100/70 dark:fill-pink-200/60"
          />
          <circle
            cx={290 + i * 14}
            cy={194 + i * 12}
            r="3"
            fill="url(#nr-brand)"
          />
        </g>
      ))}
    </svg>
  )
}
