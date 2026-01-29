import React from 'react'

const STREAM_URL = '/interop/transfers/stream'

export function LiveTransfers() {
  const streamScript = `
(() => {
  const root = document.getElementById('live-transfers-root');
  if (!root || !window.React || !window.ReactDOM) return;
  const h = React.createElement;
  const { useEffect, useState } = React;
  const MAX_ITEMS = 5;
  const streamUrl = root.getAttribute('data-stream-url') || '${STREAM_URL}';

  const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const shortHash = (hash) => {
    if (!hash) return '-';
    if (hash.length <= 10) return hash;
    return hash.slice(0, 6) + '...' + hash.slice(-4);
  };

  const formatAmount = (amount, symbol, raw) => {
    if (amount !== undefined && amount !== null) {
      return symbol ? amount + ' ' + symbol : String(amount);
    }
    if (raw !== undefined && raw !== null) return String(raw);
    return '-';
  };

  function LiveTransfersComponent() {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState('connecting');

    useEffect(() => {
      if (typeof EventSource === 'undefined') {
        setStatus('unsupported');
        return;
      }
      const source = new EventSource(streamUrl);
      source.onopen = () => setStatus('open');
      source.onerror = () => setStatus('error');
      source.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const incoming = Array.isArray(payload) ? payload : [payload];
          if (incoming.length === 0) return;
          setItems((prev) => {
            const next = incoming.concat(prev);
            return next.slice(0, MAX_ITEMS);
          });
        } catch {
          // Ignore invalid payloads.
        }
      };
      return () => source.close();
    }, []);

    return h(
      'div',
      { className: 'live-transfers' },
      h(
        'div',
        { className: 'live-transfers__header' },
        h('h2', null, 'Live transfers'),
        h('span', { className: 'live-transfers__status' }, status),
      ),
      items.length === 0
        ? h(
            'div',
            { className: 'live-transfers__empty' },
            'Waiting for transfers...',
          )
        : null,
      h(
        'ul',
        { className: 'live-transfers__list' },
        items.map((item, index) =>
          h(
            'li',
            {
              className: 'live-transfers__item',
              key:
                item.transferId ||
                item.srcTxHash ||
                String(item.timestamp || 0) + ':' + index,
            },
            h(
              'span',
              { className: 'live-transfers__time' },
              formatTime(item.timestamp),
            ),
            h(
              'span',
              { className: 'live-transfers__type' },
              item.type || 'unknown',
            ),
            h(
              'span',
              { className: 'live-transfers__chains' },
              (item.srcChain || '?') + ' -> ' + (item.dstChain || '?'),
            ),
            h(
              'span',
              { className: 'live-transfers__amounts' },
              formatAmount(item.srcAmount, item.srcSymbol, item.srcRawAmount) +
                ' -> ' +
                formatAmount(item.dstAmount, item.dstSymbol, item.dstRawAmount),
            ),
            h(
              'span',
              { className: 'live-transfers__txs' },
              shortHash(item.srcTxHash) + ' -> ' + shortHash(item.dstTxHash),
            ),
          ),
        ),
      ),
    );
  }

  if (ReactDOM.hydrateRoot) {
    ReactDOM.hydrateRoot(root, h(LiveTransfersComponent));
  } else if (ReactDOM.createRoot) {
    ReactDOM.createRoot(root).render(h(LiveTransfersComponent));
  } else if (ReactDOM.render) {
    ReactDOM.render(h(LiveTransfersComponent), root);
  }
})();
`

  return (
    <div>
      <style>{`
        .live-transfers {
          margin: 24px 0;
        }
        .live-transfers__header {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }
        .live-transfers__status {
          font-size: 12px;
          text-transform: uppercase;
          color: #666;
        }
        .live-transfers__list {
          list-style: none;
          padding: 0;
          margin: 8px 0 0;
        }
        .live-transfers__item {
          display: grid;
          grid-template-columns: 170px 180px 140px 200px 200px;
          gap: 12px;
          padding: 6px 0;
          border-bottom: 1px solid #eee;
          font-family: monospace;
          font-size: 12px;
        }
        .live-transfers__empty {
          color: #666;
          font-style: italic;
        }
      `}</style>
      <div id="live-transfers-root" data-stream-url={STREAM_URL}>
        <div className="live-transfers">
          <div className="live-transfers__header">
            <h2>Live transfers</h2>
            <span className="live-transfers__status">connecting</span>
          </div>
          <div className="live-transfers__empty">Waiting for transfers...</div>
          <ul className="live-transfers__list" />
        </div>
      </div>
      <script src="https://unpkg.com/react@18/umd/react.production.min.js" />
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" />
      <script
        dangerouslySetInnerHTML={{
          __html: streamScript,
        }}
      />
    </div>
  )
}
