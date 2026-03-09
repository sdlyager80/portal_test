import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_dxcis_smart_st_0_request_type',
    view: default_view,
    columns: ['name', 'active', 'description', 'label', 'order'],
})
