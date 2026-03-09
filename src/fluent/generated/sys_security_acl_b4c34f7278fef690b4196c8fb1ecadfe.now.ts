import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b4c34f7278fef690b4196c8fb1ecadfe'],
    description: 'Default access control on x_dxcis_smart_st_0_checklist_item',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'create',
    roles: ['x_dxcis_smart_st_0.checklist_item_user'],
    table: 'x_dxcis_smart_st_0_checklist_item',
})
