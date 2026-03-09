import React from 'react';
import ReactDOM from 'react-dom/client';

// Simple test component to verify React is working
function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 FSO Insurance Portal Loading...</h1>
      <p>If you can see this message, React is working correctly!</p>
      <p>Portal Status: <strong style={{ color: 'green' }}>Active</strong></p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<TestApp />);