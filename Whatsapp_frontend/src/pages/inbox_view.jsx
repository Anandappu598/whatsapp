import React, { useState, useRef } from 'react';
import '../styles/inbox_view.css';

const InboxView = () => {
    // Dummy data for the chat list
    const [chats, setChats] = useState([
        {
            id: 1,
            name: 'Michael Chen',
            phone: '917676083350',
            avatar: 'MC',
            lastMessage: 'Thanks, the front-end course looks great!',
            time: '10:42 AM',
            unread: 2,
            messages: [
                { id: 101, text: 'Hi! I just purchased the beginner UI/UX bundle.', sender: 'received', time: '10:30 AM' },
                { id: 102, text: 'Hello Michael! Thank you for your purchase. You can access it from your dashboard.', sender: 'sent', time: '10:35 AM' },
                { id: 103, text: 'Thanks, the front-end course looks great!', sender: 'received', time: '10:42 AM' }
            ]
        },
        {
            id: 2,
            name: 'Sarah Jenkins',
            phone: '12025550192',
            avatar: 'SJ',
            lastMessage: 'Can we reschedule the B2B onboarding?',
            time: '09:15 AM',
            unread: 0,
            messages: [
                { id: 201, text: 'Hi team, is it possible to push our meeting to Thursday?', sender: 'received', time: '09:10 AM' },
                { id: 202, text: 'Can we reschedule the B2B onboarding?', sender: 'received', time: '09:15 AM' }
            ]
        },
        {
            id: 3,
            name: 'Logistics Pro Inc.',
            phone: '18005550101',
            avatar: 'LP',
            lastMessage: 'The new API credentials work perfectly.',
            time: 'Yesterday',
            unread: 0,
            messages: [
                { id: 301, text: 'Here are your updated webhook keys.', sender: 'sent', time: 'Yesterday 4:00 PM' },
                { id: 302, text: 'The new API credentials work perfectly.', sender: 'received', time: 'Yesterday 4:45 PM' }
            ]
        }
    ]);

    const [activeChatId, setActiveChatId] = useState(chats[0].id);
    const [inputText, setInputText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showContactPanel, setShowContactPanel] = useState(false);
    const [showAddContact, setShowAddContact] = useState(false);
    const [newContactName, setNewContactName] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');
    const [newContactCategory, setNewContactCategory] = useState('B2B');
    const fileInputRef = useRef(null);

    // Find the currently selected chat object
    const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: inputText,
            sender: 'sent',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedChats = chats.map(chat => {
            if (chat.id === activeChatId) {
                return {
                    ...chat,
                    lastMessage: inputText,
                    messages: [...chat.messages, newMessage]
                };
            }
            return chat;
        });

        setChats(updatedChats);
        setInputText('');

        // Optional: Simulate a response
        setTimeout(() => {
            const responseMessage = {
                id: Date.now() + 1,
                text: "Thanks for your message! Our team will get back to you shortly.",
                sender: 'received',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setChats(prevChats => prevChats.map(chat => {
                if (chat.id === activeChatId) {
                    return {
                        ...chat,
                        lastMessage: responseMessage.text,
                        messages: [...chat.messages, responseMessage]
                    };
                }
                return chat;
            }));
        }, 1500);
    };

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAttachClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            alert(`Selected file: ${file.name}`);
        }
    };

    const handleAddContact = (e) => {
        e.preventDefault();
        if (!newContactName.trim() || !newContactPhone.trim()) {
            alert('Please fill in all fields');
            return;
        }

        // Check for duplicates based on phone number
        const duplicate = chats.find(c => c.phone === newContactPhone);
        if (duplicate) {
            alert('Contact already exists with this phone number!');
            return;
        }

        const newChat = {
            id: Date.now(),
            name: newContactName,
            phone: newContactPhone,
            category: newContactCategory,
            avatar: newContactName.substring(0, 2).toUpperCase(),
            lastMessage: 'New contact added',
            time: 'Just now',
            unread: 0,
            messages: []
        };

        setChats([newChat, ...chats]);
        setNewContactName('');
        setNewContactPhone('');
        setNewContactCategory('B2B');
        setShowAddContact(false);
    };

    return (
        <div className="inbox-wrapper" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--text-dark)' }}>Inbox</h2>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-gray)', fontSize: '14px' }}>Manage customer conversations and support tickets.</p>
            </div>

            <div className={`inbox-layout ${showContactPanel ? 'panel-open' : ''}`}>

                {/* LEFT PANE: Chat List */}
                <aside className="chat-sidebar">
                    <div className="chat-sidebar-header">
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                            <div className="search-bar" style={{ flexGrow: 1, background: 'var(--bg-main)', borderRadius: '12px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-gray)" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input
                                    type="text"
                                    placeholder="Search messages..."
                                    style={{ background: 'transparent', color: 'var(--text-dark)', border: 'none', width: '100%', outline: 'none' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                className="add-contact-btn"
                                onClick={() => setShowAddContact(true)}
                                title="Add New Contact"
                                style={{ background: '#7551FF', color: 'white', border: 'none', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="chat-list-container">
                        {filteredChats.map(chat => (
                            <div
                                key={chat.id}
                                className={`chat-list-item ${activeChatId === chat.id ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveChatId(chat.id);
                                }}
                            >
                                <div className="chat-item-avatar">{chat.avatar}</div>
                                <div className="chat-item-details">
                                    <div className="chat-item-header">
                                        <span className="chat-item-name">{chat.name}</span>
                                        <span className="chat-item-time">{chat.time}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span className="chat-item-preview">{chat.lastMessage}</span>
                                        {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* RIGHT PANE: Chat Window */}
                <section className="chat-window">
                    {/* Header */}
                    <div className="chat-window-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {/* Profile Info (Clickable to open panel) */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginRight: '20px' }} onClick={() => setShowContactPanel(!showContactPanel)}>
                                <div className="chat-item-avatar" style={{ width: '40px', height: '40px' }}>{activeChat.avatar}</div>
                                <div>
                                    <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-dark)' }}>{activeChat.name}</div>
                                    <div style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>● Online</div>
                                </div>
                            </div>

                            {/* Bot Status */}
                            <div className="header-status-item">
                                <div className="bot-avatar-header">B</div>
                                <div className="status-meta">
                                    <span className="status-label">Bot</span>
                                    <span className="status-value">Available</span>
                                </div>
                            </div>

                            {/* User Selector Dropdown */}
                            <div className="header-dropdown">
                                <select className="minimal-select">
                                    <option>Select User</option>
                                    <option>pugal</option>
                                    <option>shree</option>
                                    <option>RS</option>
                                </select>
                            </div>
                        </div>

                        {/* Action Icons */}
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div className="header-dropdown">
                                <select className="minimal-select status-select">
                                    <option>Submit As</option>
                                    <option>open</option>
                                    <option>pending</option>
                                    <option>solved</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Chat History */}
                    <div className="chat-history">
                        {activeChat.messages.map(msg => (
                            <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                                <div className="message-bubble">
                                    {msg.text}
                                </div>
                                <div className="message-time">{msg.time}</div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="chat-input-area">
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />

                        <input
                            type="text"
                            className="chat-input-field"
                            placeholder="Type a message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />

                        <div className="input-actions">
                            <button className="btn-icon" onClick={handleAttachClick} title="Attach">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                            </button>
                            <button className="btn-icon" title="Emoji">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                            </button>
                            <button className="btn-icon" title="Templates">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                            </button>
                            <button className="btn-icon" title="Bot">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
                            </button>
                            <button className="btn-send" onClick={handleSendMessage}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polyline points="22 2 15 22 11 13 1 9 22 2"></polyline></svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* CONTACT PANEL */}
                <aside className={`contact-panel ${showContactPanel ? 'open' : ''}`}>
                    {showContactPanel && (
                        <>
                            <div className="panel-header">
                                <div className="panel-user-info">
                                    <div className="chat-item-avatar large">{activeChat.avatar}</div>
                                    <div className="panel-user-meta">
                                        <h3>{activeChat.name}</h3>
                                        <span className="online-status">Available</span>
                                    </div>
                                </div>
                                <div className="panel-header-actions">
                                    <button className="close-panel" onClick={() => setShowContactPanel(false)}>×</button>
                                </div>
                            </div>

                            <div className="panel-content">
                                <div className="section">
                                    <h4 className="section-title">Basic Information</h4>
                                    <div className="info-row">
                                        <label>Phone Number : </label>
                                        <span className="info-value">{activeChat.phone || '917676083350'}</span>
                                    </div>
                                </div>

                                <div className="section">
                                    <div className="section-header">
                                        <h4 className="section-title">Contact custom parameters</h4>
                                        <button className="edit-btn">✎</button>
                                    </div>
                                    <div className="param-list">
                                        <div className="param-item">
                                            <span className="param-key">language</span>
                                            <span className="param-value">en</span>
                                            <button className="del-btn">×</button>
                                        </div>
                                        <div className="param-item">
                                            <span className="param-key">name</span>
                                            <span className="param-value">{activeChat.name}</span>
                                            <button className="del-btn">×</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="section">
                                    <h4 className="section-title">Tags</h4>
                                    <div className="tag-input-container">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                                            <input type="text" placeholder="Add a tag" style={{ flexGrow: 1, border: 'none', outline: 'none' }} />
                                        </div>
                                        <button className="tag-add-btn">Add</button>
                                    </div>
                                </div>

                                <div className="section">
                                    <div className="section-header">
                                        <h4 className="section-title">Notes</h4>
                                        <button className="add-btn">+</button>
                                    </div>
                                    <p className="notes-placeholder">Notes help you to keep track of your conversation with your team</p>
                                </div>
                            </div>
                        </>
                    )}
                </aside>

                {/* ADD CONTACT MODAL */}
                {showAddContact && (
                    <div className="modal-overlay">
                        <div className="contact-modal">
                            <div className="modal-header">
                                <h3>Add New Contact</h3>
                                <button className="close-panel" onClick={() => setShowAddContact(false)}>×</button>
                            </div>
                            <form className="modal-form" onSubmit={handleAddContact}>
                                <div className="form-group">
                                    <label>Contact Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={newContactName}
                                        onChange={(e) => setNewContactName(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        placeholder="+1 234 567 8900"
                                        value={newContactPhone}
                                        onChange={(e) => setNewContactPhone(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={newContactCategory}
                                        onChange={(e) => setNewContactCategory(e.target.value)}
                                        required
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-white)', color: 'var(--text-dark)', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                                    >
                                        <option value="B2B">B2B</option>
                                        <option value="B2C">B2C</option>
                                    </select>
                                </div>
                                <div className="modal-actions">
                                    <button type="submit" className="primary-btn full-width" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                        Add New Contact
                                    </button>
                                    <button type="button" className="secondary-btn-text" onClick={() => setShowAddContact(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InboxView;