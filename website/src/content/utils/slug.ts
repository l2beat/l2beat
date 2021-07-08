export function slug(name: string) {
  return name.toLowerCase().replace(/[\s.]/g, '-')
}
