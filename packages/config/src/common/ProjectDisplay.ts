import { ProjectCategory } from './ProjectCategory'
import { ProjectDataAvailabilityMode } from './ProjectDataAvailabilityMode'
import { ProjectLinks } from './ProjectLinks'

export interface ProjectDisplay {
  /** Name of the layer2/3, will be used as a display name on the website */
  name: string
  /** Short name of the layer2/3, will be used in some places on the website as a display name */
  shortName?: string
  /** Url friendly layer2/3 name, will be used in website urls */
  slug: string
  /** Name of the category the layer2/3 belongs to */
  category: ProjectCategory
  /** Data availability mode of layer2/3 project */
  dataAvailabilityMode: ProjectDataAvailabilityMode
  /** A warning displayed in the header of the project */
  headerWarning?:
    | {
        /** Warning text */
        text: string
        /** Link to the warning source */
        href: string
      }
    | string
  /** A warning displayed above the description of the project */
  warning?: string
  /** Project raw with red warning will turn into red, and there will be red warning icon with this message */
  redWarning?: string
  /** A few sentences describing the layer2/3 */
  description: string
  /** A short (<20 characters) description of the use case */
  purpose: string
  /** List of links */
  links: ProjectLinks
  /** Where does the activity data come from? */
  activityDataSource?: 'Blockchain RPC' | 'Explorer API' | 'Closed API'
}
