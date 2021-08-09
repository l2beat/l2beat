export function configureRiskView() {
  const buttons = Array.from(document.querySelectorAll('.Projects-Button'))
  const financialView = document.querySelector('.FinancialView')
  const riskView = document.querySelector('.RiskView')
  const views = [financialView, riskView]

  for (const button of buttons) {
    button.addEventListener('click', () => {
      buttons.forEach((x) => x.classList.remove('active'))
      button.classList.add('active')

      views.forEach((x) => x?.classList.remove('active'))
      if (button.classList.contains('left')) {
        financialView?.classList.add('active')
      } else if (button.classList.contains('right')) {
        riskView?.classList.add('active')
      }
    })
  }
}
