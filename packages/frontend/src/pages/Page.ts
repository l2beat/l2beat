import {
  ActivityApiResponse,
  FinalityApiResponse,
  ImplementationChangeReportApiResponse,
  L2CostsApiResponse,
  LivenessApiResponse,
  ManuallyVerifiedContracts,
  ProjectAssetsBreakdownApiResponse,
  TvlApiResponse,
  VerificationStatus,
  VerifiersApiResponse,
} from '@l2beat/shared-pure'
import { ReactElement } from 'react'

export interface Page {
  slug: string
  page: ReactElement
}

export interface Wrapped<Props> {
  props: Props
  wrapper: WrapperProps
}

export interface WrapperProps {
  metadata: PageMetadata
  preloadApis?: string[]
  banner: boolean | undefined
}
export interface PageMetadata {
  title: string
  description: string
  image: string
  url: string
}

export interface PagesData {
  tvlApiResponse: TvlApiResponse
  activityApiResponse: ActivityApiResponse | undefined
  verificationStatus: VerificationStatus
  manuallyVerifiedContracts: ManuallyVerifiedContracts
  tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse | undefined
  livenessApiResponse: LivenessApiResponse | undefined
  finalityApiResponse: FinalityApiResponse | undefined
  l2CostsApiResponse: L2CostsApiResponse | undefined
  implementationChange: ImplementationChangeReportApiResponse | undefined
  verifiersApiResponse: VerifiersApiResponse | undefined
}
