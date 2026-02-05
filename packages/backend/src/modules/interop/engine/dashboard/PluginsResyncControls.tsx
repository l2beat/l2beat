import React from 'react'
import type { PluginSyncStatus } from '../sync/InteropSyncersManager'

export function PluginsResyncControls(props: {
  pluginSyncStatuses: PluginSyncStatus[]
}) {
  const resyncDaysOptions = [8, 2, 1]
  const pluginNames = Array.from(
    new Set(props.pluginSyncStatuses.map((status) => status.pluginName)),
  ).sort((a, b) => a.localeCompare(b))

  if (pluginNames.length === 0) {
    return null
  }

  return (
    <section>
      <h2>Resync plugins</h2>
      <table>
        <caption>Resync plugins</caption>
        <thead>
          <tr>
            <th>plugin</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {pluginNames.map((pluginName) => (
            <tr key={pluginName}>
              <td>{pluginName}</td>
              <td>
                {resyncDaysOptions.map((days, index) => (
                  <React.Fragment key={days}>
                    <button
                      type="button"
                      className="interop-resync-button"
                      data-plugin-name={pluginName}
                      data-resync-days={days}
                    >
                      Resync {days}d
                    </button>
                    {index < resyncDaysOptions.length - 1 ? ' ' : null}
                  </React.Fragment>
                ))}{' '}
                <button
                  type="button"
                  className="interop-resync-button"
                  data-plugin-name={pluginName}
                  data-resync-days={14}
                  data-resync-ethereum-days={1}
                >
                  Resync Ethereum 1d, others 14d
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function buildPayload(pluginName, days, ethereumDays) {
                var nowSeconds = Math.floor(Date.now() / 1000);
                var payload = {
                  pluginName: pluginName,
                  resyncRequestedFrom: { '*': nowSeconds - 3600 * 24 * days }
                };
                if (ethereumDays) {
                  payload.resyncRequestedFrom.ethereum =
                    nowSeconds - 3600 * 24 * ethereumDays;
                }
                return payload;
              }

              document.addEventListener('click', function(event) {
                var target = event.target;
                if (!target || target.tagName !== 'BUTTON') return;
                if (!target.classList.contains('interop-resync-button')) return;

                var pluginName = target.getAttribute('data-plugin-name');
                if (!pluginName) return;
                var resyncDays = Number(target.getAttribute('data-resync-days'));
                if (!resyncDays) return;
                var ethereumDaysAttr = target.getAttribute('data-resync-ethereum-days');
                var ethereumDays = null;
                if (ethereumDaysAttr !== null) {
                  ethereumDays = Number(ethereumDaysAttr);
                  if (!ethereumDays) return;
                }

                var originalText = target.textContent;
                target.disabled = true;

                fetch('/interop/resync', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(buildPayload(pluginName, resyncDays, ethereumDays))
                })
                  .then(function(response) {
                    if (!response.ok) {
                      throw new Error('Request failed');
                    }
                    return response.json();
                  })
                  .then(function() {
                    target.textContent = 'Resync requested';
                  })
                  .catch(function() {
                    target.disabled = false;
                    target.textContent = originalText;
                  });
              });
            })();
          `,
        }}
      />
    </section>
  )
}
