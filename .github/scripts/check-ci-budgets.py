#!/usr/bin/env python3
"""Fails when a job of this workflow run took longer than its budget.

Budgets live in .github/ci-budgets.json. Each job is checked on two times,
both from its first step, so neither counts the wait for a runner or for
the runner to boot:

- setup: to the end of its setup steps (checkout, dependency install,
  browser install), the steps named in "setupSteps"
- job: to the job's end

A budget only goes down. When a job gets faster, lower its budget to keep
it there; when a change makes it slower on purpose, raise it in that PR so
the reviewers see it.

Run in CI by the "CI budgets" job, with GH_TOKEN, GITHUB_REPOSITORY,
GITHUB_RUN_ID and GITHUB_RUN_ATTEMPT set.
"""

import fnmatch
import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

BUDGETS = Path(__file__).resolve().parents[1] / "ci-budgets.json"


def seconds_between(start, end):
    parse = lambda s: datetime.fromisoformat(s.replace("Z", "+00:00"))
    return (parse(end) - parse(start)).total_seconds()


def gh_jobs(path):
    out = subprocess.run(
        ["gh", "api", "--paginate", path, "--jq", ".jobs[]"],
        check=True,
        capture_output=True,
        text=True,
    ).stdout
    return [json.loads(line) for line in out.splitlines() if line]


def fetch_jobs():
    """The latest execution of each job in this run, across attempts.

    "Re-run failed jobs" makes an attempt that holds only the rerun jobs, and
    the others keep their results from earlier attempts, so a rerun of just
    this check has to read those too.
    """
    repo = os.environ["GITHUB_REPOSITORY"]
    run = os.environ["GITHUB_RUN_ID"]
    attempts = int(os.environ.get("GITHUB_RUN_ATTEMPT", "1"))
    latest = {}
    for attempt in range(1, attempts + 1):
        path = f"repos/{repo}/actions/runs/{run}/attempts/{attempt}/jobs?per_page=100"
        for job in gh_jobs(path):
            latest[job["name"]] = job
    return list(latest.values())


def budget_for(name, budgets):
    for pattern, seconds in budgets.items():
        if fnmatch.fnmatchcase(name, pattern):
            return seconds
    return None


def check(jobs, config):
    over = []
    for job in jobs:
        if job["conclusion"] in ("skipped", "cancelled", None):
            continue
        if not job["started_at"] or not job["completed_at"]:
            continue
        name = job["name"]
        started = [s["started_at"] for s in job["steps"] if s["started_at"]]
        start = min(started) if started else job["started_at"]
        took = seconds_between(start, job["completed_at"])
        steps = [
            s
            for s in job["steps"]
            if s["completed_at"] and s["name"] in config["setupSteps"]
        ]
        setup = (
            max(seconds_between(start, s["completed_at"]) for s in steps)
            if steps
            else 0
        )
        setup_budget = budget_for(name, config["setup"])
        job_budget = budget_for(name, config["job"])
        print(
            f"{name}: setup {setup:.0f}s / {setup_budget}s, "
            f"job {took:.0f}s / {job_budget}s"
        )
        if setup_budget is not None and setup > setup_budget:
            over.append(f"{name}: setup took {setup:.0f}s, budget {setup_budget}s")
        if job_budget is not None and took > job_budget:
            over.append(f"{name}: job took {took:.0f}s, budget {job_budget}s")
    return over


def main():
    config = json.loads(BUDGETS.read_text())
    this_job = os.environ.get("BUDGET_JOB_NAME", "CI budgets")
    jobs = [j for j in fetch_jobs() if j["name"] != this_job]
    over = check(jobs, config)
    for line in over:
        print(f"::error::{line}")
    sys.exit(1 if over else 0)


if __name__ == "__main__":
    main()
