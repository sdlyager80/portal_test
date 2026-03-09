import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['c1c38f7278fef690b4196c8fb1ecad52'],
    description: 'Default access control on x_dxcis_smart_st_0_checklist_item',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'delete',
    roles: ['x_dxcis_smart_st_0.checklist_item_user'],
    table: 'x_dxcis_smart_st_0_checklist_item',
})
