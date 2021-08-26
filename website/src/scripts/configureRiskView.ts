import { UrlState } from './urlState'

export function configureRiskView() {
  const buttons = Array.from(document.querySelectorAll('.Projects-Button'))
  const views = [
    document.querySelector('.FinancialView'),
    document.querySelector('.RiskView'),
  ]

  buttons[0]?.addEventListener('click', () => {
    UrlState.set('view', undefined)
    toggleRiskView(false)
  })
  buttons[1]?.addEventListener('click', () => {
    UrlState.set('view', 'risk')
    toggleRiskView(true)
  })

  UrlState.onInit(() => {
    toggleRiskView(UrlState.get('view') === 'risk')
  })

  function toggleRiskView(show: boolean) {
    buttons[show ? 0 : 1].classList.remove('active')
    buttons[show ? 1 : 0].classList.add('active')

    views[show ? 0 : 1]?.classList.remove('active')
    views[show ? 1 : 0]?.classList.add('active')
  }
}
