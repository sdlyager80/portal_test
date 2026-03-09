import '@servicenow/sdk/global';
import { Role } from '@servicenow/sdk/core';

// FSO Insurance Portal User Role - Basic access to portal
export const fsoPortalUserRole = Role({
    $id: Now.ID['fso-portal-user-role'],
    name: 'x_dxcis_smart_st_0.fso_portal_user',
    description: 'Basic access role for FSO Insurance Portal users'
});

// FSO Insurance Portal Admin Role - Administrative access
export const fsoPortalAdminRole = Role({
    $id: Now.ID['fso-portal-admin-role'],
    name: 'x_dxcis_smart_st_0.fso_portal_admin',
    description: 'Administrative access role for FSO Insurance Portal',
    containsRoles: [fsoPortalUserRole]
});