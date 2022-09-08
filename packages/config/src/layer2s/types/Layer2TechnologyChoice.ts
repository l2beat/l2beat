import { Layer2Reference } from './Layer2Reference'
import { Layer2Risk } from './Layer2Risk'

export interface Layer2TechnologyChoice {
  /** Name of the specific technology choice */
  name: string
  /** Description of the specific technology choice. Null means missing information */
  description: string
  /** List of references backing up the claim */
  references: Layer2Reference[]
  /** List of risks associated with the technology choice */
  risks: Layer2Risk[]
  /** The description and research is incomplete */
  isIncomplete?: boolean
}
