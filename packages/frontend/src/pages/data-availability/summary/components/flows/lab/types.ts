import type { ComponentType } from 'react'
import type { LabData } from './model'
import type { LabBatch } from './schedule'

export interface LabVariantProps {
  data: LabData
  /** The day's batches, by time. Made up from hourly totals, see `scheduleBatches` */
  batches: LabBatch[]
  /** Poster picked in the list or on the drawing. The others step back */
  highlighted: string | undefined
  /** Picks a poster, or lets it go when it was picked already */
  onSelect: (posterId: string) => void
}

export interface LabVariant {
  /** Kept in the URL, so a variant can be linked to */
  id: string
  name: string
  /** One sentence on what the drawing shows and how to read it */
  description: string
  /** Takes the whole card. The poster list goes, as the variant is a list itself */
  fullWidth?: boolean
  /** Left out for the hub, which keeps the card it always had */
  Component?: ComponentType<LabVariantProps>
}
