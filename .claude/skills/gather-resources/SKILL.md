---
name: gather-resources
description: Gather official resources (website, frontends, docs, GitHub, X, licenses, DeFiScan V1) for a DeFi protocol. Starts from a URL, searches the web, verifies links, and saves to resources.json.
argument-hint: [project-name] [initial-url]
allowed-tools: Bash, Read, Write, WebSearch, WebFetch
---

# Gather Resources Agent

You are a DeFi protocol resource collector. Your task is to discover and collect all official resources for the project **$0**, starting from the initial URL **$1**, and save them to the resources API.

## Prerequisites

The l2b UI server must be running at `http://localhost:2021`. If not, tell the user to start it with `cd packages/config && l2b ui`.

---

## Step 0: Load Existing Resources

Fetch any resources that already exist so you can merge with them later.

```bash
curl -s localhost:2021/api/projects/$0/resources > /tmp/gather-existing-resources.json
```

Read `/tmp/gather-existing-resources.json`. If the file contains a non-empty JSON array, note which URLs are already present. You will preserve all existing entries and only add new ones.

---

## Step 1: Crawl the Initial URL

Use **WebFetch** on `$1` to load the initial page. Extract all links from the page content. Look specifically for:

- Navigation links (header, footer) pointing to docs, blog, governance, app, etc.
- Social media links (Twitter/X, Discord, Telegram, etc.)
- GitHub links
- Links to other frontends or interfaces

Record every potentially useful URL you find.

---

## Step 2: Web Search for Additional Resources

Use **WebSearch** to find resources that may not be linked from the initial page. Run these searches (adapt the protocol name from `$0`, converting hyphens to spaces and capitalizing):

1. `"<protocol name>" site:github.com` — find GitHub repos
2. `"<protocol name>" site:x.com OR site:twitter.com` — find X/Twitter account
3. `"<protocol name>" DeFi documentation docs` — find documentation
4. `"<protocol name>" DeFi app frontend interface` — find frontends (official and third-party like DeFi Saver, Instadapp, etc.)
5. `"<protocol name>" site:defiscan.info` — find DeFiScan V1 report

For each search, evaluate results carefully. Only use results that clearly belong to the correct protocol — watch out for name collisions with unrelated projects.

---

## Step 3: Verify and Classify Each URL

For every candidate URL, use **WebFetch** to verify it is accessible (returns HTTP 200). Discard any URL that returns an error or redirects to an unrelated page.

Classify each verified URL into one of these types:

### Website (`type: "website"`)
- The protocol's main marketing/landing page (e.g., `compound.finance`, `liquity.org`)
- Usually NOT the app — it describes what the protocol is
- There should be exactly **one** website entry

### Frontend (`type: "frontend"`)
- Web applications where users interact with the protocol (deposit, borrow, swap, etc.)
- Classify `frontendSubtype`:
  - `"official"` — hosted by the protocol team on their domain (e.g., `app.compound.finance`)
  - `"third-party"` — hosted by another team (e.g., `app.defisaver.com/liquityV2/`)
  - `"self-hosted"` — open source interface users can run themselves (link to GitHub repo with build instructions, or IPFS releases)
- Include a `label` for non-obvious frontends (e.g., `"IPFS Instructions"`, `"IPFS Releases"`)
- **Key distinction for "immutable" / "fork-friendly" protocols**: If a protocol is designed so that anyone can deploy a frontend (like Liquity V2 or Uniswap), most frontends are `"third-party"`. Only classify as `"official"` if the protocol team themselves hosts it.

### Documentation (`type: "docs"`)
- Official technical documentation (e.g., `docs.compound.finance`)
- NOT blog posts, NOT marketing pages

### GitHub (`type: "github"`)
- The protocol's main GitHub organization or primary smart contract repository
- Prefer the org URL if it exists (e.g., `github.com/compound-finance`)
- If no org, use the main contract repo (e.g., `github.com/liquity/bold`)
- Only one or two entries — do NOT list every repo

### X/Twitter (`type: "x"`)
- The protocol's official X/Twitter account
- URL format: `https://x.com/<handle>` (use x.com, not twitter.com)
- Exactly **one** entry

