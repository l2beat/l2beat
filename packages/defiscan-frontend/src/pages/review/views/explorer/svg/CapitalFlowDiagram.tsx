import type { CompiledReview } from '../../../../../types'
import { formatUsdValue } from '../../../../../utils/format'
import { adminTypeColor } from '../../../../../utils/colors'
import { getHumanAdmins } from '../../../../../utils/admins'

interface CapitalFlowDiagramProps {
  review: CompiledReview
}

export function CapitalFlowDiagram({ review }: CapitalFlowDiagramProps) {
  const { admins, funds } = review

  // Only show human-controlled admins (centralization risk focus)
  const topAdmins = [...getHumanAdmins(admins)]
    .sort((a, b) => b.totalDirectCapital - a.totalDirectCapital)
    .slice(0, 4)

  // Pick up to 4 fund holders sorted by total value
  const topFunds = [...funds]
    .map((f) => ({
      ...f,
      total: (f.balances?.totalUsdValue ?? 0) + (f.positions?.totalUsdValue ?? 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 4)

  if (topAdmins.length === 0 && topFunds.length === 0) {
    return null
  }

  // Admin-less layout: shield message on left, fund holders on right
  if (topAdmins.length === 0) {
    const boxW = 200
    const boxH = 48
    const gapY = 10
    const topPadding = 20
    const svgWidth = 720
    const fundColX = svgWidth - boxW - 20
    const shieldCenterX = (fundColX) / 2
    const svgHeight = topPadding + topFunds.length * (boxH + gapY) + 20
    const shieldCenterY = svgHeight / 2

    return (
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full"
        style={{ maxHeight: `${Math.min(svgHeight, 320)}px` }}
      >
        {/* Shield icon + message on left */}
        <g transform={`translate(${shieldCenterX}, ${shieldCenterY - 16})`}>
          <path
            d="M-10,-12 L0,-18 L10,-12 L10,0 C10,8 0,14 0,14 C0,14 -10,8 -10,0 Z"
            fill="#DCFCE7"
            stroke="#10B981"
            strokeWidth={1.5}
          />
          <path
            d="M-4,-1 L-1,2 L5,-4"
            fill="none"
            stroke="#10B981"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="0"
            y="28"
            textAnchor="middle"
            fill="#166534"
            fontWeight="600"
            fontSize="12"
          >
            No admin controls
          </text>
          <text
            x="0"
            y="44"
            textAnchor="middle"
            fill="#166534"
            fontWeight="600"
            fontSize="12"
          >
            over protocol funds
          </text>
        </g>

        {/* Column label */}
        <text
          x={fundColX + boxW / 2}
          y={12}
          textAnchor="middle"
          fill="#6B7280"
          fontSize="10"
          fontWeight="600"
        >
          CONTRACTS HOLDING FUNDS
        </text>

        {/* Fund holder boxes on right */}
        {topFunds.map((fund, i) => {
          const y = topPadding + i * (boxH + gapY)
          return (
            <g key={fund.address}>
              <rect
                x={fundColX}
                y={y}
                width={boxW}
                height={boxH}
                rx={6}
                fill="#DCFCE7"
                stroke="#10B981"
                strokeWidth={1.5}
              />
              <text
                x={fundColX + 10}
                y={y + 20}
                fill="#166534"
                fontWeight="600"
                fontSize="11"
              >
                {fund.name.length > 24 ? `${fund.name.slice(0, 22)}...` : fund.name}
              </text>
              <text
                x={fundColX + 10}
                y={y + 36}
                fill="#10B981"
                fontWeight="600"
                fontSize="10"
              >
                {formatUsdValue(fund.total)}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  // Normal 3-column layout when admins exist
  const adminColX = 20
  const fnColX = 240
  const fundColX = 500
  const boxW = 180
  const boxH = 48
  const gapY = 12
  const topPadding = 20

  const maxRows = Math.max(topAdmins.length, topFunds.length, 1)
  const svgHeight = topPadding + maxRows * (boxH + gapY) + 40

  // Build connections: admin -> functions -> fund holders
  const connections: { adminIdx: number; fundIdx: number }[] = []
  const fundAddressToIdx = new Map<string, number>()
  topFunds.forEach((f, i) => fundAddressToIdx.set(f.address.toLowerCase(), i))

  topAdmins.forEach((admin, adminIdx) => {
    const touchedFundIdxs = new Set<number>()
    for (const fn of admin.functions) {
      const directIdx = fundAddressToIdx.get(fn.contractAddress.toLowerCase())
      if (directIdx !== undefined) {
        touchedFundIdxs.add(directIdx)
      }
      for (const rc of fn.reachableContracts) {
        const rcIdx = fundAddressToIdx.get(rc.address.toLowerCase())
        if (rcIdx !== undefined) {
          touchedFundIdxs.add(rcIdx)
        }
      }
    }
    for (const fundIdx of touchedFundIdxs) {
      connections.push({ adminIdx, fundIdx })
    }
  })

  function adminY(i: number): number {
    return topPadding + i * (boxH + gapY)
  }

  function fundY(i: number): number {
    return topPadding + i * (boxH + gapY)
  }

  return (
    <svg
      viewBox={`0 0 720 ${svgHeight}`}
      className="w-full"
      style={{ maxHeight: `${Math.min(svgHeight, 320)}px` }}
    >
      {/* Column labels */}
      <text x={adminColX + boxW / 2} y={12} textAnchor="middle" fill="#6B7280" fontSize="10" fontWeight="600">
        ADMINS
      </text>
      <text x={fnColX + 40} y={12} textAnchor="middle" fill="#6B7280" fontSize="10" fontWeight="600">
        FUNCTIONS
      </text>
      <text x={fundColX + boxW / 2} y={12} textAnchor="middle" fill="#6B7280" fontSize="10" fontWeight="600">
        FUND HOLDERS
      </text>

      {/* Connection lines */}
      {connections.map((conn, i) => {
        const startX = adminColX + boxW
        const startY = adminY(conn.adminIdx) + boxH / 2
        const endX = fundColX
        const endY = fundY(conn.fundIdx) + boxH / 2
        const midX1 = startX + 60
        const midX2 = endX - 60
        return (
          <path
            key={`conn-${i}`}
            d={`M${startX},${startY} C${midX1},${startY} ${midX2},${endY} ${endX},${endY}`}
            fill="none"
            stroke="#C4B5FD"
            strokeWidth="1.5"
            opacity={0.5}
          />
        )
      })}

      {/* Admin boxes */}
      {topAdmins.map((admin, i) => {
        const y = adminY(i)
        const color = adminTypeColor(admin.adminType)
        return (
          <g key={admin.address}>
            <rect
              x={adminColX}
              y={y}
              width={boxW}
              height={boxH}
              rx={6}
              fill={`${color}15`}
              stroke={color}
              strokeWidth={1.5}
            />
            <text
              x={adminColX + 10}
              y={y + 20}
              fill={color}
              fontWeight="600"
              fontSize="11"
            >
              {admin.name.length > 22 ? `${admin.name.slice(0, 20)}...` : admin.name}
            </text>
            <text
              x={adminColX + 10}
              y={y + 36}
              fill="#6B7280"
              fontSize="9"
            >
              {admin.adminType} | {admin.functions.length} fn | {formatUsdValue(admin.totalDirectCapital)}
            </text>
          </g>
        )
      })}

      {/* Function indicators (center column) */}
      {topAdmins.map((admin, i) => {
        const y = adminY(i)
        const fnCount = admin.functions.length
        return (
          <g key={`fn-${admin.address}`}>
            <circle
              cx={fnColX + 40}
              cy={y + boxH / 2}
              r={14}
              fill="#FEF3C7"
              stroke="#F59E0B"
              strokeWidth={1.5}
            />
            <text
              x={fnColX + 40}
              y={y + boxH / 2 + 4}
              textAnchor="middle"
              fill="#92400E"
              fontWeight="600"
              fontSize="10"
            >
              {fnCount}
            </text>
            <line
              x1={adminColX + boxW}
              y1={y + boxH / 2}
              x2={fnColX + 26}
              y2={y + boxH / 2}
              stroke="#C4B5FD"
              strokeWidth={1.5}
              markerEnd="url(#cfArrow)"
            />
          </g>
        )
      })}

      {/* Fund holder boxes */}
      {topFunds.map((fund, i) => {
        const y = fundY(i)
        return (
          <g key={fund.address}>
            <rect
              x={fundColX}
              y={y}
              width={boxW}
              height={boxH}
              rx={6}
              fill="#DCFCE7"
              stroke="#10B981"
              strokeWidth={1.5}
            />
            <text
              x={fundColX + 10}
              y={y + 20}
              fill="#166534"
              fontWeight="600"
              fontSize="11"
            >
              {fund.name.length > 22 ? `${fund.name.slice(0, 20)}...` : fund.name}
            </text>
            <text
              x={fundColX + 10}
              y={y + 36}
              fill="#10B981"
              fontWeight="600"
              fontSize="10"
            >
              {formatUsdValue(fund.total)}
            </text>
          </g>
        )
      })}

      {/* Legend */}
      <g transform={`translate(20, ${svgHeight - 20})`}>
        <rect width="8" height="8" rx="2" fill="#C4B5FD" />
        <text x="14" y="8" fill="#6B7280" fontSize="9">Admin controls</text>
        <rect x="110" width="8" height="8" rx="2" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="0.5" />
        <text x="124" y="8" fill="#6B7280" fontSize="9">Permissioned functions</text>
        <rect x="260" width="8" height="8" rx="2" fill="#DCFCE7" stroke="#10B981" strokeWidth="0.5" />
        <text x="274" y="8" fill="#6B7280" fontSize="9">Funds locked</text>
      </g>

      {/* Arrow markers */}
      <defs>
        <marker id="cfArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#C4B5FD" />
        </marker>
      </defs>
    </svg>
  )
}
