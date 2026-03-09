import { Table, StringColumn, IntegerColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_dxcis_smart_st_0_request_type = Table({
    allowWebServiceAccess: true,
    label: 'Request Type',
    name: 'x_dxcis_smart_st_0_request_type',
    schema: {
        description: StringColumn({
            label: 'Description',
            maxLength: 250,
        }),
        order: IntegerColumn({
            label: 'Order',
        }),
        name: StringColumn({
            label: 'Name',
            maxLength: 50,
        }),
        label: StringColumn({
            label: 'Label',
            maxLength: 50,
        }),
        active: BooleanColumn({
            label: 'Active',
        }),
    },
})
