import React from 'react';
import '../styles/b2b_view.css';

const B2BView = () => {
    return (
        <main className="main-content">
            {/* Search & Action Bar */}
            <div style={{ display: 'flex', gap: '16px' }}>
                <div className="search-bar" style={{ flex: 1 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Search companies, account managers, or domains..." />
                </div>
                <button className="btn-white" style={{ background: 'var(--brand-purple)', color: 'white' }}>
                    + Add New Company
                </button>
            </div>

            {/* B2B Metric Pills */}
            <div className="stats-row" style={{ marginTop: '8px' }}>
                <div className="stat-pill">
                    <div className="stat-icon">🏢</div>
                    <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Active B2B Clients</div>
                        <div style={{ fontWeight: '800', fontSize: '18px' }}>124</div>
                    </div>
                </div>
                <div className="stat-pill">
                    <div className="stat-icon">⭐</div>
                    <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Enterprise Accounts</div>
                        <div style={{ fontWeight: '800', fontSize: '18px' }}>38</div>
                    </div>
                </div>
                <div className="stat-pill">
                    <div className="stat-icon">📄</div>
                    <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Pending Proposals</div>
                        <div style={{ fontWeight: '800', fontSize: '18px' }}>12</div>
                    </div>
                </div>
            </div>

            {/* B2B Client Data Table */}
            <div className="b2b-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Client Accounts</h3>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-gray)', cursor: 'pointer', fontWeight: 'bold' }}>Filter ▾</button>
                </div>

                <table className="b2b-table">
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Primary Contact</th>
                            <th>Account Tier</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Client Row 1 */}
                        <tr>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="avatar" style={{ width: '32px', height: '32px', background: '#FEE2E2', color: '#DC2626' }}>M</div>
                                    <div>
                                        <div style={{ fontWeight: '800' }}>MedHealth Solutions</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '500' }}>Healthcare</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div>Dr. Sarah Jenkins</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '500' }}>sarah@medhealth.com</div>
                            </td>
                            <td><span className="badge enterprise">Enterprise</span></td>
                            <td><span style={{ color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', background: '#047857', borderRadius: '50%' }}></div> Active</span></td>
                            <td><button className="btn-action">Message</button></td>
                        </tr>

                        {/* Client Row 2 */}
                        <tr>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="avatar" style={{ width: '32px', height: '32px', background: '#E0E7FF', color: '#4F46E5' }}>L</div>
                                    <div>
                                        <div style={{ fontWeight: '800' }}>Logistics Pro Inc.</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '500' }}>Supply Chain</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div>Mark Thompson</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '500' }}>mark.t@logisticspro.com</div>
                            </td>
                            <td><span className="badge startup">Standard</span></td>
                            <td><span style={{ color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', background: '#047857', borderRadius: '50%' }}></div> Active</span></td>
                            <td><button className="btn-action">Message</button></td>
                        </tr>

                        {/* Client Row 3 */}
                        <tr>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="avatar" style={{ width: '32px', height: '32px', background: '#FEF3C7', color: '#D97706' }}>F</div>
                                    <div>
                                        <div style={{ fontWeight: '800' }}>FinTech Dynamics</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '500' }}>Finance</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div>Elena Rodriguez</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '500' }}>elena@ftdynamics.net</div>
                            </td>
                            <td><span className="badge enterprise">Enterprise</span></td>
                            <td><span style={{ color: '#D97706', display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', background: '#D97706', borderRadius: '50%' }}></div> Onboarding</span></td>
                            <td><button className="btn-action">Message</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    );
};

export default B2BView;
