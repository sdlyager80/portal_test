import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import portalPage from '../../client/index.html';

export const fsoInsurancePortal = UiPage({
    $id: Now.ID['fso-insurance-portal'],
    endpoint: 'x_dxcis_smart_st_0_fso_insurance_portal.do',
    html: portalPage,
    direct: true
});