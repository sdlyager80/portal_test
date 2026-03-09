import '@servicenow/sdk/global';
import { Acl } from '@servicenow/sdk/core';
import { fsoPortalUserRole } from './roles.now.ts';

// ACL for FSO Insurance Portal REST API
export const fsoInsuranceApiAcl = Acl({
    $id: Now.ID['fso-insurance-api-acl'],
    name: 'fso_insurance_portal_api_access',
    type: 'rest_endpoint',
    operation: 'execute',
    active: true,
    description: 'Controls access to FSO Insurance Portal REST API endpoints',
    roles: [fsoPortalUserRole],
    adminOverrides: true
});

// ACL for FSO Insurance Portal UI Page
export const fsoInsurancePortalPageAcl = Acl({
    $id: Now.ID['fso-insurance-portal-page-acl'],
    name: 'fso_insurance_portal_page_access',
    type: 'ui_page',
    operation: 'execute',
    active: true,
    description: 'Controls access to FSO Insurance Portal UI Page',
    roles: [fsoPortalUserRole],
    adminOverrides: true
});

// ACL for BPM Core Policy Administration table - read access
export const bpmCorePolicyReadAcl = Acl({
    $id: Now.ID['bpm-core-policy-read-acl'],
    type: 'record',
    table: 'x_dxcis_bpm_core_policy_administration',
    field: '*',
    operation: 'read',
    active: true,
    description: 'Read access to BPM Core Policy Administration records via FSO Portal',
    roles: [fsoPortalUserRole],
    adminOverrides: true
});

// ACL for BPM Core Policy Administration table - create access
export const bpmCorePolicyCreateAcl = Acl({
    $id: Now.ID['bpm-core-policy-create-acl'],
    type: 'record',
    table: 'x_dxcis_bpm_core_policy_administration',
    field: '*',
    operation: 'create',
    active: true,
    description: 'Create access to BPM Core Policy Administration records via FSO Portal',
    roles: [fsoPortalUserRole],
    adminOverrides: true
});

// ACL for BPM Core Billing Payment table - read access
export const bpmCoreBillingReadAcl = Acl({
    $id: Now.ID['bpm-core-billing-read-acl'],
    type: 'record',
    table: 'x_dxcis_bpm_core_billing_payment',
    field: '*',
    operation: 'read',
    active: true,
    description: 'Read access to BPM Core Billing Payment records via FSO Portal',
    roles: [fsoPortalUserRole],
    adminOverrides: true
});

// ACL for BPM Core Billing Payment table - create access
export const bpmCoreBillingCreateAcl = Acl({
    $id: Now.ID['bpm-core-billing-create-acl'],
    type: 'record',
    table: 'x_dxcis_bpm_core_billing_payment',
    field: '*',
    operation: 'create',
    active: true,
    description: 'Create access to BPM Core Billing Payment records via FSO Portal',
    roles: [fsoPortalUserRole],
    adminOverrides: true
});