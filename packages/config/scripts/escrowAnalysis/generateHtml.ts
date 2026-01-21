#!/usr/bin/env node
/**
 * Generate HTML Visualizations
 *
 * Reads all analysis JSON files from /analysis folder and generates
 * HTML visualizations.
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
  const totalCanonical = reports.reduce((sum, r) => sum + r.summary.canonicalTvl, 0)
  const totalExternal = reports.reduce((sum, r) => sum + r.summary.externalTvl, 0)
  const totalNative = reports.reduce((sum, r) => sum + r.summary.nativeTvl, 0)
  const totalRollupSecured = reports.reduce((sum, r) => sum + r.summary.rollupSecuredTvl, 0)
  const totalIssuerSecured = reports.reduce((sum, r) => sum + r.summary.issuerSecuredTvl, 0)
  const totalThirdParty = reports.reduce((sum, r) => sum + r.summary.thirdPartySecuredTvl, 0)

  // Get API totals from stored values
  const totalApiCanonical = reports.reduce((sum, r) => sum + (r.summary.apiCanonicalTvl || 0), 0)
  const totalApiExternal = reports.reduce((sum, r) => sum + (r.summary.apiExternalTvl || 0), 0)

  const chainRows = reports
    .sort((a, b) => b.summary.totalTvl - a.summary.totalTvl)
    .map(r => {
      // Use stored API values
      const apiCanonical = r.summary.apiCanonicalTvl || 0
      const apiExternal = r.summary.apiExternalTvl || 0

      // Calculate differences
      const canonicalDiff = r.summary.canonicalTvl - apiCanonical
      const externalDiff = r.summary.externalTvl - apiExternal

      const diffStr = (diff: number) => {
        if (Math.abs(diff) < 1000) return ''
        const sign = diff >= 0 ? '+' : '-'
        return `<span class="${diff >= 0 ? 'positive' : 'negative'}" style="font-size:11px;margin-left:4px;">(${sign}${formatUsd(Math.abs(diff))})</span>`
      }

      const noTrust = r.summary.rollupSecuredTvl + r.summary.issuerSecuredTvl
      const rollupPct = noTrust > 0 ? (r.summary.rollupSecuredTvl / noTrust) * 100 : 0

      return `
      <tr>
        <td class="clickable" onclick="showChainDetail('${r.projectId}')">${r.projectId}</td>
        <td class="clickable" onclick="showChainDetail('${r.projectId}')">${formatUsd(r.summary.totalTvl)}</td>
        <td class="canonical clickable" onclick="showReclassified('${r.projectId}', 'canonical')">${formatUsd(r.summary.canonicalTvl)}${diffStr(canonicalDiff)}</td>
        <td class="external clickable" onclick="showReclassified('${r.projectId}', 'external')">${formatUsd(r.summary.externalTvl)}${diffStr(externalDiff)}</td>
        <td class="native separator">${formatUsd(r.summary.nativeTvl)}</td>
        <td class="clickable" onclick="showCategoryDetail('${r.projectId}', 'no-additional-trust')" style="position: relative;">
          <div class="trust-bar">
            <div class="trust-bar-rollup" style="width: ${rollupPct}%"></div>
            <div class="trust-bar-issuer" style="width: ${100 - rollupPct}%"></div>
          </div>
          <span style="position: relative; z-index: 1;">${formatUsd(noTrust)}</span>
        </td>
        <td class="third-party clickable" onclick="showCategoryDetail('${r.projectId}', 'third-party-secured')">${formatUsd(r.summary.thirdPartySecuredTvl)}</td>
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
    h1 { color: #58a6ff; margin-bottom: 24px; }
    h2 { color: #8b949e; margin: 24px 0 16px; font-size: 14px; text-transform: uppercase; }

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
    .summary-card.canonical .value { color: #3fb950; }
    .summary-card.external .value { color: #f0883e; }
    .summary-card.native .value { color: #58a6ff; }

    .breakdown-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .breakdown-card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 16px;
    }
    .breakdown-card .label { color: #8b949e; font-size: 12px; margin-bottom: 4px; }
    .breakdown-card .value { font-size: 20px; font-weight: 600; }
    .breakdown-card.rollup .value { color: #3fb950; }
    .breakdown-card.issuer .value { color: #a371f7; }
    .breakdown-card.third-party .value { color: #f85149; }

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
    .canonical { color: #3fb950; }
    .external { color: #f0883e; }
    .native { color: #58a6ff; }
    .rollup { color: #3fb950; }
    .issuer { color: #a371f7; }
    .third-party { color: #f85149; }
    .positive { color: #3fb950; }
    .negative { color: #f85149; }

    .trust-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      opacity: 0.3;
    }
    .trust-bar-rollup { background: #3fb950; }
    .trust-bar-issuer { background: #a371f7; }

    .comparison-table {
      width: auto;
      margin-bottom: 32px;
    }
    .comparison-table td, .comparison-table th {
      padding: 12px 16px;
    }
    .comparison-table .total-row {
      font-weight: 600;
      border-top: 2px solid #30363d;
    }

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
    .escrow-category.rollup-secured { background: rgba(63,185,80,0.2); color: #3fb950; }
    .escrow-category.issuer-secured { background: rgba(163,113,247,0.2); color: #a371f7; }
    .escrow-category.third-party-secured { background: rgba(248,81,73,0.2); color: #f85149; }
    .escrow-tokens {
      margin-top: 12px;
      font-size: 13px;
      color: #8b949e;
    }
  </style>
</head>
<body>
  <h1>Escrow Analysis Dashboard</h1>

  <h2>Messaging Classification</h2>
  <p style="color: #8b949e; font-size: 13px; margin-bottom: 16px;">How messages being passed between L1 and L2: Canonical (rollup messaging), External (non-rollup external messaging), Native (issued on L2 directly)</p>
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Source</th>
        <th>Current API</th>
        <th>New Framework</th>
        <th>Difference</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="canonical">Canonical</td>
        <td>${formatUsd(totalApiCanonical)} (${((totalApiCanonical / totalTvl) * 100).toFixed(1)}%)</td>
        <td>${formatUsd(totalCanonical)} (${((totalCanonical / totalTvl) * 100).toFixed(1)}%)</td>
        <td class="${totalCanonical - totalApiCanonical >= 0 ? 'positive' : 'negative'}">${totalCanonical - totalApiCanonical >= 0 ? '+' : '-'}${formatUsd(Math.abs(totalCanonical - totalApiCanonical))}</td>
      </tr>
      <tr>
        <td class="external">External</td>
        <td>${formatUsd(totalApiExternal)} (${((totalApiExternal / totalTvl) * 100).toFixed(1)}%)</td>
        <td>${formatUsd(totalExternal)} (${((totalExternal / totalTvl) * 100).toFixed(1)}%)</td>
        <td class="${totalExternal - totalApiExternal >= 0 ? 'positive' : 'negative'}">${totalExternal - totalApiExternal >= 0 ? '+' : '-'}${formatUsd(Math.abs(totalExternal - totalApiExternal))}</td>
      </tr>
      <tr>
        <td class="native">Native</td>
        <td>${formatUsd(totalNative)} (${((totalNative / totalTvl) * 100).toFixed(1)}%)</td>
        <td>${formatUsd(totalNative)} (${((totalNative / totalTvl) * 100).toFixed(1)}%)</td>
        <td>-</td>
      </tr>
      <tr class="total-row">
        <td>Total</td>
        <td>${formatUsd(totalTvl)}</td>
        <td>${formatUsd(totalTvl)}</td>
        <td>✓</td>
      </tr>
    </tbody>
  </table>

  <h2>Chains (${reports.length})</h2>
  <table>
    <thead>
      <tr>
        <th rowspan="2">Chain</th>
        <th rowspan="2">Total TVL</th>
        <th colspan="3" class="separator" style="text-align: center; color: #58a6ff;">Messaging Classification</th>
        <th colspan="2" style="text-align: center; color: #a371f7;">Trust Assumptions</th>
      </tr>
      <tr>
        <th class="canonical">Canonical</th>
        <th class="external">External</th>
        <th class="native separator">Native</th>
        <th style="color: #3fb950;">No Additional Trust</th>
        <th class="third-party">Third-Party</th>
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

      document.getElementById('modal-title').textContent = chainId + ' Assets';

      const escrowHtml = '<h3 style="color: #8b949e; margin-bottom: 12px;">Escrows (L1 locked)</h3>' +
        report.escrows
        .sort((a, b) => b.totalValueUsd - a.totalValueUsd)
        .map(e => \`
          <div class="escrow-card">
            <div class="escrow-header">
              <span class="escrow-name">\${e.name}</span>
              <span class="escrow-value">\${formatUsd(e.totalValueUsd)}</span>
            </div>
            <div>
              <span class="escrow-category \${e.category}">\${e.category}</span>
              <span style="color: #8b949e; margin-left: 8px; font-size: 12px;">\${e.bridgeType}</span>
            </div>
            <div class="escrow-tokens">
              \${e.tokens.slice(0, 5).map(t => t.symbol + ': ' + formatUsd(t.valueUsd)).join(' | ')}
              \${e.tokens.length > 5 ? ' | +' + (e.tokens.length - 5) + ' more' : ''}
            </div>
          </div>
        \`).join('');

      const externalHtml = report.externalTokens && report.externalTokens.length > 0 ?
        '<h3 style="color: #8b949e; margin: 24px 0 12px;">External Tokens (burn/mint)</h3>' +
        report.externalTokens
        .sort((a, b) => b.valueUsd - a.valueUsd)
        .map(t => \`
          <div class="escrow-card">
            <div class="escrow-header">
              <span class="escrow-name">\${t.symbol}</span>
              <span class="escrow-value">\${formatUsd(t.valueUsd)}</span>
            </div>
            <div>
              <span class="escrow-category \${t.category}">\${t.category}</span>
              <span style="color: #8b949e; margin-left: 8px; font-size: 12px;">\${t.bridgeProtocol}</span>
            </div>
          </div>
        \`).join('') : '';

      document.getElementById('modal-body').innerHTML = escrowHtml + externalHtml;
      document.getElementById('modal').classList.add('active');
    }

    function showReclassified(chainId, type) {
      const report = reports.find(r => r.projectId === chainId);
      if (!report) return;

      if (type === 'canonical') {
        // Escrows now canonical that were marked external (issuer-controlled canonical bridges)
        const reclassified = report.escrows
          .filter(e => e.bridgeType === 'canonical' && e.category !== 'rollup-secured')
          .filter(e => e.totalValueUsd > 10000)
          .sort((a, b) => b.totalValueUsd - a.totalValueUsd);
        const totalReclassified = reclassified.reduce((sum, e) => sum + e.totalValueUsd, 0);

        document.getElementById('modal-title').textContent = chainId + ' - Canonical Reclassification';

        if (reclassified.length === 0) {
          document.getElementById('modal-body').innerHTML = '<p style="color: #8b949e;">No significant reclassifications for this category.</p>';
        } else {
          const tableHtml = \`
            <table style="width: 100%;">
              <thead>
                <tr>
                  <th style="text-align: left;">Escrow</th>
                  <th style="text-align: right;">TVL</th>
                  <th style="text-align: left;">Current API</th>
                  <th style="text-align: left;">New Framework</th>
                </tr>
              </thead>
              <tbody>
                \${reclassified.map(e => \`
                  <tr>
                    <td>\${e.name} \${e.adminName ? '(' + e.adminName + ')' : ''}</td>
                    <td style="text-align: right;">\${formatUsd(e.totalValueUsd)}</td>
                    <td class="external">source: external</td>
                    <td class="canonical">\${e.bridgeType} + \${e.category}</td>
                  </tr>
                \`).join('')}
                <tr style="border-top: 2px solid #30363d; font-weight: 600;">
                  <td>Total reclassified</td>
                  <td style="text-align: right;">\${formatUsd(totalReclassified)}</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          \`;
          document.getElementById('modal-body').innerHTML = tableHtml;
        }
      } else {
        // External summary view
        const apiExternal = report.summary.apiExternalTvl || 0;
        const newExternal = report.summary.externalTvl;
        const diff = newExternal - apiExternal;

        // Break down by category
        const externalTokens = report.externalTokens || [];
        const issuerSecured = externalTokens.filter(t => t.category === 'issuer-secured').reduce((sum, t) => sum + t.valueUsd, 0);
        const thirdPartySecured = externalTokens.filter(t => t.category === 'third-party-secured').reduce((sum, t) => sum + t.valueUsd, 0);

        // Count by bridge protocol
        const byProtocol = {};
        externalTokens.forEach(t => {
          byProtocol[t.bridgeProtocol] = (byProtocol[t.bridgeProtocol] || 0) + t.valueUsd;
        });
        const topProtocols = Object.entries(byProtocol)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        document.getElementById('modal-title').textContent = chainId + ' - External TVL Summary';

        const tableHtml = \`
          <table style="width: 100%; margin-bottom: 24px;">
            <thead>
              <tr>
                <th style="text-align: left;">Metric</th>
                <th style="text-align: right;">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Current API External</td>
                <td style="text-align: right;">\${formatUsd(apiExternal)}</td>
              </tr>
              <tr>
                <td>New Framework External</td>
                <td style="text-align: right;">\${formatUsd(newExternal)}</td>
              </tr>
              <tr style="border-top: 2px solid #30363d; font-weight: 600;">
                <td>Difference</td>
                <td style="text-align: right;" class="\${diff >= 0 ? 'positive' : 'negative'}">\${diff >= 0 ? '+' : '-'}\${formatUsd(Math.abs(diff))}</td>
              </tr>
            </tbody>
          </table>

          <h3 style="color: #8b949e; margin-bottom: 12px;">External Tokens by Security</h3>
          <table style="width: 100%; margin-bottom: 24px;">
            <tbody>
              <tr>
                <td class="issuer">Issuer-Secured</td>
                <td style="text-align: right;">\${formatUsd(issuerSecured)}</td>
              </tr>
              <tr>
                <td class="third-party">Third-Party-Secured</td>
                <td style="text-align: right;">\${formatUsd(thirdPartySecured)}</td>
              </tr>
            </tbody>
          </table>

          <h3 style="color: #8b949e; margin-bottom: 12px;">Top Bridge Protocols</h3>
          <table style="width: 100%;">
            <tbody>
              \${topProtocols.map(([protocol, value]) => \`
                <tr>
                  <td>\${protocol}</td>
                  <td style="text-align: right;">\${formatUsd(value)}</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        \`;
        document.getElementById('modal-body').innerHTML = tableHtml;
      }

      document.getElementById('modal').classList.add('active');
    }

    function showCategoryDetail(chainId, category) {
      const report = reports.find(r => r.projectId === chainId);
      if (!report) return;

      const categoryNames = {
        'rollup-secured': 'Rollup-Secured',
        'issuer-secured': 'Issuer-Secured',
        'third-party-secured': 'Third-Party-Secured',
        'no-additional-trust': 'No Additional Trust'
      };

      document.getElementById('modal-title').textContent = chainId + ' - ' + categoryNames[category] + ' Assets';

      // Handle combined "no-additional-trust" category
      const categories = category === 'no-additional-trust'
        ? ['rollup-secured', 'issuer-secured']
        : [category];

      // Get escrows for this category
      const escrows = report.escrows
        .filter(e => categories.includes(e.category))
        .filter(e => e.totalValueUsd > 10000)
        .sort((a, b) => b.totalValueUsd - a.totalValueUsd);

      // Get external tokens for this category
      const externalTokens = (report.externalTokens || [])
        .filter(t => categories.includes(t.category))
        .filter(t => t.valueUsd > 10000)
        .sort((a, b) => b.valueUsd - a.valueUsd);

      const escrowTotal = escrows.reduce((sum, e) => sum + e.totalValueUsd, 0);
      const tokenTotal = externalTokens.reduce((sum, t) => sum + t.valueUsd, 0);

      let html = '';

      // Show breakdown summary for no-additional-trust
      if (category === 'no-additional-trust') {
        const rollupEscrows = escrows.filter(e => e.category === 'rollup-secured').reduce((sum, e) => sum + e.totalValueUsd, 0);
        const issuerEscrows = escrows.filter(e => e.category === 'issuer-secured').reduce((sum, e) => sum + e.totalValueUsd, 0);
        const rollupTokens = externalTokens.filter(t => t.category === 'rollup-secured').reduce((sum, t) => sum + t.valueUsd, 0);
        const issuerTokens = externalTokens.filter(t => t.category === 'issuer-secured').reduce((sum, t) => sum + t.valueUsd, 0);
        const rollupTotal = rollupEscrows + rollupTokens;
        const issuerTotal = issuerEscrows + issuerTokens;
        const grandTotal = rollupTotal + issuerTotal;
        const rollupPct = grandTotal > 0 ? ((rollupTotal / grandTotal) * 100).toFixed(1) : 0;
        const issuerPct = grandTotal > 0 ? ((issuerTotal / grandTotal) * 100).toFixed(1) : 0;

        html += \`
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div style="background: #21262d; border-radius: 8px; padding: 16px; border-left: 4px solid #3fb950;">
              <div style="color: #8b949e; font-size: 12px;">Rollup-Secured</div>
              <div style="font-size: 20px; font-weight: 600; color: #3fb950;">\${formatUsd(rollupTotal)}</div>
              <div style="color: #8b949e; font-size: 11px;">\${rollupPct}% of total</div>
            </div>
            <div style="background: #21262d; border-radius: 8px; padding: 16px; border-left: 4px solid #a371f7;">
              <div style="color: #8b949e; font-size: 12px;">Issuer-Secured</div>
              <div style="font-size: 20px; font-weight: 600; color: #a371f7;">\${formatUsd(issuerTotal)}</div>
              <div style="color: #8b949e; font-size: 11px;">\${issuerPct}% of total</div>
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
                <th style="text-align: left;">Category</th>
              </tr>
            </thead>
            <tbody>
              \${escrows.map(e => \`
                <tr>
                  <td>\${e.name} \${e.adminName ? '(' + e.adminName + ')' : ''}</td>
                  <td style="text-align: right;">\${formatUsd(e.totalValueUsd)}</td>
                  <td class="\${e.category === 'rollup-secured' ? 'rollup' : 'issuer'}">\${e.category === 'rollup-secured' ? 'Rollup' : 'Issuer'}</td>
                </tr>
              \`).join('')}
              <tr style="border-top: 2px solid #30363d; font-weight: 600;">
                <td>Subtotal</td>
                <td style="text-align: right;">\${formatUsd(escrowTotal)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        \`;
      }

      if (externalTokens.length > 0) {
        html += \`
          <h3 style="color: #8b949e; margin-bottom: 12px;">External Tokens (Burn/Mint)</h3>
          <table style="width: 100%;">
            <thead>
              <tr>
                <th style="text-align: left;">Token</th>
                <th style="text-align: right;">TVL</th>
                <th style="text-align: left;">Bridge</th>
                <th style="text-align: left;">Category</th>
              </tr>
            </thead>
            <tbody>
              \${externalTokens.map(t => \`
                <tr>
                  <td>\${t.symbol}</td>
                  <td style="text-align: right;">\${formatUsd(t.valueUsd)}</td>
                  <td>\${t.bridgeProtocol}</td>
                  <td class="\${t.category === 'rollup-secured' ? 'rollup' : t.category === 'issuer-secured' ? 'issuer' : 'third-party'}">\${t.category === 'rollup-secured' ? 'Rollup' : t.category === 'issuer-secured' ? 'Issuer' : 'Third-Party'}</td>
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

  console.log(`\n✓ Dashboard saved to ${outputPath}`)
  console.log(`  Open in browser: file://${outputPath}`)
}

main()
