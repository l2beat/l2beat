import React from 'react'

import { OutLink } from '../../common'

export function JobPosting() {
  return (
    <article className="JobPosting">
      <header className="JobPosting-Header">
        <h2 className="JobPosting-Title">
          Junior Software Engineer (TypeScript)
        </h2>
        <p className="JobPosting-Location">
          <strong>Poland only</strong> - 100% remote
        </p>
        <OutLink className="JobPosting-Apply" href="mailto:hello@l2beat.com">
          Apply
        </OutLink>
      </header>
      <p className="JobPosting-Disclaimer">
        <em>
          This junior position is only available to people living in Poland. Our
          future senior-level openings will most likely target the global market
          again.
        </em>
      </p>
      <h3>Requirements:</h3>
      <ul>
        <li>A BSc degree completed or in progress,</li>
        <li>An working command of the English language,</li>
        <li>Willingness to learn and grow your skills.</li>
      </ul>
      <h3>Your responsibilities:</h3>
      <ul>
        <li>Implementing integrations with various L2 systems,</li>
        <li>Building APIs and data processing subsystems,</li>
        <li>Adding new functionality to the website.</li>
      </ul>
      <h3>We offer:</h3>
      <ul>
        <li>Mentoring by experienced engineers,</li>
        <li>Help in learning blockchain technologies,</li>
        <li>Paid time off,</li>
        <li>Fully remote work,</li>
        <li>Work on open source projects,</li>
        <li>Frequent pair programming sessions,</li>
        <li>
          A team that applies testing and automation to achieve quality and code
          correctness.
        </li>
      </ul>
      <h3>Tech stack:</h3>
      <ul>
        <li>Typescript,</li>
        <li>Ethers.js,</li>
        <li>Yarn workspaces,</li>
        <li>Koa,</li>
        <li>PostgreSQL,</li>
        <li>React.</li>
      </ul>
      <p>
        If you are interested please apply by sending your CV to{' '}
        <a href="mailto:hello@l2beat.com">hello@l2beat.com</a>.
      </p>
      <footer className="JobPosting-Footer">
        <OutLink className="JobPosting-Apply" href="mailto:hello@l2beat.com">
          Apply
        </OutLink>
      </footer>
    </article>
  )
}
