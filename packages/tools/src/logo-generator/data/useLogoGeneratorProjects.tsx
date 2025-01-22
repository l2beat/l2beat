import { useQuery } from '@tanstack/react-query'
import { LogoGeneratorProject } from './LogoGeneratorProject'

export function useLogoGeneratorProjects() {
  return useQuery({
    queryKey: ['logo-generator'],
    queryFn: fetchLogoGeneratorProjects,
  })
}

async function fetchLogoGeneratorProjects() {
  const req = await fetch('http://localhost:3000/api/logo-generator')

  const result = await req.json()
  const parsed = LogoGeneratorProject.array().parse(result)
  return parsed
}
