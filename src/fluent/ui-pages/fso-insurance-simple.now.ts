import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import simplePage from '../../client/simple.html';

export const fsoInsurancePortalSimple = UiPage({
    $id: Now.ID['fso-insurance-portal-simple'],
    endpoint: 'x_dxcis_smart_st_0_fso_insurance_simple.do',
    html: simplePage,
    direct: true
});