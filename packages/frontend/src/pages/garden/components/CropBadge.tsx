import type {
  ProjectCropEvaluation,
  ProjectCropStatus,
  Sentiment,
} from '@l2beat/config'
import type { CSSProperties } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { SentimentText } from '~/components/SentimentText'
import { cn } from '~/utils/cn'
import { CROP_STATUS_LABELS } from '../crops'

const STATUS_SENTIMENT: Record<ProjectCropStatus, Sentiment> = {
  good: 'good',
  partiallyReviewed: 'neutral',
  medium: 'warning',
  bad: 'bad',
  notReviewed: 'neutral',
}

const PLANT_COLOR: Record<ProjectCropStatus, string> = {
  good: 'text-[#1a9d4f] dark:text-[#15ca60]',
  partiallyReviewed: 'text-[#1a9d4f] dark:text-[#15ca60]',
  medium: 'text-[#e0a52a] dark:text-[#ffc107]',
  bad: 'text-[#ef4d4d] dark:text-[#ff5d5d]',
  notReviewed: 'text-[#bcbfc7] dark:text-[#5a5f68]',
}

const CHIP_STYLE: Record<ProjectCropStatus, string> = {
  good: 'border-[#b6e0c4] bg-[#eef9f1] text-[#16863f] dark:border-[#15ca60]/50 dark:bg-[#15ca60]/10 dark:text-[#3fe07f]',
  partiallyReviewed:
    'border-dashed border-[#aab0b8] bg-[#f4f9f5] text-[#16863f] dark:border-[#5a5f68] dark:bg-[#15ca60]/5 dark:text-[#3fe07f]',
  medium:
    'border-[#efd9a6] bg-[#fdf7ea] text-[#b07d18] dark:border-[#ffc107]/50 dark:bg-[#ffc107]/10 dark:text-[#ffcf3a]',
  bad: 'border-[#f4c7c7] bg-[#fdeeee] text-[#d83a3a] dark:border-[#ff5d5d]/50 dark:bg-[#ff5d5d]/10 dark:text-[#ff8080]',
  notReviewed:
    'border-dashed border-[#e0e2e8] bg-[#f7f8fa] text-[#aab0b8] dark:border-[#3a3f47] dark:bg-white/5 dark:text-[#6b7079]',
}

interface Props {
  letter: string
  label: string
  evaluation: ProjectCropEvaluation
  delay: number
}

