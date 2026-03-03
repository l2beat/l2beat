import { riskColor, type RiskLevel } from '../../../../utils/risk'

interface RiskGaugeProps {
  score: number
  level: RiskLevel
}

export function RiskGauge({ score, level }: RiskGaugeProps) {
  const color = riskColor(level)
  const rotation = (score / 100) * 180 - 90

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="115" viewBox="0 0 200 115">
        {/* Background arc */}
        <path
          d="M 20 105 A 80 80 0 0 1 180 105"
          fill="none"
          stroke="#E5E1ED"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Colored arc proportional to score */}
        <path
          d="M 20 105 A 80 80 0 0 1 180 105"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 251} 251`}
          opacity={0.85}
        />
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = ((tick / 100) * 180 - 180) * (Math.PI / 180)
          const x1 = 100 + 68 * Math.cos(angle)
          const y1 = 105 + 68 * Math.sin(angle)
          const x2 = 100 + 75 * Math.cos(angle)
          const y2 = 105 + 75 * Math.sin(angle)
          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#9CA3AF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )
        })}
        {/* Needle */}
        <line
          x1="100"
          y1="105"
          x2={100 + 55 * Math.cos((rotation * Math.PI) / 180)}
          y2={105 + 55 * Math.sin((rotation * Math.PI) / 180)}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx="100" cy="105" r="5" fill={color} />
        <circle cx="100" cy="105" r="2.5" fill="white" />
      </svg>
      <div className="text-3xl font-bold tabular-nums -mt-1" style={{ color }}>
        {score}
      </div>
      <div
        className="text-xs font-semibold tracking-wider mt-0.5"
        style={{ color }}
      >
        {level}
      </div>
    </div>
  )
}
