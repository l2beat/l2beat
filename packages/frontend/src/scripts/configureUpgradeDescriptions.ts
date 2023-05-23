export function configureUpgradeDescriptions() {
  const buttons = document.querySelectorAll(
    '[data-component="upgrade-description-button"]',
  )

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.toggle('hidden')
      button.nextElementSibling?.classList.toggle('hidden')
    })
  })
}