export function CropBadge({ letter, label, evaluation, delay }: Props) {
  const { status } = evaluation
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="hover:-translate-y-0.5 flex w-10 flex-col items-center gap-1 transition-transform duration-200">
          <span className={cn('flex h-10 items-end', PLANT_COLOR[status])}>
            <CropPlant status={status} delay={delay} />
          </span>
          <span
            className={cn(
              'flex size-[26px] items-center justify-center rounded-full border font-semibold',
              letter.length > 1 ? 'text-[10px]' : 'text-xs',
              CHIP_STYLE[status],
            )}
            style={{
              animation: `garden-pop .5s ease-out ${delay}s both`,
            }}
          >
            {letter}
          </span>
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px]">
        <SentimentText
          sentiment={STATUS_SENTIMENT[status]}
          className="font-medium text-base"
        >
          {`${label}: ${CROP_STATUS_LABELS[status]}`}
        </SentimentText>
        {evaluation.description && (
          <p className="mt-1 text-primary">{evaluation.description}</p>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

function CropPlant({
  status,
  delay,
}: {
  status: ProjectCropStatus
  delay: number
}) {
  const grow: CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
    animation: `garden-grow .8s cubic-bezier(.18,.7,.24,1) ${delay}s both`,
  }
  const leafL: CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: '100% 100%',
    animation: `garden-leaf .5s ease-out ${delay + 0.3}s both`,
  }
  const leafR: CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: '0% 100%',
    animation: `garden-leaf .5s ease-out ${delay + 0.36}s both`,
  }
  const bloom: CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
    animation: `garden-bloom .55s cubic-bezier(.2,.9,.3,1.3) ${delay + 0.52}s both`,
  }
  const idle = (name: string, duration: string): CSSProperties => ({
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
    animation: `${name} ${duration} ease-in-out ${delay + 0.8}s infinite`,
  })

  return (
    <svg
      width={34}
      height={40}
      viewBox="0 0 34 40"
      className="block overflow-visible"
      aria-hidden
    >
      <Soil status={status} />
      {(status === 'good' || status === 'partiallyReviewed') && (
        <g style={idle('garden-sway', '4.6s')}>
          <g style={grow}>
            <path
              d="M17 34 C17 27 17 20 17 13"
              stroke="currentColor"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M17 27 C11 27.5 6.5 24 5.6 18.8 C11.2 18.4 15.7 22 17 27 Z"
              fill="currentColor"
              style={leafL}
            />
            <path
              d="M17 27 C23 27.5 27.5 24 28.4 18.8 C22.8 18.4 18.3 22 17 27 Z"
              fill="currentColor"
              style={leafR}
            />
            <g style={bloom}>
              <circle cx="17" cy="5.2" r="3.2" fill="currentColor" />
              <circle cx="12.4" cy="9" r="3.2" fill="currentColor" />
              <circle cx="21.6" cy="9" r="3.2" fill="currentColor" />
              <circle cx="17" cy="12.6" r="3.2" fill="currentColor" />
              <circle cx="17" cy="9" r="2.05" className="fill-[#ffd54a]" />
            </g>
          </g>
        </g>
      )}
      {status === 'medium' && (
        <g style={idle('garden-sway-s', '5.2s')}>
          <g style={grow}>
            <path
              d="M17 34 C17 29 17 25 17 20"
              stroke="currentColor"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M17 23 C12.5 23.4 9.3 21 8.6 17.4 C12.6 17 16 19.6 17 23 Z"
              fill="currentColor"
              style={leafL}
            />
            <path
              d="M17 23 C21.5 23.4 24.7 21 25.4 17.4 C21.4 17 18 19.6 17 23 Z"
              fill="currentColor"
              style={leafR}
            />
            <ellipse
              cx="17"
              cy="18"
              rx="2.5"
              ry="3.3"
              fill="currentColor"
              style={bloom}
            />
          </g>
        </g>
      )}
      {status === 'bad' && (
        <g style={idle('garden-wilt', '5.6s')}>
          <g style={grow}>
            <path
              d="M17 34 C17 28 18.6 24 13.4 22"
              stroke="currentColor"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M13.4 22 C9.4 21 6.7 23.2 6.3 26.6 C10.3 27 12.9 24.8 13.4 22 Z"
              fill="currentColor"
            />
            <path
              d="M18.4 28 C21.9 27.6 24.4 29.4 24.8 32 C21.4 32 19 30.6 18.4 28 Z"
              fill="currentColor"
              opacity=".8"
            />
          </g>
        </g>
      )}
      {status === 'notReviewed' && (
        <g
          style={{
            transformBox: 'fill-box',
            transformOrigin: '50% 100%',
            animation: 'garden-ghost 3.6s ease-in-out infinite',
          }}
        >
          <path
            d="M17 33 V27"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="2 2.4"
          />
          <path
            d="M17 29.5 C13.8 29.5 11.3 27.4 10.9 24.2"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="2 2.4"
          />
          <path
            d="M17 29.5 C20.2 29.5 22.7 27.4 23.1 24.2"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="2 2.4"
          />
        </g>
      )}
    </svg>
  )
}

function Soil({ status }: { status: ProjectCropStatus }) {
  if (status === 'notReviewed') {
    return (
      <ellipse
        cx="17"
        cy="35.4"
        rx="11.5"
        ry="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeDasharray="3 2.6"
      />
    )
  }
  if (status === 'partiallyReviewed') {
    return (
      <>
        <path
          d="M17 32.2 A12 3.2 0 0 0 17 38.6 Z"
          className="fill-[#cfc4b0] dark:fill-[#2a251d]"
        />
        <path
          d="M17 32.2 A12 3.2 0 0 1 17 38.6"
          fill="none"
          strokeWidth="1.1"
          strokeDasharray="3 2.6"
          className="stroke-[#bcbfc7] dark:stroke-[#5a5f68]"
        />
      </>
    )
  }
  return (
    <ellipse
      cx="17"
      cy="35.4"
      rx="12"
      ry="3.2"
      className="fill-[#cfc4b0] dark:fill-[#2a251d]"
    />
  )
}
