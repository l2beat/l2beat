import { useEffect } from 'react'

export const DAILY_CHECKS_DASHBOARD_URL =
  'https://kibana-v9.l2beat.com/app/dashboards#/view/4405f3b7-898d-45a0-a12b-a2489bacaa19'

export function DailyChecksRedirect() {
  useEffect(() => {
    window.location.replace(DAILY_CHECKS_DASHBOARD_URL)
  }, [])

  return null
}
