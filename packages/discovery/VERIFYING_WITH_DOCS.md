# Verifying a project with official documentation

Step 4 in the project analysis pipeline. Read this AFTER completing the discovery ([ADDING_NEW_DISCOVERY.md](./ADDING_NEW_DISCOVERY.md)), the frontend project ([ADDING_NEW_FRONTEND_PROJECT.md](./ADDING_NEW_FRONTEND_PROJECT.md)), and the static analysis ([PERFORMING_STATIC_ANALYSIS.md](./PERFORMING_STATIC_ANALYSIS.md)).

## What this step is for

You have a complete discovery, a rendered project page, and a static analysis report. Now read the official documentation to check whether YOU missed anything. The goal is completeness of your own analysis, not finding problems in their docs.

## Mindset

Official documentation may be outdated, imprecise, or optimistic. This is not malicious: protocols iterate faster than their docs, and docs are written for developers and users, not for trust auditors. Treat docs as a lead generation tool, not a source of truth.

The rules:

1. **Onchain is truth.** If the docs say "5-day cooldown" but the contract returns `259200` (3 days), the answer is 3 days. Always verify any specific number, address, threshold, or parameter against the actual contract state before putting it in a template description or the project file.

2. **Assume you are wrong first.** If the docs describe something your discovery doesn't show, the first hypothesis is that your discovery missed it, not that the docs are wrong. Check whether you cut a path that hides it, whether a role holder was excluded by `ignoreRelatives`, or whether a contract is beyond your `maxAddresses` cap.

3. **Don't copy docs into descriptions.** The docs describe how the protocol is INTENDED to work. Your templates describe how it ACTUALLY works onchain. These may differ. Write descriptions from discovered state, not from documentation prose.

4. **Adopt official names, but verify the addresses.** If the docs call a multisig "Protocol Emergency Guardian", use that name in your `config.jsonc` names overrides, but only after verifying the address matches the one you discovered (threshold, member count, roles held).

5. **Note discrepancies factually.** When docs and onchain diverge, document both values in a verification report without assuming which is "correct." The docs might describe a planned state that hasn't been implemented yet, or an old state that was changed onchain.

## What to read

Most protocol documentation has these trust-relevant sections:

| Section | What to look for | How to verify |
|---|---|---|
| Governance / Access control | Role names, multisig names and thresholds, timelocks, delays, who can do what | Cross-reference against access control role members in `discovered.json` |
| Contract addresses / Deployments | Official address book | Compare against your discovered addresses |
| Risk documentation | Acknowledged risks, risk parameters, safety mechanisms | Check if your contracts.risks entries cover the same ground |
| Architecture overview | Contract topology, upgrade paths, emergency mechanisms | Verify against your discovery's template structure |
| Steward / Automation docs | Parameter bounds, cooldowns, who can trigger changes | Query the actual contract state (e.g., `getConfig()`, `MIN_DELAY()`, bound getters) — don't trust the numbers in the docs |

## Recipe

1. **Find the docs index.** Many protocols provide an `llms.txt` or sitemap. Start there.

2. **Read governance and access control pages first.** These are the most trust-relevant. Extract: role names, multisig names, signer counts, timelock durations, guardian descriptions.

3. **Cross-reference every address and number against onchain state.** For every specific claim in the docs ("5/9 multisig", "7-day timelock", "max 50% cap increase"), query the contract directly:
   ```bash
   # Example: verify a threshold
   cast call <safe-address> "getThreshold()(uint256)" --rpc-url $RPC
   
   # Example: verify a steward bound
   cast call <steward-address> "MIN_DELAY()(uint256)" --rpc-url $RPC
   ```

4. **Check for entities your discovery missed.** If the docs mention a contract, role, or multisig that doesn't appear in your discovery:
   - Check if it's behind a cut you made (`ignoreRelatives`, governance seam, etc.)
   - Check if it holds any roles on the access control contracts you already discovered
   - If it's genuinely missing and holds trust-relevant roles, add it to `initialAddresses` and re-discover

5. **Write the verification report.** Create a `DOCS_VERIFICATION_REPORT.md` in the project directory with:
   - **Verified claims**: what the docs say that matches onchain
   - **Discrepancies**: where docs and onchain diverge, with both values
   - **Items we were missing**: anything the docs led us to discover that our analysis hadn't covered
   - **Naming corrections**: official names to adopt in `config.jsonc`
   - **Actions taken**: what was updated as a result

## The verification cycle

For every item you want to add to a template description or the project file based on docs:

```
1. Read the claim in the docs
2. Find the relevant contract in your discovery
3. Query the actual value onchain (cast call, or check discovered.json values)
4. If onchain matches docs: add it, citing the field/value
5. If onchain differs: use the onchain value, note the discrepancy in the report
6. If you can't verify: don't add it
```

Never write "max 50% cap increase" in a template description because the docs said so. Write it only after querying the contract's config getter and confirming the value onchain. If the docs say 50% but the contract returns a different value, use the onchain value.

## Common things docs reveal that you might have missed

- **Multiple executor levels.** Some governance systems have Lvl1 (short timelock) and Lvl2 (long timelock) executors. Check if the second executor holds roles on your discovered access control contracts.
- **Guardian signers by organization.** Docs often name the organizations behind multisig signers (risk providers, security firms, DAO delegates). Useful for the project description.
- **Steward parameter bounds.** Docs describe what bounded-parameter-change contracts can do. Verify the actual bounds onchain; they frequently differ from what the docs say.
- **Emergency procedures.** Docs may describe emergency pause/freeze mechanisms with specific multisig thresholds that you should verify against your discovery.
- **Permissions books / registries.** Some protocols maintain a separate repository documenting per-function permissions. These may not be updated for the latest version.

## What NOT to do

- Don't rewrite your template descriptions to match docs prose. Your descriptions should reflect onchain reality.
- Don't add claims from docs without onchain verification. "The docs say there's a 7-day timelock" is not a valid reason to write "7-day timelock" in a template.
- Don't assume docs are wrong when they disagree with your discovery. Check your discovery first: did you cut a path? Is a contract beyond the cap? Is a role extraction missing?
- Don't spend time auditing the docs for inaccuracies. Note discrepancies factually in the report and move on. The priority is your analysis completeness, not their documentation quality.
