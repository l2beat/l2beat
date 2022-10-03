import React from 'react'

export function IncludeLayer2sCheckbox() {
  return (
    <label>
      <input
        data-role="chart-combined"
        id="combined-bridges"
        type="checkbox"
        autoComplete="off"
      />{' '}
      <span>Include Layer2s as bridges</span>
    </label>
  )
}
