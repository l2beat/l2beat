import type { SvgIconProps } from '~/icons/svg-icon'
import type { RosetteValue } from '../../types'

function LowerLeftMaskPath(props: SvgIconProps) {
  return (
    <path
      d="M79.6194 98.4019C82.2458 97.576 84.9153 99.548 84.8979 102.301L84.4896 166.881C84.4744 169.277 82.4095 171.112 80.0485 170.704C72.0731 169.325 54.8489 165.377 41.5052 155.52C26.9884 144.797 18.7481 129.984 15.4511 123.024C14.4559 120.923 15.6097 118.529 17.8274 117.832L79.6194 98.4019Z"
      fill="black"
      {...props}
    />
  )
}

function UpperLeftMaskPath(props: SvgIconProps) {
  return (
    <path
      d="M79.2452 83.1876C80.8194 85.4464 79.7369 88.5838 77.1048 89.3913L15.3642 108.333C13.0735 109.035 10.7046 107.614 10.3872 105.239C9.31515 97.2171 7.9261 79.6009 13.337 63.9185C19.2235 46.8574 30.8905 34.5609 36.5442 29.3319C38.2509 27.7534 40.8805 28.1377 42.2097 30.0449L79.2452 83.1876Z"
      fill="black"
      {...props}
    />
  )
}

function UpperMaskPath(props: SvgIconProps) {
  return (
    <path
      d="M93.713 77.7909C92.0827 79.9984 88.7776 79.9866 87.1632 77.7676L49.0811 25.4231C47.6667 23.479 48.2491 20.767 50.4043 19.7012C57.6929 16.0967 74.0058 9.09794 90.6851 9.15731C108.83 9.2219 124.317 16.2928 131.131 19.9567C133.186 21.0616 133.673 23.6856 132.287 25.5623L93.713 77.7909Z"
      fill="black"
      {...props}
    />
  )
}

function UpperRightMaskPath(props: SvgIconProps) {
  return (
    <path
      d="M102.517 89.3334C99.9134 88.4374 98.9376 85.2652 100.587 83.061L139.282 31.3561C140.718 29.4377 143.469 29.1884 145.126 30.9194C150.722 36.7663 162.232 50.1747 167.109 66.0311C172.416 83.2815 170.244 100.092 168.761 107.649C168.314 109.931 165.963 111.171 163.765 110.414L102.517 89.3334Z"
      fill="black"
      {...props}
    />
  )
}

function LowerRightMaskPath(props: SvgIconProps) {
  return (
    <path
      d="M94.3017 102.38C94.3095 99.6272 96.9969 97.6798 99.6157 98.5296L161.043 118.464C163.322 119.204 164.446 121.727 163.342 123.854C159.615 131.038 150.639 146.26 137.206 155.994C122.591 166.585 105.979 169.955 98.3481 170.991C96.0445 171.304 94.112 169.48 94.1186 167.155L94.3017 102.38Z"
      fill="black"
      {...props}
    />
  )
}

const maskPaths = [
  LowerLeftMaskPath,
  UpperLeftMaskPath,
  UpperMaskPath,
  UpperRightMaskPath,
  LowerRightMaskPath,
]

export function risksToPizzas(
  risks: RosetteValue[],
  selectRisk: (risk: RosetteValue) => void,
) {
  const sliceHoverPaths: React.ReactNode[] = []

  for (let i = 0; i < risks.length; i++) {
    const risk = risks[i]!
    const MaskPath = maskPaths[i]!

    sliceHoverPaths.push(
      <MaskPath
        fill="transparent"
        onMouseEnter={() => selectRisk(risk)}
        onTouchStart={() => selectRisk(risk)}
        id={`${risk.name}-hover`}
      />,
    )
  }

  return {
    sliceHoverPaths,
  }
}
