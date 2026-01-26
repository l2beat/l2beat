#!/usr/bin/env node
/**
 * Generate HTML Visualizations
 *
 * Reads all analysis JSON files from /analysis folder and generates
 * HTML visualizations based on the Name category framework.
 *
 * Usage:
 *   npx ts-node scripts/escrowAnalysis/generateHtml.ts
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { EscrowReport } from './chains/types'

const ANALYSIS_DIR = join(__dirname, 'analysis')

function formatUsd(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
  return `$${value.toFixed(2)}`
}

function generateHtml(reports: EscrowReport[]): string {
  const totalTvl = reports.reduce((sum, r) => sum + r.summary.totalTvl, 0)
  const totalNative = reports.reduce((sum, r) => sum + r.summary.nativeTvl, 0)

  // Aggregate by Name category
  const totalCanonicalTrustMin = reports.reduce((sum, r) => sum + r.summary.byNameCategory.canonicalTrustMinimized, 0)
  const totalCanonicalAddTrust = reports.reduce((sum, r) => sum + r.summary.byNameCategory.canonicalAdditionalTrust, 0)
  const totalExternal = reports.reduce((sum, r) => sum + r.summary.byNameCategory.external, 0)
  const totalExternalIssuer = reports.reduce((sum, r) => sum + r.summary.externalBreakdown.issuerSecured, 0)
  const totalExternalAddTrust = reports.reduce((sum, r) => sum + r.summary.externalBreakdown.additionalTrust, 0)

  // Trust summary
  const noAddTrustTotal = totalCanonicalTrustMin + totalExternalIssuer + totalNative
  const addTrustTotal = totalCanonicalAddTrust + totalExternalAddTrust

  const chainRows = reports
    .sort((a, b) => b.summary.totalTvl - a.summary.totalTvl)
    .map(r => {
      const s = r.summary
      const noAddTrust = s.byNameCategory.canonicalTrustMinimized + s.externalBreakdown.issuerSecured + s.nativeTvl
      const addTrust = s.byNameCategory.canonicalAdditionalTrust + s.externalBreakdown.additionalTrust

      return `
      <tr>
        <td class="clickable" onclick="showChainDetail('${r.projectId}')">${r.projectId}</td>
        <td class="clickable" onclick="showChainDetail('${r.projectId}')">${formatUsd(s.totalTvl)}</td>
        <td class="canonical-min clickable" onclick="showCategoryDetail('${r.projectId}', 'canonical-trust-minimized')">${formatUsd(s.byNameCategory.canonicalTrustMinimized)}</td>
        <td class="canonical-add clickable" onclick="showCategoryDetail('${r.projectId}', 'canonical-additional-trust')">${formatUsd(s.byNameCategory.canonicalAdditionalTrust)}</td>
        <td class="external clickable" onclick="showCategoryDetail('${r.projectId}', 'external')">${formatUsd(s.byNameCategory.external)}</td>
        <td class="native separator">${formatUsd(s.nativeTvl)}</td>
        <td class="no-trust">${formatUsd(noAddTrust)}</td>
        <td class="add-trust">${formatUsd(addTrust)}</td>
      </tr>
    `}).join('')

  const escrowsJson = JSON.stringify(reports.flatMap(r =>
    r.escrows.map(e => ({ ...e, chain: r.projectId }))
  ))

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Escrow Analysis Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0d1117;
      color: #c9d1d9;
      padding: 24px;
    }
    h1 { color: #58a6ff; margin-bottom: 8px; }
    h2 { color: #8b949e; margin: 24px 0 16px; font-size: 14px; text-transform: uppercase; }
    .subtitle { color: #8b949e; font-size: 13px; margin-bottom: 24px; }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .summary-card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 16px;
    }
    .summary-card .label { color: #8b949e; font-size: 12px; margin-bottom: 4px; }
    .summary-card .value { font-size: 24px; font-weight: 600; }
    .summary-card .pct { color: #8b949e; font-size: 12px; margin-top: 4px; }
    .summary-card.canonical-min .value { color: #3fb950; }
    .summary-card.canonical-add .value { color: #f85149; }
    .summary-card.external .value { color: #f0883e; }
    .summary-card.native .value { color: #58a6ff; }

    .trust-summary {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .trust-card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 20px;
    }
    .trust-card .label { font-size: 14px; margin-bottom: 8px; }
    .trust-card .value { font-size: 28px; font-weight: 600; }
    .trust-card .pct { color: #8b949e; font-size: 14px; margin-top: 4px; }
    .trust-card.no-trust { border-left: 4px solid #3fb950; }
    .trust-card.no-trust .value { color: #3fb950; }
    .trust-card.add-trust { border-left: 4px solid #f85149; }
    .trust-card.add-trust .value { color: #f85149; }
    .trust-card .breakdown { margin-top: 12px; font-size: 12px; color: #8b949e; }
    .trust-card .breakdown-item { margin-top: 4px; }

    table {
      width: 100%;
      border-collapse: collapse;
      background: #161b22;
      border-radius: 8px;
      overflow: hidden;
    }
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #30363d;
    }
    th {
      background: #21262d;
      color: #8b949e;
      font-size: 12px;
      text-transform: uppercase;
    }
    tr:hover { background: #21262d; }
    td.clickable { cursor: pointer; }
    td.clickable:hover { text-decoration: underline; }
    td.separator, th.separator { border-right: 2px solid #30363d; }
    .canonical-min { color: #3fb950; }
    .canonical-add { color: #f85149; }
    .external { color: #f0883e; }
    .native { color: #58a6ff; }
    .no-trust { color: #3fb950; }
    .add-trust { color: #f85149; }

    .modal {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.8);
      z-index: 1000;
      overflow-y: auto;
    }
    .modal.active { display: flex; justify-content: center; padding: 40px; }
    .modal-content {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 12px;
      padding: 24px;
      max-width: 1200px;
      width: 100%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
    }
    #modal-body {
      overflow-y: auto;
      flex: 1;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .modal-close {
      background: none;
      border: none;
      color: #8b949e;
      font-size: 24px;
      cursor: pointer;
    }
    .escrow-card {
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .escrow-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .escrow-name { font-weight: 600; }
    .escrow-value { color: #3fb950; }
    .escrow-category {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-top: 4px;
    }
    .escrow-category.canonical-trust-minimized { background: rgba(63,185,80,0.2); color: #3fb950; }
    .escrow-category.canonical-additional-trust { background: rgba(248,81,73,0.2); color: #f85149; }
    .escrow-category.external { background: rgba(240,136,62,0.2); color: #f0883e; }
    .escrow-tokens {
      margin-top: 12px;
      font-size: 13px;
      color: #8b949e;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      margin-left: 8px;
    }
    .badge.no-trust { background: rgba(63,185,80,0.2); color: #3fb950; }
    .badge.add-trust { background: rgba(248,81,73,0.2); color: #f85149; }
  </style>
</head>
<body>
  <h1>Escrow Analysis Dashboard</h1>
  <p class="subtitle">Classification based on trust assumptions beyond holding the token</p>

  <h2>Trust Summary (All Chains)</h2>
  <div class="trust-summary">
    <div class="trust-card no-trust">
      <div class="label">No Additional Trust Required</div>
      <div class="value">${formatUsd(noAddTrustTotal)}</div>
      <div class="pct">${((noAddTrustTotal / totalTvl) * 100).toFixed(1)}% of total TVL</div>
      <div class="breakdown">
        <div class="breakdown-item">Canonical (trust-minimized): ${formatUsd(totalCanonicalTrustMin)}</div>
        <div class="breakdown-item">External (issuer-secured): ${formatUsd(totalExternalIssuer)}</div>
        <div class="breakdown-item">Native: ${formatUsd(totalNative)}</div>
      </div>
    </div>
    <div class="trust-card add-trust">
      <div class="label">Additional Trust Required</div>
      <div class="value">${formatUsd(addTrustTotal)}</div>
      <div class="pct">${((addTrustTotal / totalTvl) * 100).toFixed(1)}% of total TVL</div>
      <div class="breakdown">
        <div class="breakdown-item">Canonical (third-party): ${formatUsd(totalCanonicalAddTrust)}</div>
        <div class="breakdown-item">External (validators): ${formatUsd(totalExternalAddTrust)}</div>
      </div>
    </div>
  </div>

  <h2>Name Categories (All Chains)</h2>
  <div class="summary-grid">
    <div class="summary-card canonical-min">
      <div class="label">Canonical (trust-minimized)</div>
      <div class="value">${formatUsd(totalCanonicalTrustMin)}</div>
      <div class="pct">${((totalCanonicalTrustMin / totalTvl) * 100).toFixed(1)}%</div>
    </div>
    <div class="summary-card canonical-add">
      <div class="label">Canonical (additional trust)</div>
      <div class="value">${formatUsd(totalCanonicalAddTrust)}</div>
      <div class="pct">${((totalCanonicalAddTrust / totalTvl) * 100).toFixed(1)}%</div>
    </div>
    <div class="summary-card external">
      <div class="label">External</div>
      <div class="value">${formatUsd(totalExternal)}</div>
      <div class="pct">${((totalExternal / totalTvl) * 100).toFixed(1)}% (issuer: ${formatUsd(totalExternalIssuer)}, other: ${formatUsd(totalExternalAddTrust)})</div>
    </div>
    <div class="summary-card native">
      <div class="label">Native</div>
      <div class="value">${formatUsd(totalNative)}</div>
      <div class="pct">${((totalNative / totalTvl) * 100).toFixed(1)}%</div>
    </div>
  </div>

  <h2>Chains (${reports.length})</h2>
  <table>
    <thead>
      <tr>
        <th rowspan="2">Chain</th>
        <th rowspan="2">Total TVL</th>
        <th colspan="4" class="separator" style="text-align: center; color: #58a6ff;">Name Category</th>
        <th colspan="2" style="text-align: center; color: #a371f7;">Trust Summary</th>
      </tr>
      <tr>
        <th class="canonical-min">Canonical (min)</th>
        <th class="canonical-add">Canonical (add)</th>
        <th class="external">External</th>
        <th class="native separator">Native</th>
        <th class="no-trust">No Add. Trust</th>
        <th class="add-trust">Add. Trust</th>
      </tr>
    </thead>
    <tbody>
      ${chainRows}
    </tbody>
  </table>

  <div id="modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modal-title">Chain Details</h2>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div id="modal-body"></div>
    </div>
  </div>

  <script>
    const escrows = ${escrowsJson};
    const reports = ${JSON.stringify(reports)};

    function formatUsd(value) {
      if (value >= 1e9) return '$' + (value / 1e9).toFixed(2) + 'B';
      if (value >= 1e6) return '$' + (value / 1e6).toFixed(2) + 'M';
      if (value >= 1e3) return '$' + (value / 1e3).toFixed(2) + 'K';
      return '$' + value.toFixed(2);
    }

    function showChainDetail(chainId) {
      const report = reports.find(r => r.projectId === chainId);
      if (!report) return;

      document.getElementById('modal-title').textContent = chainId + ' - All Assets';

      // Summary cards
      const s = report.summary;
      const noAddTrust = s.byNameCategory.canonicalTrustMinimized + s.externalBreakdown.issuerSecured + s.nativeTvl;
      const addTrust = s.byNameCategory.canonicalAdditionalTrust + s.externalBreakdown.additionalTrust;

      let html = \`
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
          <div style="background: #21262d; padding: 12px; border-radius: 8px; border-left: 3px solid #3fb950;">
            <div style="color: #8b949e; font-size: 11px;">Canonical (trust-min)</div>
            <div style="color: #3fb950; font-size: 18px; font-weight: 600;">\${formatUsd(s.byNameCategory.canonicalTrustMinimized)}</div>
          </div>
          <div style="background: #21262d; padding: 12px; border-radius: 8px; border-left: 3px solid #f85149;">
            <div style="color: #8b949e; font-size: 11px;">Canonical (add. trust)</div>
            <div style="color: #f85149; font-size: 18px; font-weight: 600;">\${formatUsd(s.byNameCategory.canonicalAdditionalTrust)}</div>
          </div>
          <div style="background: #21262d; padding: 12px; border-radius: 8px; border-left: 3px solid #f0883e;">
            <div style="color: #8b949e; font-size: 11px;">External</div>
            <div style="color: #f0883e; font-size: 18px; font-weight: 600;">\${formatUsd(s.byNameCategory.external)}</div>
          </div>
          <div style="background: #21262d; padding: 12px; border-radius: 8px; border-left: 3px solid #58a6ff;">
            <div style="color: #8b949e; font-size: 11px;">Native</div>
            <div style="color: #58a6ff; font-size: 18px; font-weight: 600;">\${formatUsd(s.nativeTvl)}</div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
          <div style="background: #21262d; padding: 16px; border-radius: 8px; border-left: 4px solid #3fb950;">
            <div style="color: #8b949e; font-size: 12px;">No Additional Trust</div>
            <div style="color: #3fb950; font-size: 24px; font-weight: 600;">\${formatUsd(noAddTrust)}</div>
            <div style="color: #8b949e; font-size: 11px;">\${((noAddTrust / s.totalTvl) * 100).toFixed(1)}%</div>
          </div>
          <div style="background: #21262d; padding: 16px; border-radius: 8px; border-left: 4px solid #f85149;">
            <div style="color: #8b949e; font-size: 12px;">Additional Trust Required</div>
            <div style="color: #f85149; font-size: 24px; font-weight: 600;">\${formatUsd(addTrust)}</div>
            <div style="color: #8b949e; font-size: 11px;">\${((addTrust / s.totalTvl) * 100).toFixed(1)}%</div>
          </div>
        </div>
      \`;

      // Escrows section
      html += '<h3 style="color: #8b949e; margin-bottom: 12px;">Escrows (L1 locked)</h3>';
      html += report.escrows
        .sort((a, b) => b.totalValueUsd - a.totalValueUsd)
        .map(e => \`
          <div class="escrow-card">
            <div class="escrow-header">
              <span class="escrow-name">\${e.name}</span>
              <span class="escrow-value">\${formatUsd(e.totalValueUsd)}</span>
            </div>
            <div>
              <span class="escrow-category \${e.nameCategory}">\${e.nameCategory.replace(/-/g, ' ')}</span>
              <span class="badge \${e.additionalTrust ? 'add-trust' : 'no-trust'}">\${e.additionalTrust ? 'Additional Trust' : 'No Add. Trust'}</span>
            </div>
            <div style="color: #8b949e; font-size: 11px; margin-top: 4px;">\${e.categoryReason}</div>
            <div class="escrow-tokens">
              \${e.tokens.slice(0, 5).map(t => t.symbol + ': ' + formatUsd(t.valueUsd)).join(' | ')}
              \${e.tokens.length > 5 ? ' | +' + (e.tokens.length - 5) + ' more' : ''}
            </div>
          </div>
        \`).join('');

      // External tokens section
      if (report.externalTokens && report.externalTokens.length > 0) {
        html += '<h3 style="color: #8b949e; margin: 24px 0 12px;">External Tokens (No L1 Escrow)</h3>';
        html += report.externalTokens
          .sort((a, b) => b.valueUsd - a.valueUsd)
          .map(t => \`
            <div class="escrow-card">
              <div class="escrow-header">
                <span class="escrow-name">\${t.symbol}</span>
                <span class="escrow-value">\${formatUsd(t.valueUsd)}</span>
              </div>
              <div>
                <span class="escrow-category external">external</span>
                <span class="badge \${t.additionalTrust ? 'add-trust' : 'no-trust'}">\${t.additionalTrust ? 'Additional Trust' : 'No Add. Trust'}</span>
                <span style="color: #8b949e; margin-left: 8px; font-size: 12px;">\${t.bridgeProtocol}</span>
              </div>
              <div style="color: #8b949e; font-size: 11px; margin-top: 4px;">\${t.categoryReason}</div>
            </div>
          \`).join('');
      }

      document.getElementById('modal-body').innerHTML = html;
      document.getElementById('modal').classList.add('active');
    }

    function showCategoryDetail(chainId, category) {
      const report = reports.find(r => r.projectId === chainId);
      if (!report) return;

      const categoryNames = {
        'canonical-trust-minimized': 'Canonical (trust-minimized)',
        'canonical-additional-trust': 'Canonical (additional trust)',
        'external': 'External'
      };

      document.getElementById('modal-title').textContent = chainId + ' - ' + categoryNames[category];

      // Get escrows for this category
      const escrows = report.escrows
        .filter(e => e.nameCategory === category)
        .filter(e => e.totalValueUsd > 1000)
        .sort((a, b) => b.totalValueUsd - a.totalValueUsd);

      // Get external tokens for this category
      const externalTokens = (report.externalTokens || [])
        .filter(t => t.nameCategory === category)
        .filter(t => t.valueUsd > 1000)
        .sort((a, b) => b.valueUsd - a.valueUsd);

      const escrowTotal = escrows.reduce((sum, e) => sum + e.totalValueUsd, 0);
      const tokenTotal = externalTokens.reduce((sum, t) => sum + t.valueUsd, 0);

      let html = '';

      // For external, show breakdown by trust
      if (category === 'external') {
        const issuerSecured = escrows.filter(e => !e.additionalTrust).reduce((sum, e) => sum + e.totalValueUsd, 0) +
          externalTokens.filter(t => !t.additionalTrust).reduce((sum, t) => sum + t.valueUsd, 0);
        const addTrust = escrows.filter(e => e.additionalTrust).reduce((sum, e) => sum + e.totalValueUsd, 0) +
          externalTokens.filter(t => t.additionalTrust).reduce((sum, t) => sum + t.valueUsd, 0);

        html += \`
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div style="background: #21262d; border-radius: 8px; padding: 16px; border-left: 4px solid #3fb950;">
              <div style="color: #8b949e; font-size: 12px;">Issuer-Secured (no add. trust)</div>
              <div style="font-size: 20px; font-weight: 600; color: #3fb950;">\${formatUsd(issuerSecured)}</div>
            </div>
            <div style="background: #21262d; border-radius: 8px; padding: 16px; border-left: 4px solid #f85149;">
              <div style="color: #8b949e; font-size: 12px;">Additional Trust Required</div>
              <div style="font-size: 20px; font-weight: 600; color: #f85149;">\${formatUsd(addTrust)}</div>
            </div>
          </div>
        \`;
      }

      if (escrows.length > 0) {
        html += \`
          <h3 style="color: #8b949e; margin-bottom: 12px;">Escrows (L1 Locked)</h3>
          <table style="width: 100%; margin-bottom: 24px;">
            <thead>
              <tr>
                <th style="text-align: left;">Escrow</th>
                <th style="text-align: right;">TVL</th>
                <th style="text-align: left;">Security</th>
                <th style="text-align: left;">Trust</th>
              </tr>
            </thead>
            <tbody>
              \${escrows.map(e => \`
                <tr>
                  <td>\${e.name} \${e.adminName ? '(' + e.adminName + ')' : ''}</td>
                  <td style="text-align: right;">\${formatUsd(e.totalValueUsd)}</td>
                  <td>\${e.category}</td>
                  <td class="\${e.additionalTrust ? 'add-trust' : 'no-trust'}">\${e.additionalTrust ? 'Additional' : 'None'}</td>
                </tr>
              \`).join('')}
              <tr style="border-top: 2px solid #30363d; font-weight: 600;">
                <td>Subtotal</td>
                <td style="text-align: right;">\${formatUsd(escrowTotal)}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        \`;
      }

      if (externalTokens.length > 0) {
        html += \`
          <h3 style="color: #8b949e; margin-bottom: 12px;">External Tokens (No Escrow)</h3>
          <table style="width: 100%;">
            <thead>
              <tr>
                <th style="text-align: left;">Token</th>
                <th style="text-align: right;">TVL</th>
                <th style="text-align: left;">Bridge</th>
                <th style="text-align: left;">Trust</th>
              </tr>
            </thead>
            <tbody>
              \${externalTokens.map(t => \`
                <tr>
                  <td>\${t.symbol}</td>
                  <td style="text-align: right;">\${formatUsd(t.valueUsd)}</td>
                  <td>\${t.bridgeProtocol}</td>
                  <td class="\${t.additionalTrust ? 'add-trust' : 'no-trust'}">\${t.additionalTrust ? 'Additional' : 'None'}</td>
                </tr>
              \`).join('')}
              <tr style="border-top: 2px solid #30363d; font-weight: 600;">
                <td>Subtotal</td>
                <td style="text-align: right;">\${formatUsd(tokenTotal)}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        \`;
      }

      if (escrows.length === 0 && externalTokens.length === 0) {
        html = '<p style="color: #8b949e;">No significant assets in this category.</p>';
      } else {
        html += \`
          <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #30363d; font-weight: 600;">
            Total: \${formatUsd(escrowTotal + tokenTotal)}
          </div>
        \`;
      }

      document.getElementById('modal-body').innerHTML = html;
      document.getElementById('modal').classList.add('active');
    }

    function closeModal() {
      document.getElementById('modal').classList.remove('active');
    }

    document.getElementById('modal').addEventListener('click', (e) => {
      if (e.target.id === 'modal') closeModal();
    });
  </script>
</body>
</html>`
}

function main(): void {
  console.log('Loading analysis files...')

  const files = readdirSync(ANALYSIS_DIR).filter(f => f.endsWith('.json'))

  if (files.length === 0) {
    console.log('No analysis files found in', ANALYSIS_DIR)
    return
  }

  const reports: EscrowReport[] = []
  for (const file of files) {
    try {
      const content = readFileSync(join(ANALYSIS_DIR, file), 'utf-8')
      const report = JSON.parse(content) as EscrowReport
      reports.push(report)
      console.log(`  Loaded ${file}`)
    } catch (e) {
      console.log(`  Failed to load ${file}`)
    }
  }

  console.log(`\nGenerating HTML for ${reports.length} chains...`)

  const html = generateHtml(reports)
  const outputPath = join(ANALYSIS_DIR, 'dashboard.html')
  writeFileSync(outputPath, html)

  console.log(`\n Dashboard saved to ${outputPath}`)
  console.log(`  Open in browser: file://${outputPath}`)
}

main()
