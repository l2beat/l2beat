import React from 'react'

export function ShowProjectActivityToggle() {
  return (
    <label>
      <input
        data-role="toggle-tvl-activity"
        id="tvl-activity"
        type="checkbox"
        autoComplete="off"
      />{' '}
      <span>Show activity</span>
    </label>
  )
}
