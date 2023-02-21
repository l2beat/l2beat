export function configureArchived() {
  const checkbox = document.querySelector<HTMLInputElement>('#archived-projects')
  const archived = document.querySelectorAll('[data-archived]')

  checkbox?.addEventListener('change', () => {
    archived.forEach((x) => x.classList.toggle('hidden', !checkbox.checked))
  })
}
