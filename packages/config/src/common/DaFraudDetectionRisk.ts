import type { TableReadyValue } from '../types'

const NoFraudDetection: TableReadyValue = {
  value: 'None',
  sentiment: 'bad',
  description:
    'There is no fraud detection mechanism in place. A data withholding attack can only be detected by nodes downloading the full data from the DA layer.',
}

export const DaFraudDetectionRisk = {
  NoFraudDetection,
}
