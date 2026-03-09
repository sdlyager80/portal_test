import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b3089bb278723a90b4196c8fb1ecad13'],
    description: 'Default access control on x_dxcis_smart_st_0_request_type',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_dxcis_smart_st_0.request_type_user'],
    table: 'x_dxcis_smart_st_0_request_type',
})
