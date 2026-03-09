import '@servicenow/sdk/global';
import { Acl } from '@servicenow/sdk/core';
import { insuranceUserRole } from './roles.now.ts';

// ACL for insurance portal REST API
export const insuranceApiAcl = Acl({
    $id: Now.ID['insurance-api-acl'],
    name: 'insurance_portal_api',
    type: 'rest_endpoint',
    operation: 'execute',
    active: true,
    description: 'Controls access to insurance portal API',
    roles: [insuranceUserRole],
    adminOverrides: true
});

// ACL for insurance portal UI page
export const insurancePortalAcl = Acl({
    $id: Now.ID['insurance-portal-acl'],
    name: 'insurance_portal_page',
    type: 'ui_page',
    operation: 'execute',
    active: true,
    description: 'Controls access to insurance portal page',
    roles: [insuranceUserRole],
    adminOverrides: true
});