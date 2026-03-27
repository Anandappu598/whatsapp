import React, { useState, useEffect } from 'react';
import '../styles/b2c_view.css';
import { getCourses, getEnrollments, getApiErrorMessage } from '../api';
import Toast from '../components/Toast';

const B2CView = () => {
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [coursesData, enrollmentsData] = await Promise.all([
                    getCourses(),
                    getEnrollments()
                ]);
                setCourses(coursesData);
                setEnrollments(enrollmentsData);
                setError(null);
            } catch (err) {
                const errorMsg = getApiErrorMessage(err, 'Failed to load courses');
                setError(errorMsg);
                setToast({ type: 'error', message: errorMsg });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Calculate stats from data
    const stats = {
        activeStudents: enrollments.filter(e => e.status !== 'DROPPED').length,
        hoursWatched: Math.floor(enrollments.length * 45), // Placeholder calculation
        avgCompletion: Math.round(enrollments.reduce((sum, e) => sum + e.completion_percentage, 0) / (enrollments.length || 1))
    };

    return (
        <main className="main-content">
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
                    <h3>Loading B2C data...</h3>
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-error)' }}>
                    <h3>Error loading B2C data</h3>
                    <p>{error}</p>
                </div>
            ) : (
            <>
            {/* Search & Action Bar */}
            <div className="b2c-header-actions">
                <div className="search-bar search-bar-flex">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Search courses, mentors, or topics..." />
                </div>
                <button className="btn-primary">
                    Explore Catalog
                </button>
            </div>

            {/* B2C Metric Pills */}
            <div className="b2c-stats-row stats-row">
                <div className="stat-pill">
                    <div className="stat-icon" style={{ background: 'var(--surface-soft)', color: 'var(--brand-purple)' }}>🎓</div>
                    <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Active Students</div>
                        <div style={{ fontWeight: '800', fontSize: '18px' }}>{stats.activeStudents}</div>
                    </div>
                </div>
                <div className="stat-pill">
                    <div className="stat-icon" style={{ background: 'var(--brand-purple-light)', color: 'var(--brand-purple)' }}>⏱️</div>
                    <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Hours Watched</div>
                        <div style={{ fontWeight: '800', fontSize: '18px' }}>{stats.hoursWatched}</div>
                    </div>
                </div>
                <div className="stat-pill">
                    <div className="stat-icon" style={{ background: 'var(--surface-soft)', color: '#10B981' }}>🏆</div>
                    <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Avg. Completion</div>
                        <div style={{ fontWeight: '800', fontSize: '18px' }}>{stats.avgCompletion}%</div>
                    </div>
                </div>
            </div>

            {/* Courses Section */}
            <div className="course-section-header">
                <h3 className="course-section-title">Continue Watching</h3>
                <button className="btn-filter">View All ➔</button>
            </div>

            {/* FLEXBOX CONTAINER FOR COURSES */}
            <div className="course-flex-container">

                {/* Course Card 1: Front End */}
                <div className="course-card">
                    <img
                        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80"
                        alt="Coding on laptop"
                        className="course-image"
                    />
                    <span className="course-category-badge badge-frontend">✨ Front End</span>
                    <h4 className="course-title">Beginner's Guide to Becoming a Professional Front-End Developer</h4>

                    <div className="course-footer">
                        <div className="mentor-info">
                            <div className="avatar" style={{ width: '32px', height: '32px' }}>LS</div>
                            <div>
                                <div className="mentor-name">Leonardo Samsul</div>
                                <div className="mentor-title">Mentor</div>
                            </div>
                        </div>
                        <button className="btn-start-course">➔</button>
                    </div>
                </div>

                {/* Course Card 2: UI/UX */}
                <div className="course-card">
                    <img
                        src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80"
                        alt="UI Design sketching"
                        className="course-image"
                    />
                    <span className="course-category-badge badge-uiux">🛠 UI/UX Design</span>
                    <h4 className="course-title">Optimizing User Experience with the Best UI/UX Design Practices</h4>

                    <div className="course-footer">
                        <div className="mentor-info">
                            <div className="avatar" style={{ width: '32px', height: '32px' }}>BS</div>
                            <div>
                                <div className="mentor-name">Bayu Salto</div>
                                <div className="mentor-title">Mentor</div>
                            </div>
                        </div>
                        <button className="btn-start-course">➔</button>
                    </div>
                </div>

                {/* Course Card 3: Branding */}
                <div className="course-card">
                    <img
                        src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=500&q=80"
                        alt="Branding materials"
                        className="course-image"
                    />
                    <span className="course-category-badge badge-branding">🎨 Branding</span>
                    <h4 className="course-title">Reviving and Refreshing Your Company Brand Image</h4>

                    <div className="course-footer">
                        <div className="mentor-info">
                            <div className="avatar" style={{ width: '32px', height: '32px' }}>PS</div>
                            <div>
                                <div className="mentor-name">Padhang Satrio</div>
                                <div className="mentor-title">Mentor</div>
                            </div>
                        </div>
                        <button className="btn-start-course">➔</button>
                    </div>
                </div>

            </div>
            </>
            )}
        </main>
    );
};

export default B2CView;
