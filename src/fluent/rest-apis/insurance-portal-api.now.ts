import '@servicenow/sdk/global';
import { RestApi } from '@servicenow/sdk/core';
import { 
    getPolicies,
    getBillingRecords,
    getServiceDefinitions,
    createPolicyTask,
    createBillingTask
} from '../../server/insuranceHandler.js';
import { fsoInsuranceApiAcl } from '../security/acls.now.ts';

export const insurancePortalApi = RestApi({
    $id: Now.ID['insurance-portal-api'],
    name: 'FSO Insurance Portal API',
    serviceId: 'fso_insurance_portal',
    shortDescription: 'API for FSO Insurance Portal operations including policy servicing and billing',
    active: true,
    enforceAcl: [fsoInsuranceApiAcl],
    routes: [
        {
            $id: Now.ID['get-policies'],
            name: 'Get Policies',
            path: '/policies',
            method: 'POST',
            script: getPolicies,
            shortDescription: 'Retrieve policy administration records with filtering support'
        },
        {
            $id: Now.ID['get-billing'],
            name: 'Get Billing Records',
            path: '/billing',
            method: 'POST',
            script: getBillingRecords,
            shortDescription: 'Retrieve billing and payment records with filtering support'
        },
        {
            $id: Now.ID['get-services'],
            name: 'Get Service Definitions',
            path: '/services/{category}',
            method: 'GET',
            script: getServiceDefinitions,
            shortDescription: 'Retrieve available service definitions by category (policy/billing)'
        },
        {
            $id: Now.ID['create-policy-task'],
            name: 'Create Policy Task',
            path: '/policies/create',
            method: 'POST',
            script: createPolicyTask,
            shortDescription: 'Create a new policy administration task'
        },
        {
            $id: Now.ID['create-billing-task'],
            name: 'Create Billing Task',
            path: '/billing/create',
            method: 'POST',
            script: createBillingTask,
            shortDescription: 'Create a new billing and payment task'
        }
    ]
});