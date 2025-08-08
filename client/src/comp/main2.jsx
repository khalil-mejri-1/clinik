import React from 'react';

const features = [
  {
    icon: <i className="pi pi-user-plus" style={{ fontSize: "3rem", marginBottom: "10px", color: "#3b82f6" }}></i>,
    title: 'Easy Registration',
    description: 'Simple, intuitive patient registration form that captures all essential information quickly and accurately.',
    className: 'feature-box blue-bg',
  },
  {
    icon: <i className="pi pi-users" style={{ fontSize: "3rem", marginBottom: "10px", color: "#10b981" }}></i>,
    title: 'Patient Management',
    description: 'Comprehensive dashboard for nurses to view, edit, and manage all patient records efficiently.',
    className: 'feature-box green-bg',
  },
  {
    icon: <i className="pi pi-shield" style={{ fontSize: "3rem", marginBottom: "10px", color: "#8b5cf6" }}></i>,
    title: 'Secure Access',
    description: 'Role-based authentication ensures only authorized healthcare staff can access patient data.',
    className: 'feature-box purple-bg',
  },
];


const Main2 = () => {
  return (
    <div className="healthcare-container">
      <h2>Efficient Healthcare Management</h2>
      <p className="subtitle">
        Our digital system replaces paper-based registration with a modern, secure solution
      </p>
      <div className="features-grid">
        {features.map((feature, idx) => (
          <div key={idx} className={feature.className}>
            <div className="icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main2;
