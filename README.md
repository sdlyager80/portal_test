# FSO Insurance Portal

A comprehensive React-based portal with Material-UI components for FSO Insurance and BPM core integration, supporting Policy Servicing and Billing service definitions.

## Overview

The FSO Insurance Portal provides a modern, user-friendly interface for managing insurance operations within ServiceNow. Built using React 18.2.0 and Material-UI components, it integrates with existing BPM Core tables and FSO Insurance infrastructure.

## Features

### 📊 Dashboard
- Real-time overview of policy and billing tasks
- Key metrics and statistics
- Recent activity summaries
- Visual progress indicators

### 🏛️ Policy Servicing
- View and manage policy administration tasks
- Create new policy tasks with service definition integration
- Filter and search capabilities
- Priority-based task organization

### 💳 Billing Management
- Comprehensive billing and payment task management
- Integration with billing service definitions
- Task creation and tracking
- Consumer-based filtering

## Architecture

### Frontend Components
- **React 18.2.0** with Material-UI design system
- **Single Page Application (SPA)** with tabbed navigation
- **Responsive design** optimized for desktop and mobile
- **Real-time data updates** with error handling

### Backend Services
- **Scripted REST APIs** for data integration
- **BPM Core integration** (x_dxcis_bpm_core_policy_administration, x_dxcis_bpm_core_billing_payment)
- **Service Definition support** for policy and billing operations
- **Error handling and logging** throughout all endpoints

### Security Model
- **Role-based access control** with custom roles:
  - `x_dxcis_smart_st_0.fso_portal_user` - Basic access
  - `x_dxcis_smart_st_0.fso_portal_admin` - Administrative access
- **Access Control Lists (ACLs)** protecting:
  - REST API endpoints
  - UI Page access
  - Table operations (read/create)

## API Endpoints

Base URL: `/api/x_dxcis_smart_st_0/fso_insurance_portal`

### Policy Operations
- `POST /policies` - Retrieve policy administration records
- `POST /policies/create` - Create new policy tasks

### Billing Operations  
- `POST /billing` - Retrieve billing and payment records
- `POST /billing/create` - Create new billing tasks

### Service Definitions
- `GET /services/{category}` - Get service definitions by category (policy/billing)

## Installation and Setup

### Prerequisites
- ServiceNow instance with BPM Core application installed
- Smart Studio Workspace scope access
- Administrator privileges for role assignment

### Deployment Steps
1. **Build Application**: The application has been built successfully
2. **Install Dependencies**: React, Material-UI, and ServiceNow SDK dependencies installed
3. **Deploy Security**: Roles and ACLs created for access control
4. **Install Application**: Run the install process to deploy to instance

### Access the Portal
After successful installation, access the portal at:
`https://your-instance.service-now.com/x_dxcis_smart_st_0_fso_insurance_portal.do`

### User Setup
1. **Assign Roles**: Grant users the `x_dxcis_smart_st_0.fso_portal_user` role
2. **Admin Access**: Grant administrators the `x_dxcis_smart_st_0.fso_portal_admin` role
3. **Test Access**: Verify users can access the portal and view data

## Technical Implementation

### File Structure
```
src/
├── client/                 # React frontend
│   ├── components/        # UI components
│   │   ├── Dashboard.jsx
│   │   ├── PolicyServicing.jsx
│   │   └── BillingManagement.jsx
│   ├── services/          # API client services
│   │   └── InsuranceService.js
│   ├── utils/             # Utility functions
│   │   └── fields.js
│   ├── app.jsx            # Main application component
│   ├── app.css            # Application styles
│   ├── index.html         # HTML entry point
│   └── main.jsx           # React bootstrap
├── server/                # Backend services
│   └── insuranceHandler.js # REST API handlers
└── fluent/                # ServiceNow Fluent definitions
    ├── rest-apis/         # API definitions
    ├── ui-pages/          # Page definitions
    └── security/          # Roles and ACLs
```

### Key Technologies
- **React 18.2.0** - Modern UI framework
- **Material-UI 5.14.20** - Component library and design system
- **ServiceNow Fluent DSL** - Infrastructure as code
- **ServiceNow Table API** - Data integration
- **Scripted REST APIs** - Custom backend services

## Future Enhancements

### Claims Integration
The portal is designed to support future Claims functionality:
- FSO Insurance claim tables already identified
- Extensible architecture for additional modules
- Service definition framework ready for claims workflows

### Additional Features
- Advanced reporting and analytics
- Workflow automation integration
- Mobile-optimized responsive design
- Real-time notifications and updates

## Support and Maintenance

### Error Handling
- Comprehensive client-side error boundaries
- Server-side error logging with `gs.error()`
- User-friendly error messages and recovery options

### Performance Optimization
- Efficient data loading with pagination
- Optimized React component rendering
- Minimal API calls with intelligent caching

### Security Considerations
- Role-based access control at all levels
- Input validation and sanitization
- Secure API authentication with ServiceNow tokens

## Troubleshooting

### Common Issues
1. **Access Denied**: Verify user has required roles assigned
2. **Data Not Loading**: Check ACL permissions for target tables
3. **API Errors**: Review server logs for detailed error messages

### Support Resources
- ServiceNow documentation for BPM Core
- React and Material-UI component documentation
- ServiceNow Fluent API reference

---

**Built with ❤️ for FSO Insurance Operations**