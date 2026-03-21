import React from 'react';

const ActivityDetailView = ({ type, data, selectedActivity, setSelectedActivity, onClose }) => {
  const list = type === 'campaigns' ? data.campaigns.running : data.individual.running;

  if (selectedActivity) {
    return (
      <div className="modal-overlay">
        <div className="modal-container" style={{ maxWidth: '1000px', height: '90vh' }}>
          <div className="modal-header">
            <div className="back-link" onClick={() => setSelectedActivity(null)}>
              Back to List
            </div>
            <h3 className="modal-title">Activity Detail</h3>
            <button className="close-x" onClick={onClose}>x</button>
          </div>

          <div className="modal-content" style={{ maxHeight: 'none', background: 'var(--bg-main)' }}>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>
                    {selectedActivity.name || 'Conversation'}
                  </h1>
                  <p style={{ color: 'var(--text-gray)', marginTop: '8px' }}>
                    Launched: {selectedActivity.time}
                  </p>
                </div>
                <div className="status-pill running">
                  <span className="dot"></span> Active
                </div>
              </div>

              <div className="analytics-grid" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
                <div className="analytics-card" style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '13px', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '20px' }}>INFO</h4>

                  <div className="activity-table">
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          selectedActivity.audience === 'B2C' ? '1.5fr 1.2fr 0.8fr' : '1fr 1fr 1.2fr 0.8fr',
                        padding: '8px 0',
                        borderBottom: '1px solid var(--border-color)',
                        fontSize: '11px',
                        fontWeight: '800',
                        color: 'var(--text-gray)',
                      }}
                    >
                      {selectedActivity.audience !== 'B2C' && <span>COMPANY</span>}
                      <span>NAME</span>
                      <span>PHONE</span>
                      <span style={{ textAlign: 'right' }}>STATUS</span>
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {selectedActivity.contacts?.map((c, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              selectedActivity.audience === 'B2C'
                                ? '1.5fr 1.2fr 0.8fr'
                                : '1fr 1fr 1.2fr 0.8fr',
                            padding: '12px 0',
                            borderBottom: '1px solid var(--border-color)',
                            fontSize: '13px',
                            alignItems: 'center',
                          }}
                        >
                          {selectedActivity.audience !== 'B2C' && <span style={{ fontWeight: '700' }}>{c.company}</span>}
                          <span style={{ color: 'var(--text-dark)', fontWeight: selectedActivity.audience === 'B2C' ? '700' : 'normal' }}>
                            {c.name}
                          </span>
                          <span style={{ color: 'var(--text-gray)', fontFamily: 'monospace' }}>{c.phone}</span>
                          <div style={{ textAlign: 'right' }}>
                            <span className={`msg-status-pill status-${(c.status || 'Delivered').toLowerCase()}`}>
                              {c.status || 'Delivered'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="analytics-card" style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '13px', color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: '20px' }}>MESSAGE</h4>
                  <div className="whatsapp-preview-container" style={{ margin: 0, minHeight: '150px' }}>
                    <div className="message-bubble" style={{ maxWidth: '100%', fontSize: '14px' }}>
                      {selectedActivity.body || 'No message content recorded.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '1000px', height: '90vh' }}>
        <div className="modal-header" style={{ padding: '24px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <h3 className="modal-title" style={{ fontSize: '24px', fontWeight: '800' }}>
              Recent Campaign Activity
            </h3>
            <button className="close-x" style={{ position: 'static', padding: 0 }} onClick={onClose}>
              x
            </button>
          </div>
        </div>

        <div className="modal-content" style={{ maxHeight: 'none', background: 'var(--bg-main)', padding: '12px 32px 32px 32px' }}>
          <div className="activity-list">
            {list.length === 0 ? (
              <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-gray)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>Empty</div>
                <p>No activity recorded yet.</p>
              </div>
            ) : (
              list.map((item) => (
                <div key={item.id} className="activity-card-row" onClick={() => setSelectedActivity(item)}>
                  <div className="card-accent accent-running"></div>

                  <div className="campaign-info">
                    <div className="title">{item.name}</div>
                    <div className="audience-tag">{item.audience || 'B2B'} Audience</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="status-pill running" style={{ padding: '8px 16px' }}>
                      <span className="dot"></span> RUNNING
                    </div>
                  </div>

                  <div className="metrics-horizontal">
                    <div className="metric-item">
                      <div className="metric-top">{item.count?.toLocaleString()}</div>
                      <div className="metric-label-small">Message Count</div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-top">95%</div>
                      <div className="metric-label-small">Delivered %</div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-top">3.0%</div>
                      <div className="metric-label-small">Read %</div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-top">0%</div>
                      <div className="metric-label-small">Reply %</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailView;
