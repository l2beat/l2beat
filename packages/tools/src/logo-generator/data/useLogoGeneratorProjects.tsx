import { v } from '@l2beat/validate'
import { useQuery } from '@tanstack/react-query'
import { LogoGeneratorProject } from './LogoGeneratorProject'

export function useLogoGeneratorProjects() {
  return useQuery({
    queryKey: ['logo-generator'],
    queryFn: fetchLogoGeneratorProjects,
  })
}

async function fetchLogoGeneratorProjects() {
  const req = await fetch('https://fe-staging.l2beat.com/api/logo-generator')

  const result = await req.json()
  const parsed = v.array(LogoGeneratorProject).parse(result)
  return parsed
}
