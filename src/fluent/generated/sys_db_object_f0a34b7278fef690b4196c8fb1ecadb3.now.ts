import { Table, StringColumn, IntegerColumn, BooleanColumn, ChoiceColumn } from '@servicenow/sdk/core'

export const x_dxcis_smart_st_0_checklist_item = Table({
    allowWebServiceAccess: true,
    label: 'Checklist Item',
    name: 'x_dxcis_smart_st_0_checklist_item',
    schema: {
        description: StringColumn({
            label: 'Description',
            maxLength: 255,
        }),
        order: IntegerColumn({
            label: 'Order',
        }),
        required: BooleanColumn({
            label: 'Required',
        }),
        request_type: ChoiceColumn({
            dropdown: 'dropdown_with_none',
            label: 'Request Type',
            maxLength: 50,
        }),
    },
})
