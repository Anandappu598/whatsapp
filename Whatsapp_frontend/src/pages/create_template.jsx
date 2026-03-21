import React, { useState } from 'react';
import '../styles/create_template.css';

const CreateTemplate = ({ onAddTemplate, onCancel }) => {
    // State for the template data
    const [templateName, setTemplateName] = useState('');
    const [category, setCategory] = useState('MARKETING');
    const [bodyText, setBodyText] = useState('Hello {{1}}, welcome to Merida! We are thrilled to have you.');
    const [footerText, setFooterText] = useState('Reply STOP to opt out.');
    const [buttonText, setButtonText] = useState('Visit Website');

    // Function to insert a variable {{1}}, {{2}}, etc. into the text area
    const addVariable = () => {
        // Basic logic to find the next number to insert
        const matches = bodyText.match(/\{\{(\d+)\}\}/g);
        const nextNum = matches ? matches.length + 1 : 1;
        setBodyText(bodyText + ` {{${nextNum}}}`);
    };

    const handleSubmit = () => {
        if (!templateName) {
            alert('Please enter a template name');
            return;
        }
        onAddTemplate({
            name: templateName,
            category: category,
            body: bodyText,
            footer: footerText,
            button: buttonText
        });
    };

    return (
        <main className="main-content">
            {/* Header Actions */}
            <div className="b2c-header-actions" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '24px' }}>Create Message Template</h2>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-gray)', fontSize: '14px' }}>Build and submit templates for Meta approval.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onCancel}
                        style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-gray)', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={handleSubmit}>Submit for Approval</button>
                </div>
            </div>

            <div className="template-builder-container">

                {/* LEFT COLUMN: Form Editor */}
                <div className="template-form-section">
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Template Details</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Template Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., summer_sale_promo"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value.toLowerCase().replace(/ /g, '_'))}
                            />
                            <span style={{ fontSize: '11px', color: 'var(--text-gray)' }}>Lowercase and underscores only.</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="MARKETING">Marketing</option>
                                <option value="UTILITY">Utility</option>
                                <option value="AUTHENTICATION">Authentication</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--border-color)', margin: '32px 0' }}></div>

                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Message Content</h3>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label">Body Text</label>
                        <textarea
                            className="form-textarea"
                            value={bodyText}
                            onChange={(e) => setBodyText(e.target.value)}
                            placeholder="Enter your message here..."
                        ></textarea>
                        <button className="btn-add-variable" onClick={addVariable}>+ Add Variable {'{{x}}'}</button>
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label">Footer (Optional)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={footerText}
                            onChange={(e) => setFooterText(e.target.value)}
                            placeholder="Short text at the bottom..."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Button: Call to Action (Optional)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            placeholder="e.g., Buy Now"
                        />
                    </div>

                </div>

                {/* RIGHT COLUMN: Live Phone Preview */}
                <div className="template-preview-section">
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', alignSelf: 'flex-start' }}>Live Preview</h3>

                    <div className="phone-mockup">
                        <div className="phone-header">
                            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>T</div>
                            Tecadapt Business
                        </div>

                        <div className="phone-body">
                            <div className="wa-bubble">
                                {/* Render the body text. If it's empty, show a placeholder */}
                                {bodyText || <span style={{ color: 'var(--text-gray)' }}>Message body will appear here...</span>}

                                {/* Render Footer if exists */}
                                {footerText && <div className="wa-footer">{footerText}</div>}
                            </div>

                            {/* Render Button if exists */}
                            {buttonText && <div className="wa-btn">{buttonText}</div>}
                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
};

export default CreateTemplate;