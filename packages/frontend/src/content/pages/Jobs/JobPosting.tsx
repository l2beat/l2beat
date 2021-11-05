import React from 'react'

import { OutLink } from '../../common'

export function JobPosting() {
  return (
    <article className="JobPosting">
      <header className="JobPosting-Header">
        <h2 className="JobPosting-Title">Software Engineer (TypeScript)</h2>
        <p className="JobPosting-Location">100% remote</p>
        <OutLink className="JobPosting-Apply" href="mailto:hello@l2beat.com">
          Apply
        </OutLink>
      </header>
      <h3>Your responsibilities:</h3>
      <ul>
        <li>Building backend data gathering and processing pipelines,</li>
        <li>
          Researching and implementing integrations with various L2 systems,
        </li>
        <li>Building public APIs for consuming the processed data.</li>
      </ul>
      <h3>We offer:</h3>
      <ul>
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
        <li>PostgreSQL.</li>
      </ul>
      <h3>Nice to have:</h3>
      <ul>
        <li>Experience with Ethereum and Solidity,</li>
        <li>Working knowledge of python.</li>
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
