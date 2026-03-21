import React, { useState } from 'react';
import '../styles/templates_view.css';

const TemplatesView = ({ templates, onCreateClick, onLaunch }) => {
    const [activeTab, setActiveTab] = useState('All');
    const [activeStatus, setActiveStatus] = useState('All');

    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [audienceType, setAudienceType] = useState('');
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
    const [selectedContacts, setSelectedContacts] = useState(new Set());
    const [campaignName, setCampaignName] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // --- State Switching Helper ---
    const handleAudienceToggle = (type) => {
        if (type === audienceType) return;
        setAudienceType(type);
        setSelectedCourses([]);
        setSelectedContacts(new Set());
    };

    // --- Dummy Data ---
    const COURSES = ['Front-End Developer', 'UI/UX Design', 'Data Science', 'Full-Stack BootCamp'];

    const B2B_CONTACTS = [
        { id: 101, name: 'Alice Johnson', phone: '+1 234 567 8901', company: 'TechCorp Inc.' },
        { id: 102, name: 'Bob Smith', phone: '+1 345 678 9012', company: 'Global Logistics' },
        { id: 103, name: 'Charlie Brown', phone: '+1 456 789 0123', company: 'Merida Solutions' },
        { id: 104, name: 'Diana Prince', phone: '+1 567 890 1234', company: 'TechCorp Inc.' },
        { id: 105, name: 'Edward Norton', phone: '+1 678 901 2345', company: 'Global Logistics' },
    ];

    const B2C_CONTACTS = [
        { id: 201, name: 'John Doe', phone: '+1 111 222 3333', course: 'Front-End Developer' },
        { id: 202, name: 'Jane Roe', phone: '+1 222 333 4444', course: 'UI/UX Design' },
        { id: 203, name: 'Jim Bean', phone: '+1 333 444 5555', course: 'Data Science' },
        { id: 204, name: 'Jill Hill', phone: '+1 444 555 6666', course: 'Full-Stack BootCamp' },
        { id: 205, name: 'Jack Black', phone: '+1 555 666 7777', course: 'Front-End Developer' },
        { id: 206, name: 'Jenny Penny', phone: '+1 666 777 8888', course: 'UI/UX Design' },
    ];

    // --- Modal Logic ---
    const openSendModal = (template) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
        setCurrentStep(1);
        setSelectedContacts(new Set());
        setShowSuccess(false);
    };

    const closeSendModal = () => {
        setIsModalOpen(false);
        setSelectedTemplate(null);
        setCurrentStep(1);
        setAudienceType('');
        setSelectedCourses([]);
        setIsCourseDropdownOpen(false);
        setSelectedContacts(new Set());
        setCampaignName('');
        setShowSuccess(false);
    };

    const handleSend = () => {
        const contactSource = audienceType === 'B2B' ? B2B_CONTACTS : B2C_CONTACTS;
        const selectedContactObjects = contactSource.filter(c => selectedContacts.has(c.id));

        const contactsSummary = selectedContactObjects.map(c => ({
            name: c.name,
            company: c.company || (audienceType === 'B2C' ? 'Student' : 'N/A'),
            phone: c.phone,
            status: ['Delivered', 'Read', 'Failed'][Math.floor(Math.random() * 3)]
        }));

        if (onLaunch) onLaunch(
            selectedContacts.size,
            audienceType,
            campaignName,
            selectedTemplate?.name,
            selectedTemplate?.body,
            contactsSummary
        );

        setShowSuccess(true);
        setTimeout(() => {
            closeSendModal();
        }, 2200);
    };

    const toggleContact = (id) => {
        const newSelected = new Set(selectedContacts);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedContacts(newSelected);
    };

    const toggleSelectAll = () => {
        const contactSource = audienceType === 'B2B' ? B2B_CONTACTS : B2C_CONTACTS;
        if (selectedContacts.size === contactSource.length) {
            // Deselect all
            setSelectedContacts(new Set());
        } else {
            // Select all
            const allIds = new Set(contactSource.map(c => c.id));
            setSelectedContacts(allIds);
        }
    };

    // Helper functions for styling based on data
    const getStatusClass = (status) => {
        switch (status) {
            case 'APPROVED': return 'status-approved';
            case 'PENDING': return 'status-pending';
            case 'REJECTED': return 'status-rejected';
            default: return '';
        }
    };

    const getCategoryClass = (category) => {
        switch (category) {
            case 'MARKETING': return 'cat-marketing';
            case 'UTILITY': return 'cat-utility';
            case 'AUTHENTICATION': return 'cat-auth';
            default: return '';
        }
    };

    // Unified Filter logic for Category AND Status
    const filteredTemplates = templates.filter(t => {
        const matchesCategory = activeTab === 'All' || t.category === activeTab.toUpperCase();
        const matchesStatus = activeStatus === 'All' || t.status === activeStatus.toUpperCase();
        return matchesCategory && matchesStatus;
    });

    // Helper to parse {{variable}} and style them green
    const renderParsedBody = (text) => {
        if (!text) return null;
        const parts = text.split(/(\{\{[^}]+\}\})/g);
        return parts.map((part, index) => {
            if (part.startsWith('{{') && part.endsWith('}}')) {
                return <span key={index} className="template-variable">{part}</span>;
            }
            return part;
        });
    };

    return (
        <main className="main-content">

            {/* Header Area */}
            <div className="templates-header-actions">
                <div className="templates-title-area">
                    <h2>Message Templates</h2>
                    <p>Manage, edit, and create pre-approved messages for bulk broadcasting.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="search-bar" style={{ width: '250px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Search templates..." />
                    </div>
                    <button className="btn-primary" onClick={onCreateClick}>+ Create Template</button>
                </div>
            </div>

            {/* Filter Tabs - Dual Groups */}
            <div className="template-tabs" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['All', 'Marketing', 'Utility', 'Authentication'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    {['All', 'Approved', 'Pending', 'Rejected'].map(status => (
                        <button
                            key={status}
                            className={`tab-btn ${activeStatus === status ? 'active' : ''}`}
                            style={{
                                borderColor: activeStatus === status ? 'var(--brand-purple)' : 'transparent',
                                borderStyle: 'solid',
                                borderWidth: '1px'
                            }}
                            onClick={() => setActiveStatus(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Templates Grid */}
            <div className="templates-grid">
                {filteredTemplates.map(template => (
                    <div className="template-card" key={template.id} onClick={() => openSendModal(template)} style={{ cursor: 'pointer' }}>

                        <div className="template-card-header">
                            <div>
                                <h4 className="template-name">{template.name}</h4>
                                <div className="template-lang">{template.language}</div>
                            </div>
                            <span className={`status-badge ${getStatusClass(template.status)}`}>
                                {template.status}
                            </span>
                        </div>

                        <div>
                            <span className={`category-label ${getCategoryClass(template.category)}`}>
                                {template.category}
                            </span>
                        </div>

                        <div className="whatsapp-preview-container">
                            <div className="message-bubble">
                                {renderParsedBody(template.body)}
                            </div>
                        </div>

                        <div className="template-card-footer">
                            <span className="last-updated">Updated: {template.updatedAt}</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn-icon" title="Copy Template">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                </button>
                                <button className="btn-icon" title="Edit Template">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* --- REDESIGNED SEND MODAL (Progressive Disclosure) --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        {showSuccess && (
                            <div className="success-overlay">
                                <div className="success-check-icon">✓</div>
                                <h2 style={{ margin: 0, color: 'var(--text-dark)' }}>Message Sent!</h2>
                                <p style={{ color: 'var(--text-muted)' }}>Your template has been broadcast successfully.</p>
                            </div>
                        )}

                        <div className="modal-header">
                            <h3 className="modal-title">Send {selectedTemplate?.name}</h3>
                            <button className="close-x" onClick={closeSendModal}>×</button>
                        </div>

                        <div className="modal-content">
                            {/* Step 1: Popup Choice */}
                            <div className="step-section">
                                <label className="sub-step-label">Select Audience</label>
                                <div className="audience-choice-grid">
                                    <button
                                        className={`choice-btn ${audienceType === 'B2B' ? 'active' : ''}`}
                                        onClick={() => handleAudienceToggle('B2B')}
                                    >
                                        <div className="choice-icon">🏢</div>
                                        <span className="choice-label">B2B</span>
                                    </button>
                                    <button
                                        className={`choice-btn ${audienceType === 'B2C' ? 'active' : ''}`}
                                        onClick={() => handleAudienceToggle('B2C')}
                                    >
                                        <div className="choice-icon">👨‍🎓</div>
                                        <span className="choice-label">B2C</span>
                                    </button>
                                </div>
                            </div>

                            {/* Step 2: Custom Multi-Select Dropdown (only for B2C) */}
                            {audienceType === 'B2C' && (
                                <div className="step-section">
                                    <label className="sub-step-label">Select Courses</label>
                                    <div className="custom-multi-select">
                                        <div
                                            className={`multi-select-header ${isCourseDropdownOpen ? 'open' : ''}`}
                                            onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                                        >
                                            <div className="selected-summary">
                                                {selectedCourses.length === 0
                                                    ? 'Choose courses...'
                                                    : selectedCourses.length === 1
                                                        ? selectedCourses[0]
                                                        : `${selectedCourses[0]} + ${selectedCourses.length - 1} more`}
                                            </div>
                                            <div className="dropdown-arrow">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                            </div>
                                        </div>

                                        {isCourseDropdownOpen && (
                                            <div className="dropdown-list-container">
                                                {COURSES.map(course => (
                                                    <div
                                                        key={course}
                                                        className={`dropdown-item ${selectedCourses.includes(course) ? 'selected' : ''}`}
                                                        onClick={() => {
                                                            const newCourses = selectedCourses.includes(course)
                                                                ? selectedCourses.filter(c => c !== course)
                                                                : [...selectedCourses, course];
                                                            setSelectedCourses(newCourses);
                                                        }}
                                                    >
                                                        <div className={`custom-checkbox-mini ${selectedCourses.includes(course) ? 'checked' : ''}`}>
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                        </div>
                                                        <span className="item-label">{course}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Contacts Table (Immediately for B2B, or after Course selection for B2C) */}
                            {(audienceType === 'B2B' || (audienceType === 'B2C' && selectedCourses.length > 0)) && (
                                <div className="step-section">
                                    <label className="sub-step-label">Select Contacts</label>
                                    <div className="contact-list-box table-wrapper">
                                        <table className={`audience-table ${audienceType === 'B2B' ? 'b2b-mode' : 'b2c-mode'}`}>
                                            <thead>
                                                <tr>
                                                    <th className="col-check">
                                                        <div 
                                                            className={`custom-checkbox ${selectedContacts.size === (audienceType === 'B2B' ? B2B_CONTACTS.length : B2C_CONTACTS.length) && selectedContacts.size > 0 ? 'checked' : ''}`}
                                                            onClick={toggleSelectAll}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                        </div>
                                                    </th>
                                                    <th className="col-company">
                                                        {audienceType === 'B2B' ? 'Company' : 'Name'}
                                                    </th>
                                                    {audienceType === 'B2B' && <th className="col-person">Contact Person</th>}
                                                    <th className="col-phone">Phone Number</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(audienceType === 'B2B' ? B2B_CONTACTS : B2C_CONTACTS).map(contact => (
                                                    <tr
                                                        key={contact.id}
                                                        className={`table-row ${selectedContacts.has(contact.id) ? 'selected' : ''}`}
                                                        onClick={() => toggleContact(contact.id)}
                                                    >
                                                        <td className="col-check">
                                                            <div className={`custom-checkbox ${selectedContacts.has(contact.id) ? 'checked' : ''}`}>
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                            </div>
                                                        </td>
                                                        <td className="col-company col-primary-text">{audienceType === 'B2B' ? contact.company : contact.name}</td>
                                                        {audienceType === 'B2B' && <td className="col-person col-secondary-text">{contact.name}</td>}
                                                        <td className="col-phone col-mono">{contact.phone}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Campaign Name (Only for 2+ contacts) */}
                            {selectedContacts.size > 1 && (
                                <div className="step-section campaign-name-section">
                                    <label className="sub-step-label">Campaign Name</label>
                                    <input
                                        type="text"
                                        className="campaign-name-input"
                                        placeholder="e.g., Ugadi Promo Campaign"
                                        value={campaignName}
                                        onChange={(e) => setCampaignName(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="modal-footer-fixed">
                            <button className="btn-secondary" onClick={closeSendModal}>Cancel</button>
                            <button
                                className="btn-send-main"
                                disabled={selectedContacts.size === 0 || (selectedContacts.size > 1 && !campaignName.trim())}
                                onClick={handleSend}
                            >
                                {selectedContacts.size > 1
                                    ? `Launch Campaign (${selectedContacts.size} contacts)`
                                    : `Send to ${selectedContacts.size} contact`
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default TemplatesView;