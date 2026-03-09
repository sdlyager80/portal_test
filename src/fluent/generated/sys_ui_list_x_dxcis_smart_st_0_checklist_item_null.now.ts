import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_dxcis_smart_st_0_checklist_item',
    view: default_view,
    columns: ['description', 'order', 'request_type', 'required'],
})
