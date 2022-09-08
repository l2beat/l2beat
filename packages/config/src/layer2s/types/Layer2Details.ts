import { Layer2Links } from './Layer2Links'
import { Layer2RiskView } from './Layer2RiskView'
import { Layer2Technology } from './Layer2Technology'
import { News } from './News'

export interface Layer2Details {
  /** A warning displayed at the top of the layer2 page */
  warning?: string
  /** A few sentences describing the layer2 */
  description: string
  /** A short (<20 characters) description of the use case */
  purpose: string
  /** List of links */
  links: Layer2Links
  /** Technology provider */
  provider?: 'StarkEx' | 'Optimism' | 'zkSync'
  /** Deep dive into layer2 technology */
  technology: Layer2Technology
  /** Risk view values for this layer2 */
  riskView: Layer2RiskView
  /** Links to recent developments */
  news: News[]
}
