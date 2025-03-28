import { assert } from '@l2beat/shared-pure'
import { useRef } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'
import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import { cn } from '~/utils/cn'
import { useRosetteTooltipContext } from '../rosette-tooltip-context'
import type { RosetteValue } from '../types'
import { RealProposerFailureRisk } from './real-elements/real-da'
import { RealSequencerFailureRisk } from './real-elements/real-ew'
import { RealExitWindowRisk } from './real-elements/real-sf'
import { RealSvRisk } from './real-elements/real-sv'
import { RealDaRisk } from './real-elements/real-vf'

interface Props {
  values: RosetteValue[]
  isUnderReview?: boolean
  className?: string
  background?: 'header' | 'surface' | false
}

export function RealPizzaRosetteIcon({
  values,
  className,
  // To pass to the elements
  isUnderReview: _,
  background = 'header',
}: Props) {
  const context = useRosetteTooltipContext()
  const svgRef = useRef(null)

  const [first, second, third, fourth, fifth] = values
  const setSelectedRisk = context?.setSelectedRisk
  // To pass to the elements
  // const selectedRisk = context?.selectedRisk

  useOnClickOutside(svgRef, () => setSelectedRisk?.(undefined))
  useEventListener('scroll', () => setSelectedRisk?.(undefined))

  assert(first && second && third && fourth && fifth, 'Invalid number of risks')

  const selectRisk = (risk: RosetteValue) => {
    setSelectedRisk?.(risk)
  }

  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      ref={svgRef}
      onMouseLeave={() => setSelectedRisk?.(undefined)}
    >
      <g clipPath="url(#clip0_1_787)">
        {background && (
          <circle
            cx="90"
            cy="90"
            r="90"
            className={cn(
              'stroke-divider stroke-2',
              background === 'header' && 'fill-header-secondary',
              background === 'surface' && 'fill-surface-secondary',
            )}
          />
        )}
        <g clipPath="url(#clip1_1_787)">
          <path
            d="M80.0183 98.2023C82.6447 97.3765 85.3142 99.3485 85.2968 102.102L84.8884 166.681C84.8733 169.077 82.8084 170.912 80.4474 170.504C72.472 169.126 55.2478 165.178 41.9041 155.321C27.3872 144.597 19.147 129.784 15.85 122.825C14.8548 120.724 16.0086 118.33 18.2263 117.632L80.0183 98.2023Z"
            fill="#B1B1B1"
          />
          <path
            d="M79.6441 82.9884C81.2182 85.2472 80.1357 88.3845 77.5036 89.192L15.763 108.133C13.4723 108.836 11.1034 107.415 10.786 105.04C9.71398 97.0179 8.32493 79.4017 13.7358 63.7193C19.6224 46.6581 31.2893 34.3617 36.9431 29.1327C38.6497 27.5542 41.2793 27.9385 42.6085 29.8457L79.6441 82.9884Z"
            fill="#B1B1B1"
          />
          <path
            d="M93.6189 77.5583C91.9891 79.7773 88.6702 79.7654 87.0564 77.5348L49.2006 25.2125C47.7962 23.2713 48.3764 20.5705 50.5218 19.5035C57.7687 15.8995 73.9936 8.89876 90.5831 8.95814C108.631 9.02273 124.035 16.0963 130.809 19.7596C132.854 20.8654 133.339 23.4783 131.963 25.3519L93.6189 77.5583Z"
            fill="#B1B1B1"
          />
          <path
            d="M93.6187 77.5583C91.9889 79.7773 88.6701 79.7654 87.0562 77.5348L49.2005 25.2125C47.796 23.2713 48.3763 20.5705 50.5216 19.5036C57.7685 15.8995 73.9935 8.89877 90.583 8.95814C108.631 9.02274 124.035 16.0963 130.809 19.7596C132.854 20.8654 133.339 23.4783 131.963 25.352L93.6187 77.5583Z"
            fill="#B1B1B1"
          />
          <path
            d="M102.916 89.1339C100.312 88.2379 99.3365 85.0657 100.986 82.8615L139.681 31.1566C141.116 29.2382 143.868 28.989 145.524 30.7199C151.121 36.5668 162.631 49.9752 167.508 65.8316C172.815 83.082 170.643 99.8928 169.16 107.45C168.713 109.731 166.362 110.971 164.164 110.215L102.916 89.1339Z"
            fill="#B1B1B1"
          />
          <path
            d="M94.7006 102.181C94.7084 99.4279 97.3958 97.4805 100.015 98.3303L161.442 118.265C163.721 119.005 164.845 121.528 163.741 123.655C160.013 130.839 151.038 146.061 137.604 155.795C122.99 166.385 106.378 169.756 98.7469 170.792C96.4433 171.105 94.5109 169.28 94.5174 166.956L94.7006 102.181Z"
            fill="#B1B1B1"
          />
          {/* naming is wrong but whatever */}
          <RealExitWindowRisk
            sentiment={first.sentiment ?? 'neutral'}
            onHover={() => selectRisk(first)}
          />
          <RealSvRisk
            sentiment={second.sentiment ?? 'neutral'}
            onHover={() => selectRisk(second)}
          />
          <RealProposerFailureRisk
            sentiment={third.sentiment ?? 'neutral'}
            onHover={() => selectRisk(third)}
          />
          <RealSequencerFailureRisk
            sentiment={fourth.sentiment ?? 'neutral'}
            onHover={() => selectRisk(fourth)}
          />
          <RealDaRisk
            sentiment={fifth.sentiment ?? 'neutral'}
            onHover={() => selectRisk(fifth)}
          />
        </g>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1_787"
          x1="160.395"
          y1="67.1172"
          x2="15.5655"
          y2="112.928"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FCB142" />
          <stop offset="1" stopColor="#997613" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_787"
          x1="149.846"
          y1="69.5339"
          x2="96.6023"
          y2="85.9415"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD359" />
          <stop offset="1" stopColor="#FFD96F" />
        </linearGradient>
        <radialGradient
          id="paint2_radial_1_787"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(87.3645 90.2417) rotate(162.45) scale(74.8229 76.296)"
        >
          <stop offset="0.719342" stopColor="#F50000" />
          <stop offset="1" stopColor="#8F0000" />
        </radialGradient>
        <linearGradient
          id="paint3_linear_1_787"
          x1="146.867"
          y1="96.6572"
          x2="108.013"
          y2="108.945"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F50000" />
          <stop offset="1" stopColor="#FE3030" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_1_787"
          x1="159.284"
          y1="77.8114"
          x2="118.977"
          y2="102.986"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F50000" />
          <stop offset="1" stopColor="#8F0000" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_1_787"
          x1="133.451"
          y1="149.411"
          x2="43.5734"
          y2="26.9512"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FCB142" />
          <stop offset="1" stopColor="#997613" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_1_787"
          x1="127.775"
          y1="140.196"
          x2="95.1447"
          y2="95.0367"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD359" />
          <stop offset="1" stopColor="#FFD96F" />
        </linearGradient>
        <radialGradient
          id="paint7_radial_1_787"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(88.0995 87.6727) rotate(-126.28) scale(74.8229 76.296)"
        >
          <stop offset="0.719342" stopColor="#F50000" />
          <stop offset="1" stopColor="#8F0000" />
        </radialGradient>
        <linearGradient
          id="paint8_linear_1_787"
          x1="101.13"
          y1="146.084"
          x2="77.0173"
          y2="113.234"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F50000" />
          <stop offset="1" stopColor="#FE3030" />
        </linearGradient>
        <linearGradient
          id="paint9_linear_1_787"
          x1="122.966"
          y1="151.792"
          x2="86.1812"
          y2="121.703"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F50000" />
          <stop offset="1" stopColor="#8F0000" />
        </linearGradient>
        <linearGradient
          id="paint10_linear_1_787"
          x1="20.794"
          y1="66.1107"
          x2="164.412"
          y2="115.59"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FCB142" />
          <stop offset="1" stopColor="#997613" />
        </linearGradient>
        <linearGradient
          id="paint11_linear_1_787"
          x1="30.707"
          y1="70.4539"
          x2="83.2467"
          y2="88.9924"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD359" />
          <stop offset="1" stopColor="#FFD96F" />
        </linearGradient>
        <radialGradient
          id="paint12_radial_1_787"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(93.231 91.0398) rotate(19.01) scale(74.8229 76.296)"
        >
          <stop offset="0.719342" stopColor="#F50000" />
          <stop offset="1" stopColor="#8F0000" />
        </radialGradient>
        <linearGradient
          id="paint13_linear_1_787"
          x1="49.2584"
          y1="50.4434"
          x2="87.786"
          y2="63.717"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F50000" />
          <stop offset="1" stopColor="#FE3030" />
        </linearGradient>
        <linearGradient
          id="paint14_linear_1_787"
          x1="28.0585"
          y1="58.1844"
          x2="75.4302"
          y2="61.973"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F50000" />
          <stop offset="1" stopColor="#8F0000" />
        </linearGradient>
        <radialGradient
          id="paint15_radial_1_787"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(90.84 92.4842) rotate(89.6) scale(74.8229 76.296)"
        >
          <stop offset="0.719342" stopColor="#F50000" />
          <stop offset="1" stopColor="#8F0000" />
        </radialGradient>
        <linearGradient
          id="paint16_linear_1_787"
          x1="114.516"
          y1="37.5196"
          x2="114.8"
          y2="78.2687"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F50000" />
          <stop offset="1" stopColor="#FE3030" />
        </linearGradient>
        <linearGradient
          id="paint17_linear_1_787"
          x1="100.17"
          y1="20.0972"
          x2="112.339"
          y2="66.0356"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F50000" />
          <stop offset="1" stopColor="#8F0000" />
        </linearGradient>
        <linearGradient
          id="paint18_linear_1_787"
          x1="90.2815"
          y1="15.8793"
          x2="91.3431"
          y2="167.778"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FCB142" />
          <stop offset="1" stopColor="#997613" />
        </linearGradient>
        <linearGradient
          id="paint19_linear_1_787"
          x1="89.4796"
          y1="26.6723"
          x2="89.4554"
          y2="82.3867"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD359" />
          <stop offset="1" stopColor="#FFD96F" />
        </linearGradient>
        <radialGradient
          id="paint20_radial_1_787"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(92.0007 87.9084) rotate(-53.5) scale(74.8229 76.296)"
        >
          <stop offset="0.719342" stopColor="#F50000" />
          <stop offset="1" stopColor="#8F0000" />
        </radialGradient>
        <linearGradient
          id="paint21_linear_1_787"
          x1="40.0656"
          y1="117.647"
          x2="64.3047"
          y2="84.8901"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F50000" />
          <stop offset="1" stopColor="#FE3030" />
        </linearGradient>
        <linearGradient
          id="paint22_linear_1_787"
          x1="41.0774"
          y1="140.194"
          x2="58.9279"
          y2="96.1505"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F50000" />
          <stop offset="1" stopColor="#8F0000" />
        </linearGradient>
        <linearGradient
          id="paint23_linear_1_787"
          x1="46.454"
          y1="149.504"
          x2="136.809"
          y2="27.3966"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FCB142" />
          <stop offset="1" stopColor="#997613" />
        </linearGradient>
        <linearGradient
          id="paint24_linear_1_787"
          x1="53.5756"
          y1="141.355"
          x2="87.0474"
          y2="96.8157"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD359" />
          <stop offset="1" stopColor="#FFD96F" />
        </linearGradient>
        <clipPath id="clip0_1_787">
          <rect width="180" height="180" rx="90" fill="white" />
        </clipPath>
        <clipPath id="clip1_1_787">
          <rect
            x="73.09"
            y="-23.5744"
            width="162.422"
            height="162.422"
            rx="81.2112"
            transform="rotate(36.4535 73.09 -23.5744)"
            fill="white"
          />
        </clipPath>
        <clipPath id="clip2_1_787">
          <rect
            width="14.4942"
            height="14.4942"
            fill="white"
            transform="translate(131.367 47.9254) rotate(72.45)"
          />
        </clipPath>
        <clipPath id="clip3_1_787">
          <rect
            width="19.9296"
            height="19.9296"
            fill="white"
            transform="translate(118.471 85.2584) rotate(72.45)"
          />
        </clipPath>
        <clipPath id="clip4_1_787">
          <rect
            width="19.9296"
            height="19.9296"
            fill="white"
            transform="translate(141.739 62.6972) rotate(72.45)"
          />
        </clipPath>
        <clipPath id="clip5_1_787">
          <rect
            width="14.4942"
            height="14.4942"
            fill="white"
            transform="translate(142.305 115.757) rotate(143.72)"
          />
        </clipPath>
        <clipPath id="clip6_1_787">
          <rect
            width="19.9296"
            height="19.9296"
            fill="white"
            transform="translate(102.808 115.532) rotate(143.72)"
          />
        </clipPath>
        <clipPath id="clip7_1_787">
          <rect
            width="19.9296"
            height="19.9296"
            fill="white"
            transform="translate(131.646 130.323) rotate(143.72)"
          />
        </clipPath>
        <clipPath id="clip8_1_787">
          <rect
            width="14.4942"
            height="14.4942"
            fill="white"
            transform="translate(32.6759 98.8192) rotate(-70.987)"
          />
        </clipPath>
        <clipPath id="clip9_1_787">
          <rect
            width="19.9296"
            height="19.9296"
            fill="white"
            transform="translate(65.2736 76.5157) rotate(-70.987)"
          />
        </clipPath>
        <clipPath id="clip10_1_787">
          <rect
            width="19.9296"
            height="19.9296"
            fill="white"
            transform="translate(77.8602 106.724) rotate(-70.987)"
          />
        </clipPath>
        <clipPath id="clip11_1_787">
          <rect
            width="19.9296"
            height="19.9296"
            fill="white"
            transform="translate(33.1445 80.7756) rotate(-70.987)"
          />
        </clipPath>
        <clipPath id="clip12_1_787">
          <rect
            width="14.4942"
            height="14.4942"
            fill="white"
            transform="translate(63.3805 37.9601) rotate(-0.4)"
          />
        </clipPath>
        <clipPath id="clip13_1_787">
          <rect
            width="19.9296"
            height="19.9296"
            fill="white"
            transform="translate(95.2507 61.2914) rotate(-0.4)"
          />
        </clipPath>
        <clipPath id="clip14_1_787">
          <rect
            width="19.9296"
            height="19.9296"
            fill="white"
            transform="translate(80.5541 32.4048) rotate(-0.4)"
          />
        </clipPath>
        <clipPath id="clip15_1_787">
          <rect
            width="14.4942"
            height="14.4942"
            fill="white"
            transform="translate(81.2186 147.995) rotate(-143.504)"
          />
        </clipPath>
        <clipPath id="clip16_1_787">
          <rect
            width="19.9296"
            height="19.9296"
            fill="white"
            transform="translate(69.7387 110.202) rotate(-143.504)"
          />
        </clipPath>
        <clipPath id="clip17_1_787">
          <rect
            width="19.9296"
            height="19.9296"
            fill="white"
            transform="translate(64.1493 142.127) rotate(-143.504)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
