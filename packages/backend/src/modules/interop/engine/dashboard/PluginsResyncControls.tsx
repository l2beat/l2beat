import React from 'react'
import type { PluginSyncStatus } from '../sync/InteropSyncersManager'

export function PluginsResyncControls(props: {
  pluginSyncStatuses: PluginSyncStatus[]
}) {
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
                <button
                  type="button"
                  className="interop-resync-button"
                  data-plugin-name={pluginName}
                >
                  Wipe and resync 1d
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
              function buildPayload(pluginName) {
                var nowSeconds = Math.floor(Date.now() / 1000);
                return {
                  pluginName: pluginName,
                  resyncRequestedFrom: { '*': nowSeconds - 86400 }
                };
              }

              document.addEventListener('click', function(event) {
                var target = event.target;
                if (!target || target.tagName !== 'BUTTON') return;
                if (!target.classList.contains('interop-resync-button')) return;

                var pluginName = target.getAttribute('data-plugin-name');
                if (!pluginName) return;

                var originalText = target.textContent;
                target.disabled = true;

                fetch('/interop/resync', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(buildPayload(pluginName))
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
