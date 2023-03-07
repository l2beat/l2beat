import React from 'react'

export type Sentiment = 'bad' | 'warning' | 'fine'

export interface RosetteProps {
  risks: {
    sequencerFailure: Sentiment
    stateValidation: Sentiment
    dataAvailability: Sentiment
    upgradeability: Sentiment
    validatorFailure: Sentiment
  }
}

export function SmallRosette({ risks }: RosetteProps) {
  return (
    <svg
      width="31"
      height="30"
      viewBox="0 0 31 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6497 17.3247C14.6511 16.8162 14.1568 16.4537 13.6722 16.608L2.30605 20.2267C1.88435 20.361 1.67416 20.8259 1.87579 21.2199C2.55689 22.5506 4.19904 25.3713 6.67017 27.1831C9.35855 29.1542 12.4233 29.7938 13.8318 29.993C14.2569 30.0531 14.6157 29.7182 14.6169 29.2888L14.6497 17.3247Z"
        className={sentimentToClassName(risks.sequencerFailure)}
      />
      <path
        d="M13.1685 14.9842C13.6503 14.8214 13.8338 14.2365 13.5313 13.8277L6.43759 4.23791C6.17441 3.88221 5.66652 3.83331 5.35874 4.15131C4.31906 5.22551 2.1794 7.69021 1.26219 10.6138C0.264338 13.7945 0.648156 16.9017 0.914237 18.2991C0.994558 18.7209 1.42739 18.9524 1.83417 18.8149L13.1685 14.9842Z"
        className={sentimentToClassName(risks.stateValidation)}
      />
      <path
        d="M14.8938 12.7651C15.1933 13.176 15.8064 13.176 16.1059 12.7651L23.1325 3.12611C23.3932 2.76851 23.2879 2.26921 22.8923 2.07071C21.5562 1.40031 18.564 0.096509 15.4998 0.096509C12.1663 0.096509 9.31644 1.39281 8.06283 2.06501C7.68441 2.26791 7.5931 2.75011 7.84604 3.09711L14.8938 12.7651Z"
        className={sentimentToClassName(risks.dataAvailability)}
      />

      <path
        d="M17.3002 16.6253C16.8151 16.4727 16.322 16.8369 16.3251 17.3454L16.3994 29.2735C16.4022 29.716 16.7835 30.055 17.2196 29.9796C18.6927 29.7252 21.8742 28.9963 24.339 27.1759C27.0205 25.1954 28.5428 22.4596 29.1518 21.1742C29.3357 20.7862 29.1226 20.344 28.713 20.2151L17.3002 16.6253Z"
        className={sentimentToClassName(risks.upgradeability)}
      />
      <path
        d="M17.5115 13.7855C17.2106 14.1953 17.3961 14.7796 17.8784 14.9407L29.192 18.7205C29.6118 18.8607 30.0557 18.6092 30.1252 18.1721C30.3598 16.6957 30.6968 13.4493 29.7694 10.5289C28.7605 7.35161 26.6625 5.02781 25.6424 4.03641C25.3345 3.73711 24.8472 3.79611 24.5931 4.14221L17.5115 13.7855Z"
        className={sentimentToClassName(risks.validatorFailure)}
      />
    </svg>
  )
}

function sentimentToClassName(sentiment: Sentiment): string {
  switch (sentiment) {
    case 'bad':
      return 'fill-red-350'
    case 'warning':
      return 'fill-yellow-200'
    case 'fine':
      return 'fill-gray-750'
  }
}
