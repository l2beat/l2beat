import { v } from '@l2beat/validate'

export const CoolifyProjectSchema = v.object({
  uuid: v.string(),
  name: v.string().optional(),
})

export const CoolifyEnvironmentSchema = v.object({
  id: v.number(),
  name: v.string().optional(),
})

export const CoolifyApplicationSchema = v.object({
  uuid: v.string(),
  name: v.string().optional(),
  environment_id: v.number().optional(),
})

export const CoolifyEnvRowSchema = v.object({
  key: v.string().optional(),
})

const ProjectsListSchema = v.array(CoolifyProjectSchema)
const EnvironmentsListSchema = v.array(CoolifyEnvironmentSchema)
const ApplicationsListSchema = v.array(CoolifyApplicationSchema)
const EnvsListSchema = v.array(CoolifyEnvRowSchema)

export type CoolifyProject = v.infer<typeof CoolifyProjectSchema>
export type CoolifyEnvironment = v.infer<typeof CoolifyEnvironmentSchema>
export type CoolifyApplication = v.infer<typeof CoolifyApplicationSchema>
export type CoolifyEnvRow = v.infer<typeof CoolifyEnvRowSchema>

type CoolifyFetchReason = 'network' | 'bad_status' | 'bad_json'

type CoolifyResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: CoolifyFetchReason }

export type EnvironmentLabelMap = Map<number, { project: string; env: string }>

export class CoolifyClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string,
  ) {}

  async listProjects(): Promise<CoolifyResult<CoolifyProject[]>> {
    const r = await this.fetchJson(this.apiUrl('/projects'))
    if (!r.ok) {
      return r
    }
    const parsed = ProjectsListSchema.safeParse(r.data)
    if (!parsed.success) {
      return { ok: false, reason: 'bad_json' }
    }
    return { ok: true, data: parsed.data }
  }

  async getEnvironments(
    projectUuid: string,
  ): Promise<CoolifyResult<CoolifyEnvironment[]>> {
    const r = await this.fetchJson(
      this.apiUrl(`/projects/${projectUuid}/environments`),
    )
    if (!r.ok) {
      return r
    }
    const parsed = EnvironmentsListSchema.safeParse(r.data)
    if (!parsed.success) {
      return { ok: false, reason: 'bad_json' }
    }
    return { ok: true, data: parsed.data }
  }

  async getApplications(): Promise<CoolifyResult<CoolifyApplication[]>> {
    const r = await this.fetchJson(this.apiUrl('/applications'))
    if (!r.ok) {
      return r
    }
    const parsed = ApplicationsListSchema.safeParse(r.data)
    if (!parsed.success) {
      return { ok: false, reason: 'bad_json' }
    }
    return { ok: true, data: parsed.data }
  }

  async getApplicationEnvs(
    applicationUuid: string,
  ): Promise<CoolifyResult<CoolifyEnvRow[]>> {
    const r = await this.fetchJson(
      this.apiUrl(`/applications/${applicationUuid}/envs`),
    )
    if (!r.ok) {
      return r
    }
    const parsed = EnvsListSchema.safeParse(r.data)
    if (!parsed.success) {
      return { ok: false, reason: 'bad_json' }
    }
    return { ok: true, data: parsed.data }
  }

  async getEnvironmentLabelMap(): Promise<CoolifyResult<EnvironmentLabelMap>> {
    const projectsRes = await this.listProjects()
    if (!projectsRes.ok) {
      return projectsRes
    }

    const byEnvironmentId: EnvironmentLabelMap = new Map()

    await Promise.all(
      projectsRes.data.map(async (project) => {
        const projectName = project.name ? project.name : '?'
        const envRes = await this.getEnvironments(project.uuid)
        if (!envRes.ok) {
          return
        }

        for (const e of envRes.data) {
          const envName = e.name && e.name.length > 0 ? e.name : '?'
          byEnvironmentId.set(e.id, { project: projectName, env: envName })
        }
      }),
    )

    return { ok: true, data: byEnvironmentId }
  }

  private apiUrl(path: string): string {
    const p = path.startsWith('/') ? path : `/${path}`
    return `${this.baseUrl}/api/v1${p}`
  }

  private async fetchJson(url: string): Promise<CoolifyResult<unknown>> {
    const headers = {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/json',
    }

    let res: Response
    try {
      res = await fetch(url, { headers })
    } catch {
      return { ok: false, reason: 'network' }
    }

    if (!res.ok) {
      return { ok: false, reason: 'bad_status' }
    }

    try {
      const data: unknown = await res.json()
      return { ok: true, data }
    } catch {
      return { ok: false, reason: 'bad_json' }
    }
  }
}
