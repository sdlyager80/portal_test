import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import insurancePage from '../../client/index.html';

export const insurancePortal = UiPage({
    $id: Now.ID['insurance-portal'],
    endpoint: 'x_dxcis_smart_st_0_insurance_portal.do',
    html: insurancePage,
    direct: true
});