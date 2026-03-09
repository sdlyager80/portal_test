import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['9359e7ca6cb6365062a3bc17f1b080f0'],
    table: 'sys_di_integration_setup',
    data: {
        create_flow: 'true',
        flow: 'eb59670e6cb6365062a3bc17f1b080dc',
        flow_conditions:
            'statusCHANGESTODone^source_table=x_dxcis_claims_a_0_claims_fnol^task_definition=1d0576ce78a6b610b4196c8fb1ecadb2',
        name: 'FNOL Extraction',
        sys_domain: 'global',
        sys_domain_path: '/',
        target_table: 'x_dxcis_claims_a_0_claims_fnol',
        task_definition: '1d0576ce78a6b610b4196c8fb1ecadb2',
        trigger: 'x_dxcis_claims_a_0_claims_fnol',
        type: 'extract_values',
    },
})
