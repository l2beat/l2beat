import {
  ActivityApiResponse,
  ImplementationChangeReportApiResponse,
  L2CostsApiResponse,
  ManuallyVerifiedContracts,
  ProjectAssetsBreakdownApiResponse,
  TvlApiResponse,
  VerificationStatus,
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
  excludedTokensTvlApiResponse: TvlApiResponse
  activityApiResponse: ActivityApiResponse | undefined
  verificationStatus: VerificationStatus
  manuallyVerifiedContracts: ManuallyVerifiedContracts
  tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse | undefined
  l2CostsApiResponse: L2CostsApiResponse | undefined
  implementationChange: ImplementationChangeReportApiResponse | undefined
}
