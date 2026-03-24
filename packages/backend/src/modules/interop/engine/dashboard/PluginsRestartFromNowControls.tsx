import React from 'react'
import type { PluginSyncStatus } from '../sync/InteropSyncersManager'

export function PluginsRestartFromNowControls(props: {
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
      <h2>Wipe & restart from now</h2>
      <table>
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
                  className="interop-restart-from-now-button"
                  data-plugin-name={pluginName}
                >
                  Wipe & restart from now
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
              document.addEventListener('click', function(event) {
                var target = event.target;
                if (!target || target.tagName !== 'BUTTON') return;
                if (!target.classList.contains('interop-restart-from-now-button')) return;

                var pluginName = target.getAttribute('data-plugin-name');
                if (!pluginName) return;

                var input = prompt(
                  'This will DELETE ALL DATA for "' + pluginName + '" and restart syncing from now. Existing history will not be replayed.\\n\\n' +
                  'Type the plugin name to confirm:'
                );
                if (input !== pluginName) return;

                var originalText = target.textContent;
                target.disabled = true;

                fetch('/interop/restart-from-now', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ pluginName: pluginName })
                })
                  .then(function(response) {
                    if (!response.ok) throw new Error('Request failed');
                    return response.json();
                  })
                  .then(function() {
                    target.textContent = 'Restart from now requested';
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
