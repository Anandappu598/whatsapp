import React, { useState, useEffect } from 'react';
import { getContacts, createContact, getApiErrorMessage } from '../api';
import Toast from '../components/Toast';

const ContactsView = () => {
    // Stateful contact list from API
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newCategory, setNewCategory] = useState('B2C');

    // Fetch contacts from backend
    useEffect(() => {
        const loadContacts = async () => {
            try {
                setLoading(true);
                const data = await getContacts();
                setContacts(data);
                setError(null);
            } catch (err) {
                const errorMsg = getApiErrorMessage(err, 'Failed to load contacts');
                setError(errorMsg);
                setToast({ type: 'error', message: errorMsg });
            } finally {
                setLoading(false);
            }
        };
        loadContacts();
    }, []);

    const handleAddContact = async () => {
        if (!newName.trim() || !newPhone.trim()) {
            setToast({ type: 'error', message: 'Both Name and Phone Number are required.' });
            return;
        }

        // Check for duplicates locally
        const exists = contacts.some(c => c.phone_number === newPhone.trim());
        if (exists) {
            setToast({ type: 'error', message: 'Contact with this phone number already exists.' });
            return;
        }

        try {
            const newContact = {
                name: newName.trim(),
                phone_number: newPhone.trim(),
                category: newCategory,
                language: 'en',
                attributes: { language: 'en', name: newName.trim(), phone: newPhone.trim() },
                broadcast: true,
                sms: true
            };

            const createdContact = await createContact(newContact);
            setContacts([createdContact, ...contacts]);
            setShowAddModal(false);
            setNewName('');
            setNewPhone('');
            setToast({ type: 'success', message: 'Contact added successfully!' });
        } catch (err) {
            const errorMsg = getApiErrorMessage(err, 'Failed to add contact');
            setToast({ type: 'error', message: errorMsg });
        }
    };

    return (
        <div style={{ padding: '24px', background: 'var(--surface-white)', borderRadius: '24px', minHeight: '100%', position: 'relative' }}>
            {/* Toast Notification */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Loading State */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                    <h3>Loading contacts...</h3>
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-error)' }}>
                    <h3>Error loading contacts</h3>
                    <p>{error}</p>
                </div>
            ) : (
            <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Contacts</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                        Contact list stores the list of numbers that you've interacted with.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    style={{
                        background: '#10B981',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <span style={{ fontSize: '18px' }}>+</span> Add Contact
                </button>
            </div>

            {/* Table Header */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 3fr 1.5fr 1fr 1fr 1fr 1fr',
                padding: '16px 24px',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '13px',
                fontWeight: '800',
                color: 'var(--text-muted)'
            }}>
                <span>Basic Info</span>
                <span>Contact Attributes</span>
                <span>Created Date</span>
                <span>Category</span>
                <span style={{ textAlign: 'center' }}>Broadcast</span>
                <span style={{ textAlign: 'center' }}>SMS</span>
                <span style={{ textAlign: 'right' }}>Edit/Delete</span>
            </div>

            {/* Table Body */}
            <div style={{ overflowY: 'auto' }}>
                {contacts.map(contact => (
                    <div
                        key={contact.id}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 3fr 1.5fr 1fr 1fr 1fr 1fr',
                            padding: '20px 24px',
                            borderBottom: '1px solid var(--border-color)',
                            alignItems: 'center',
                            fontSize: '14px',
                            transition: 'background 0.2s'
                        }}
                    >
                        {/* Basic Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{contact.name}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{contact.phone_number}</span>
                        </div>

                        {/* Contact Attributes */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {Object.entries(contact.attributes).map(([key, value]) => (
                                <div
                                    key={key}
                                    style={{
                                        background: 'var(--surface-soft)',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        border: '1px solid var(--input-border)'
                                    }}
                                >
                                    <span style={{ color: 'var(--text-muted)', fontWeight: '700' }}>{key}:</span>
                                    <span style={{ color: 'var(--text-dark)', fontWeight: '600' }}>{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Created Date */}
                        <div style={{ color: 'var(--text-muted)', fontWeight: '600' }}>
                            {new Date(contact.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).replace(/ /g, '-')}
                        </div>

                        {/* Category */}
                        <div>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '800',
                                background: contact.category === 'B2B' ? '#F4F0FF' : '#E0F2FE',
                                color: contact.category === 'B2B' ? '#7551FF' : '#0369A1'
                            }}>
                                {contact.category}
                            </span>
                        </div>

                        {/* Broadcast */}
                        <div style={{ textAlign: 'center', color: '#10B981', fontSize: '18px' }}>
                            {contact.broadcast ? '✓' : ''}
                        </div>

                        {/* SMS */}
                        <div style={{ textAlign: 'center', color: '#10B981', fontSize: '18px' }}>
                            {contact.sms ? '✓' : ''}
                        </div>

                        {/* Edit/Delete */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>✎</button>
                            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444' }}>🗑</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Placeholder */}
            <div style={{
                marginTop: '32px',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '16px',
                fontSize: '13px',
                color: 'var(--text-muted)'
            }}>
                <span>Rows per page: </span>
                <select style={{ border: 'none', background: 'transparent', fontWeight: '700' }}>
                    <option>5</option>
                    <option>10</option>
                </select>
                <span>{`1-${contacts.length} of ${contacts.length}`}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>← Previous</button>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>Next →</button>
                </div>
            </div>

            {/* Add Contact Modal (Works like Inbox) */}
            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'var(--surface-white)',
                        width: '320px',
                        padding: '32px',
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Add New Contact</h3>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Contact Name</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--input-border)', outline: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Phone Number</label>
                            <input
                                type="text"
                                placeholder="+1 234 567 8900"
                                value={newPhone}
                                onChange={(e) => setNewPhone(e.target.value)}
                                style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--input-border)', outline: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Category</label>
                            <select
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--input-border)', outline: 'none', background: 'var(--surface-white)' }}
                            >
                                <option value="B2C">B2C Student</option>
                                <option value="B2B">B2B Client</option>
                            </select>
                        </div>

                        <button
                            onClick={handleAddContact}
                            style={{
                                background: '#7551FF',
                                color: 'white',
                                border: 'none',
                                padding: '14px',
                                borderRadius: '14px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            + Add New Contact
                        </button>

                        <button
                            onClick={() => setShowAddModal(false)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            </>
            )}
        </div>
    );
};

export default ContactsView;
