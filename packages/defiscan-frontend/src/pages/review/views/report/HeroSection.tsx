import { useState } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import type { CompiledReview } from '../../../../types'
import { MoreInfoButton } from '../../../../components/MoreInfoButton'
import { ShareButton } from '../../../../components/ShareButton'
import { deriveRadarData } from '../../../../utils/radar'
import { getLatestActivityTimestamp } from '../activityTimestamp'
import { StatusPill } from '../StatusPill'

interface HeroSectionProps {
  review: CompiledReview
  onExportPdf: () => void
  onSubscribe: () => void
}

const RADAR_AXES = ['ADMIN CONTROL', 'DEPENDENCIES', 'ACCESS', 'VERIFIABILITY', 'GOVERNANCE']

export function HeroSection({ review, onExportPdf, onSubscribe }: HeroSectionProps) {
  const { metadata } = review
  const radarData = deriveRadarData(review)
  const [descExpanded, setDescExpanded] = useState(false)

  const latestActivity = getLatestActivityTimestamp(review)
  const activityDate = latestActivity
    ? new Date(latestActivity).toLocaleDateString('en-CA').replace(/-/g, '.')
    : null

  return (
    <div className="grid grid-cols-12 gap-6 items-center">
      {/* Left: text + buttons */}
      <div className="col-span-12 lg:col-span-7 flex flex-col justify-center py-8 lg:py-12">
        {/* Date row */}
        <div className="flex items-center gap-3 mb-4">
          <StatusPill verified={review.verified !== false} variant="hero" />
          {activityDate && (
            <span className="font-mono text-xs text-text-muted uppercase">
              Latest activity: {activityDate}
            </span>
          )}
        </div>

        {/* Protocol name */}
        <h1 className="font-bold text-3xl sm:text-4xl lg:text-[48px] lg:leading-[48px] tracking-[-1.2px] text-text-primary mb-4">
          {metadata.protocolName}
        </h1>

        {/* Description with Show more */}
        <div className="mb-6 sm:mb-8">
          <p
            className={`text-base sm:text-[18px] font-normal text-text-muted sm:leading-[29px] ${!descExpanded ? 'line-clamp-3' : ''}`}
          >
            {metadata.description}
          </p>
          <button
            onClick={() => setDescExpanded((v) => !v)}
            className="mt-1 text-base sm:text-[18px] font-bold text-accent sm:leading-[29px] hover:underline"
          >
            {descExpanded ? 'Show less' : 'Show more'}
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <button
            className="flex items-center gap-2 bg-accent text-white px-4 sm:px-6 py-3 sm:py-[13px] rounded-sm font-semibold text-sm sm:text-base hover:bg-accent-dark transition-colors"
            onClick={onSubscribe}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Subscribe
          </button>
          <MoreInfoButton resources={review.resources ?? []} />
          <ShareButton review={review} onExportPdf={onExportPdf} />
        </div>
      </div>

      {/* Right: radar chart */}
      <div className="col-span-12 lg:col-span-5 h-[260px] sm:h-[360px] lg:h-[450px] relative">
        <div className="absolute inset-0 rounded-lg border border-border bg-[#f8fafc] overflow-hidden">
          {/* Radial gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.05) 0%, rgba(37,99,235,0) 70%)',
            }}
          />
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={radarData}
              cx="50%"
              cy="50%"
              outerRadius="62%"
            >
              <PolarGrid gridType="circle" stroke="rgba(37,99,235,0.1)" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600, letterSpacing: '1px' }}
              />
              <Radar
                dataKey="value"
                stroke="#2563eb"
                strokeOpacity={0.8}
                fill="#2563eb"
                fillOpacity={0.1}
                strokeWidth={3}
                dot={{ fill: '#2563eb', stroke: 'none', r: 5, fillOpacity: 1 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// Keep axes accessible for tests/storybook
export { RADAR_AXES }
