'use client'
import { useEffect } from 'react'
import { initRum } from './elastic'

export function RealUserMonitoring() {
  useEffect(() => {
    initRum()
  }, [])
  return null
}
