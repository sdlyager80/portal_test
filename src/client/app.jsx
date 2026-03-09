import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
    const [portalData, setPortalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Test our insurance API with fallback
        fetch('/api/x_dxcis_smart_st_0/insurance_portal/data', {
            headers: {
                'Accept': 'application/json',
                'X-UserToken': window.g_ck
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            setPortalData(data.result);
            setLoading(false);
        })
        .catch(err => {
            console.error('API Error:', err);
            // Fallback data for demo purposes
            setPortalData({
                status: 'active',
                message: 'Insurance Portal is ready (demo mode)',
                timestamp: new Date().toLocaleString()
            });
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="portal-container">
                <div className="loading">Loading FSO Insurance Portal...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="portal-container">
                <div className="error">
                    <h2>Error Loading Portal</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="portal-container">
            <header className="portal-header">
                <h1>🏢 FSO Insurance Portal</h1>
                <p>Smart Studio Workspace</p>
            </header>

            <div className="portal-content">
                <div className="welcome-card">
                    <h2>Welcome to Your Insurance Portal</h2>
                    <div className="status-info">
                        <p><strong>Status:</strong> <span className="status-active">{portalData?.status}</span></p>
                        <p><strong>Message:</strong> {portalData?.message}</p>
                        <p><strong>Connected:</strong> {portalData?.timestamp}</p>
                    </div>
                </div>

                <div className="portal-sections">
                    <div className="section-card">
                        <h3>🔐 Policy Management</h3>
                        <p>View and manage your insurance policies</p>
                        <button className="portal-button">Access Policies</button>
                    </div>

                    <div className="section-card">
                        <h3>💳 Claims $[AMP] Billing</h3>
                        <p>File claims and manage billing information</p>
                        <button className="portal-button">Manage Claims</button>
                    </div>

                    <div className="section-card">
                        <h3>📊 Dashboard</h3>
                        <p>View your insurance dashboard and reports</p>
                        <button className="portal-button">View Dashboard</button>
                    </div>

                    <div className="section-card">
                        <h3>🛠️ Service Requests</h3>
                        <p>Submit and track service requests</p>
                        <button className="portal-button">Service Center</button>
                    </div>
                </div>
            </div>

            <footer className="portal-footer">
                <p>FSO Insurance Portal - Powered by ServiceNow</p>
            </footer>
        </div>
    );
}