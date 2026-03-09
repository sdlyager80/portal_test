import '@servicenow/sdk/global';
import { RestApi } from '@servicenow/sdk/core';
import { getInsuranceData } from '../../server/insuranceApi.js';
import { insuranceApiAcl } from '../security/acls.now.ts';

export const insuranceApi = RestApi({
    $id: Now.ID['insurance-api'],
    name: 'Insurance Portal API',
    serviceId: 'insurance_portal',
    shortDescription: 'Simple API for insurance portal operations',
    active: true,
    enforceAcl: [insuranceApiAcl],
    routes: [
        {
            $id: Now.ID['get-insurance-data'],
            name: 'Get Insurance Data',
            path: '/data',
            method: 'GET',
            script: getInsuranceData,
            shortDescription: 'Get basic insurance portal data'
        }
    ]
});