import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['d8c8eb8a6cb6365062a3bc17f1b08030'],
    table: 'sys_di_integration_setup',
    data: {
        condition: 'consumerISNOTEMPTY',
        create_flow: 'true',
        flow: 'a4c8eb8a6cb6365062a3bc17f1b0809f',
        flow_conditions: 'consumerISNOTEMPTY',
        name: 'Annuity Claim form Extraction',
        sys_domain: 'global',
        sys_domain_path: '/',
        target_table: 'x_dxcis_claims_a_0_claims_fnol',
        task_definition: '1d0576ce78a6b610b4196c8fb1ecadb2',
        trigger: 'x_dxcis_claims_a_0_claims_fnol',
        type: 'process_task',
    },
})