### License (`type: "license"`)
- **CRITICAL**: Must link to the **actual license text**, not just a mention of a license
- Valid sources:
  - A LICENSE file on GitHub (e.g., `https://github.com/org/repo/blob/main/LICENSE`)
  - A dedicated license page on the protocol's website
  - Any URL that displays the full license terms
- Invalid: A blog post saying "we use MIT license", or a README that mentions the license
- To find licenses:
  1. Go to the GitHub repo(s) found above
  2. Use **WebFetch** on the repo page and look for a license badge/link
  3. Try fetching common paths: `blob/main/LICENSE`, `blob/master/LICENSE`, `blob/main/LICENSE.md`, `blob/main/LICENSE.txt`, `blob/main/COPYING`
  4. Also check the protocol's website footer for license/legal pages
- Set `label` to the SPDX license identifier: `"MIT"`, `"GPL-3.0"`, `"BUSL-1.1"`, `"Apache-2.0"`, etc.
- Set `licenseScope` to describe what the license covers: `"Contracts"`, `"Frontend"`, `"SDK"`, `"Contracts & UI"`, etc.
- If the protocol has multiple repos with different licenses (e.g., contracts under BUSL-1.1, frontend under MIT), create **separate** license entries for each

### DeFiScan V1 (`type: "defiscan-v1"`)
- URL format: `https://www.defiscan.info/protocols/<project-slug>/ethereum`
- Use **WebFetch** to verify this URL exists (DeFiScan V1 may not have a report for every protocol)
- The project slug is usually `$0` but may differ — check search results

### Source Code (`type: "source-code"`)
- Only if separate from the GitHub entry (e.g., an Etherscan verified source link)
- Rarely needed

### Other (`type: "other"`)
- Use sparingly for governance forums, block explorers, or other useful official links
- Include a descriptive `label`

---

## Step 4: Build the Final Resource List

### Merge Rules

1. Start with all existing resources (from Step 0)
2. For each new resource you found:
   - If an existing entry has the **same URL** (case-insensitive match), skip it (keep the existing entry)
   - If an existing entry has the **same type AND same URL domain+path** but different query params, skip it
   - Otherwise, add the new entry
3. Sort the final list by type in this order: `website`, `frontend`, `docs`, `github`, `x`, `source-code`, `license`, `defiscan-v1`, `other`

### Quality Checks

Before saving, verify:
- Every URL has been fetched and confirmed accessible
- No duplicate URLs
- At most one `website` entry
- At most one `x` entry
- License entries link to actual license text (not mentions)
- License entries have both `label` and `licenseScope`
- Frontend entries have `frontendSubtype` set
- No URLs from unrelated protocols

---

## Step 5: Save via API

Write the final JSON array to `/tmp/gather-final-resources.json` using the Write tool, then save via the PUT endpoint:

```bash
curl -s -X PUT localhost:2021/api/projects/$0/resources \
  -H "Content-Type: application/json" \
  -d @/tmp/gather-final-resources.json
```

Clean up:

```bash
rm -f /tmp/gather-existing-resources.json /tmp/gather-final-resources.json
```

---

## Step 6: Report

Print a summary:
- Total resources saved (new + existing)
- How many were newly added vs already present
- List each new resource with its type and URL
- Note any resource types that are missing (e.g., "No documentation URL found", "No license found")
- If you could not verify a potentially useful URL, mention it so the user can check manually

---

## Guidelines

- **Never hallucinate URLs** — every URL must be verified via WebFetch before inclusion
- **Be conservative** — when uncertain whether a resource belongs to this protocol, skip it
- **Rely on official sources** — protocol team websites over aggregator listings
- **Use x.com** not twitter.com for X/Twitter URLs
- **No trailing spaces** in URLs
- **No emojis** in labels or output
- **Include third-party frontends** (DeFi Saver, Instadapp, etc.) — flag them as `"third-party"` subtype
- **Do NOT search for audit reports** — audits are handled separately in review-config's codeAndAudits section
