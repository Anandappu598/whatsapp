import React from 'react';
const AnalyticsWidget = ({ data, titlePrefix = "", setDetailedView }) => (
  <div className="analytics-grid">
    {/* Column 1: Campaign Performance */}
    <div className="analytics-card">
      <div className="card-header-with-action">
        <h3>{titlePrefix} Campaign Performance</h3>
        <span className="view-all-btn" onClick={() => setDetailedView('campaigns')}>View all</span>
      </div>
      <div className="main-metric">
        <div className="metric-value">{data.campaigns.active}</div>
        <div className="metric-label">Active Campaigns Running</div>
      </div>
      <div className="sub-metrics-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        <div className="sub-metric">
          <div className="sub-value">{data.campaigns.sent.toLocaleString()}</div>
          <div className="sub-label">Sent</div>
        </div>
        <div className="sub-metric">
          <div className="sub-value warning">{data.campaigns.failed}</div>
          <div className="sub-label">Failed</div>
        </div>
        <div className="sub-metric">
          <div className="sub-value success">{data.campaigns.delivered}</div>
          <div className="sub-label">Delivered</div>
        </div>
        <div className="sub-metric">
          <div className="sub-value success" style={{ color: 'var(--brand-purple)' }}>{data.campaigns.received}</div>
          <div className="sub-label">Read</div>
        </div>
      </div>
    </div>

    {/* Column 2: Individual Performance */}
    <div className="analytics-card">
      <div className="card-header-with-action">
        <h3>{titlePrefix} Individual</h3>
        <span className="view-all-btn" onClick={() => setDetailedView('individual')}>View all</span>
      </div>
      <div className="main-metric">
        <div className="metric-value">{data.individual.active}</div>
        <div className="metric-label">Active Conversations</div>
      </div>
      <div className="sub-metrics-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        <div className="sub-metric">
          <div className="sub-value">{data.individual.sent.toLocaleString()}</div>
          <div className="sub-label">Sent</div>
        </div>
        <div className="sub-metric">
          <div className="sub-value warning">{data.individual.failed}</div>
          <div className="sub-label">Failed</div>
        </div>
        <div className="sub-metric">
          <div className="sub-value success">{data.individual.delivered}</div>
          <div className="sub-label">Delivered</div>
        </div>
        <div className="sub-metric">
          <div className="sub-value success" style={{ color: 'var(--brand-purple)' }}>{data.individual.received}</div>
          <div className="sub-label">Read</div>
        </div>
      </div>
    </div>
  </div>
);

export default AnalyticsWidget;