import { Project } from '../../model'

export type ReportProject = Pick<Project, 'projectId' | 'type' | 'escrows'>
