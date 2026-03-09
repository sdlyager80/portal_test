import '@servicenow/sdk/global';
import { Role } from '@servicenow/sdk/core';

// Basic user role for insurance portal access
export const insuranceUserRole = Role({
    $id: Now.ID['insurance-user-role'],
    name: 'x_dxcis_smart_st_0.insurance_user',
    description: 'Basic access to insurance portal'
});

// Admin role for full portal management
export const insuranceAdminRole = Role({
    $id: Now.ID['insurance-admin-role'],
    name: 'x_dxcis_smart_st_0.insurance_admin',
    description: 'Administrative access to insurance portal',
    containsRoles: [insuranceUserRole]
});