import { Project } from '../../../model/Project'

export type ReportProject = Pick<
  Project,
  'projectId' | 'type' | 'escrows' | 'isUpcoming' | 'isLayer3'
>
