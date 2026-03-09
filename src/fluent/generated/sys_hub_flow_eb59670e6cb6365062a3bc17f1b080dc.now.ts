import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['6359670e6cb6365062a3bc17f1b080f7'],
    table: 'sys_documentation',
    data: {
        element: 'table_name',
        label: 'Table Name',
        language: 'en',
        name: 'var__m_sys_hub_flow_input_eb59670e6cb6365062a3bc17f1b080dc',
    },
})
Record({
    $id: Now.ID['6b59670e6cb6365062a3bc17f1b080fb'],
    table: 'sys_documentation',
    data: {
        element: 'current',
        label: 'Record',
        language: 'en',
        name: 'var__m_sys_hub_flow_input_eb59670e6cb6365062a3bc17f1b080dc',
    },
})
Record({
    $id: Now.ID['ef59a70e6cb6365062a3bc17f1b08000'],
    table: 'sys_documentation',
    data: {
        element: 'changed_fields',
        label: 'Changed Fields',
        language: 'en',
        name: 'var__m_sys_hub_flow_input_eb59670e6cb6365062a3bc17f1b080dc',
    },
})
Record({
    $id: Now.ID['1311f5878c4ffa10b419c663300973e1'],
    table: 'sys_documentation',
    data: {
        element: 'current',
        label: 'Record',
        language: 'en',
        name: 'var__m_sys_hub_flow_input_db11f5878c4ffa10b419c663300973ce',
    },
})
Record({
    $id: Now.ID['1f11f5878c4ffa10b419c663300973f4'],
    table: 'sys_documentation',
    data: {
        element: 'table_name',
        label: 'Table Name',
        language: 'en',
        name: 'var__m_sys_hub_flow_input_db11f5878c4ffa10b419c663300973ce',
    },
})
Record({
    $id: Now.ID['5311f5878c4ffa10b419c663300973eb'],
    table: 'sys_documentation',
    data: {
        element: 'changed_fields',
        label: 'Changed Fields',
        language: 'en',
        name: 'var__m_sys_hub_flow_input_db11f5878c4ffa10b419c663300973ce',
    },
})
Record({
    $id: Now.ID['d96b331f8c83be10b419c66330097300'],
    table: 'sys_flow_record_trigger',
    data: {
        active: 'true',
        condition: 'source_table=x_dxcis_claims_a_0_claims_fnol^task_definition=1d0576ce78a6b610b4196c8fb1ecadb2',
        on_delete: 'false',
        on_insert: 'false',
        on_update: 'true',
        run_flow_in: 'background',
        run_on_extended: 'false',
        run_when_setting: 'both',
        run_when_user_setting: 'any',
        sys_domain: 'global',
        sys_domain_path: '/',
        table: 'sys_di_task',
    },
})
Record({
    $id: Now.ID['5d6b331f8c83be10b419c66330097301'],
    table: 'sys_trigger_runner_mapping',
    data: {
        active: 'true',
        data: '{"run_flow_in":"background","run_when_user_list":[],"run_when_setting":"both","run_when_user_setting":"any","run_on_extended":"false"}',
        identifier: 'eb59670e6cb6365062a3bc17f1b080dc',
        runner: 'FDTriggerRunner',
        trigger: 'd96b331f8c83be10b419c66330097300',
    },
})
Record({
    $id: Now.ID['2b59670e6cb6365062a3bc17f1b080dd'],
    table: 'sys_flow_cat_variable_model',
    data: {
        id: 'eb59670e6cb6365062a3bc17f1b080dc',
        name: 'DocIntel Extract Values Flow - Claims - FNOL Extraction - FNOL Extraction',
    },
})
Record({
    $id: Now.ID['d311f5878c4ffa10b419c663300973d0'],
    table: 'sys_flow_cat_variable_model',
    data: {
        id: 'db11f5878c4ffa10b419c663300973ce',
        name: 'DocIntel Extract Values Flow - Claims - FNOL Extraction - FNOL Extraction',
    },
})
Record({
    $id: Now.ID['a359670e6cb6365062a3bc17f1b080f2'],
    table: 'sys_hub_flow_input',
    data: {
        active: 'true',
        array: 'false',
        array_denormalized: 'false',
        attributes:
            'element_mapping_provider=com.glide.flow_design.action.data.FlowDesignVariableMapper,test_input_hidden=true,uiType=table_name,uiTypeLabel=Table Name',
        audit: 'false',
        calculation: `(function calculatedFieldValue(current) {

	// Add your code here
	return '';  // return the calculated value

})(current);`,
        display: 'false',
        dynamic_creation: 'false',
        element: 'table_name',
        element_reference: 'false',
        function_field: 'false',
        internal_type: 'table_name',
        label: 'Table Name',
        mandatory: 'false',
        max_length: '200',
        model: 'eb59670e6cb6365062a3bc17f1b080dc',
        model_id: 'eb59670e6cb6365062a3bc17f1b080dc',
        model_table: 'sys_hub_flow',
        name: 'var__m_sys_hub_flow_input_eb59670e6cb6365062a3bc17f1b080dc',
        order: '101',
        primary: 'false',
        read_only: 'false',
        reference_floats: 'false',
        spell_check: 'false',
        staged: 'false',
        table_reference: 'false',
        text_index: 'false',
        unique: 'false',
        use_dependent_field: 'false',
        use_dynamic_default: 'false',
        use_reference_qualifier: 'simple',
        virtual: 'false',
        virtual_type: 'script',
        xml_view: 'false',
    },
})
Record({
    $id: Now.ID['a759670e6cb6365062a3bc17f1b080f8'],
    table: 'sys_hub_flow_input',
    data: {
        active: 'true',
        array: 'false',
        array_denormalized: 'false',
        attributes:
            'element_mapping_provider=com.glide.flow_design.action.data.FlowDesignVariableMapper,uiType=document_id,uiTypeLabel=Document ID',
        audit: 'false',
        calculation: `(function calculatedFieldValue(current) {

	// Add your code here
	return '';  // return the calculated value

})(current);`,
        dependent: 'table_name',
        dependent_on_field: 'table_name',
        display: 'false',
        dynamic_creation: 'false',
        element: 'current',
        element_reference: 'false',
        function_field: 'false',
        internal_type: 'document_id',
        label: 'Record',
        mandatory: 'true',
        max_length: '200',
        model: 'eb59670e6cb6365062a3bc17f1b080dc',
        model_id: 'eb59670e6cb6365062a3bc17f1b080dc',
        model_table: 'sys_hub_flow',
        name: 'var__m_sys_hub_flow_input_eb59670e6cb6365062a3bc17f1b080dc',
        order: '100',
        primary: 'false',
        read_only: 'false',
        reference_floats: 'false',
        spell_check: 'false',
        staged: 'false',
        table_reference: 'false',
        text_index: 'false',
        unique: 'false',
        use_dependent_field: 'true',
        use_dynamic_default: 'false',
        use_reference_qualifier: 'simple',
        virtual: 'false',
        virtual_type: 'script',
        xml_view: 'false',
    },
})
Record({
    $id: Now.ID['af59670e6cb6365062a3bc17f1b080fc'],
    table: 'sys_hub_flow_input',
    data: {
        active: 'true',
        array: 'false',
        array_denormalized: 'false',
        attributes:
            'child_label=FDChangeDetails,child_name=FDChangeDetails,child_type=object,child_type_label=Object,co_type_name=FDCollection,element_mapping_provider=com.glide.flow_design.action.data.FlowDesignVariableMapper,pwd2droppable=true,uiType=array.object,uiTypeLabel=Array.Object',
        audit: 'false',
        calculation: `(function calculatedFieldValue(current) {

	// Add your code here
	return '';  // return the calculated value

})(current);`,
        display: 'false',
        dynamic_creation: 'false',
        element: 'changed_fields',
        element_reference: 'false',
        function_field: 'false',
        internal_type: 'string',
        label: 'Changed Fields',
        mandatory: 'false',
        max_length: '4000',
        model: 'eb59670e6cb6365062a3bc17f1b080dc',
        model_id: 'eb59670e6cb6365062a3bc17f1b080dc',
        model_table: 'sys_hub_flow',
        name: 'var__m_sys_hub_flow_input_eb59670e6cb6365062a3bc17f1b080dc',
        order: '100',
        primary: 'false',
        read_only: 'false',
        reference_floats: 'false',
        spell_check: 'false',
        staged: 'false',
        table_reference: 'false',
        text_index: 'false',
        unique: 'false',
        use_dependent_field: 'false',
        use_dynamic_default: 'false',
        use_reference_qualifier: 'simple',
        virtual: 'false',
        virtual_type: 'script',
        xml_view: 'false',
    },
})
Record({
    $id: Now.ID['1f11f5878c4ffa10b419c663300973e4'],
    table: 'sys_hub_flow_input',
    data: {
        active: 'true',
        array: 'false',
        array_denormalized: 'false',
        attributes:
            'child_label=FDChangeDetails,child_name=FDChangeDetails,child_type=object,child_type_label=Object,co_type_name=FDCollection,element_mapping_provider=com.glide.flow_design.action.data.FlowDesignVariableMapper,pwd2droppable=true,uiType=array.object,uiTypeLabel=Array.Object',
        audit: 'false',
        calculation: `(function calculatedFieldValue(current) {

	// Add your code here
	return '';  // return the calculated value

})(current);`,
        display: 'false',
        dynamic_creation: 'false',
        element: 'changed_fields',
        element_reference: 'false',
        function_field: 'false',
        internal_type: 'string',
        label: 'Changed Fields',
        mandatory: 'false',
        max_length: '4000',
        model: 'db11f5878c4ffa10b419c663300973ce',
        model_id: 'db11f5878c4ffa10b419c663300973ce',
        model_table: 'sys_hub_flow_snapshot',
        name: 'var__m_sys_hub_flow_input_db11f5878c4ffa10b419c663300973ce',
        order: '100',
        primary: 'false',
        read_only: 'false',
        reference_floats: 'false',
        spell_check: 'false',
        staged: 'false',
        table_reference: 'false',
        text_index: 'false',
        unique: 'false',
        use_dependent_field: 'false',
        use_dynamic_default: 'false',
        use_reference_qualifier: 'simple',
        virtual: 'false',
        virtual_type: 'script',
        xml_view: 'false',
    },
})
Record({
    $id: Now.ID['1f11f5878c4ffa10b419c663300973ee'],
    table: 'sys_hub_flow_input',
    data: {
        active: 'true',
        array: 'false',
        array_denormalized: 'false',
        attributes:
            'element_mapping_provider=com.glide.flow_design.action.data.FlowDesignVariableMapper,test_input_hidden=true,uiType=table_name',
        audit: 'false',
        calculation: `(function calculatedFieldValue(current) {

	// Add your code here
	return '';  // return the calculated value

})(current);`,
        display: 'false',
        dynamic_creation: 'false',
        element: 'table_name',
        element_reference: 'false',
        function_field: 'false',
        internal_type: 'table_name',
        label: 'Table Name',
        mandatory: 'false',
        max_length: '200',
        model: 'db11f5878c4ffa10b419c663300973ce',
        model_id: 'db11f5878c4ffa10b419c663300973ce',
        model_table: 'sys_hub_flow_snapshot',
        name: 'var__m_sys_hub_flow_input_db11f5878c4ffa10b419c663300973ce',
        order: '101',
        primary: 'false',
        read_only: 'false',
        reference_floats: 'false',
        spell_check: 'false',
        staged: 'false',
        table_reference: 'false',
        text_index: 'false',
        unique: 'false',
        use_dependent_field: 'false',
        use_dynamic_default: 'false',
        use_reference_qualifier: 'simple',
        virtual: 'false',
        virtual_type: 'script',
        xml_view: 'false',
    },
})
Record({
    $id: Now.ID['9311f5878c4ffa10b419c663300973d2'],
    table: 'sys_hub_flow_input',
    data: {
        active: 'true',
        array: 'false',
        array_denormalized: 'false',
        attributes:
            'element_mapping_provider=com.glide.flow_design.action.data.FlowDesignVariableMapper,uiType=document_id',
        audit: 'false',
        calculation: `(function calculatedFieldValue(current) {

	// Add your code here
	return '';  // return the calculated value

})(current);`,
        dependent: 'table_name',
        dependent_on_field: 'table_name',
        display: 'false',
        dynamic_creation: 'false',
        element: 'current',
        element_reference: 'false',
        function_field: 'false',
        internal_type: 'document_id',
        label: 'Record',
        mandatory: 'true',
        max_length: '200',
        model: 'db11f5878c4ffa10b419c663300973ce',
        model_id: 'db11f5878c4ffa10b419c663300973ce',
        model_table: 'sys_hub_flow_snapshot',
        name: 'var__m_sys_hub_flow_input_db11f5878c4ffa10b419c663300973ce',
        order: '100',
        primary: 'false',
        read_only: 'false',
        reference_floats: 'false',
        spell_check: 'false',
        staged: 'false',
        table_reference: 'false',
        text_index: 'false',
        unique: 'false',
        use_dependent_field: 'true',
        use_dynamic_default: 'false',
        use_reference_qualifier: 'simple',
        virtual: 'false',
        virtual_type: 'script',
        xml_view: 'false',
    },
})
Record({
    $id: Now.ID['3359a70e6cb6365062a3bc17f1b08028'],
    table: 'sys_hub_trigger_instance_v2',
    data: {
        flow: 'eb59670e6cb6365062a3bc17f1b080dc',
        name: 'Updated',
        trigger_definition: 'bb695e60c31322002841b63b12d3aea5',
        trigger_inputs:
            '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',
        trigger_type: 'record_update',
    },
})
Record({
    $id: Now.ID['a71139878c4ffa10b419c66330097302'],
    table: 'sys_hub_trigger_instance_v2',
    data: {
        flow: 'db11f5878c4ffa10b419c663300973ce',
        name: 'Updated',
        trigger_definition: 'bb695e60c31322002841b63b12d3aea5',
        trigger_inputs:
            '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',
        trigger_type: 'record_update',
    },
})
Record({
    $id: Now.ID['7759a70e6cb6365062a3bc17f1b08024'],
    table: 'sys_hub_action_instance_v2',
    data: {
        action_type: 'c6c86f5feb702110f2549bf12a52285d',
        action_type_parent: '295a5b53eb702110f2549bf12a522846',
        compiled_snapshot: 'c6c86f5feb702110f2549bf12a52285d',
        flow: 'eb59670e6cb6365062a3bc17f1b080dc',
        order: '1',
        ui_id: '76d07b30-a860-43a9-8a9a-022006e43fb0',
        values: 'H4sIAAAAAAAA/5VSyW7bMBD9lYJnW5DkRZZvBYIAAdoGaJZLGggjamgTpUiFixPV8L93KKmG27SHHmd7896beToy4F4afaOdB83xrnc3DduyZbop87oUWBdpnmWpyFfLshZZDqs83+QZmzEZ+1Lgm7VY/aNvnVKfhhap04P7TtEBVIjh8fjQNeCxqbKEB2tR+9OJ6o10nYL+cWqjDN9L1VCdbZ+eZ6wDS3geLdse/yj5vsNKQY2KBr+iQKpw/A+mv2bvR6q/E4/oFNkLXGObyCObMXzzqBukPQKUwxlrQZM6Y3u29TZQwiI0t1r154691H4U2MKbkz8IfJHPLvC3zPWuamQ1EThXqskj6rgyPLRk3YeJMt8byfG2iycdwT3U6j0WNyq0+ssoMLqOAoLyF64HR3uwi6oiz4m0uNub17O111IPBkxFZTiocwTeW1kHjy5eKsj79/6NyU9/uRgqjLKqFrpO6l3VWXOQwy6i3iY7RUEilHkljk7udDJ+cUKeQ3JN+ash/QhWRv2fCYaG48YHLV8CDj9eNussKxDmuCkW86VIxbysi2JelGt6FpFvhODsNBhfvYQobfgFWimklsM+Dh3UUknffwtpumgaw6vIoaKHsMTJ2MHcycZqPApBOm5l5z8S6QNOjp2efwKo/g9ijQMAAA==',
    },
})
Record({
    $id: Now.ID['7759a70e6cb6365062a3bc17f1b08026'],
    table: 'sys_hub_action_instance_v2',
    data: {
        action_type: '54b8ab5feb702110f2549bf12a5228b6',
        action_type_parent: '89bcd7d3eb702110f2549bf12a5228fc',
        compiled_snapshot: '54b8ab5feb702110f2549bf12a5228b6',
        flow: 'eb59670e6cb6365062a3bc17f1b080dc',
        order: '2',
        ui_id: '85639730-06d1-40d7-b0ff-6be14681c8ae',
        values: 'H4sIAAAAAAAA/9VWUU/bMBD+KyjPTeU4SRv3bRJDYtpAosALQ9HFdlpvqRMcB+iq/vedm7S0iKJRMaa91fb57vu+uy/uzcIDblWpT3VtQXM5ntenwht5SZQwmrFcZkNCg4DkNI5YlgcUYkoTyr2ep1wci7IEsnhPXMYwTsNMYqR8tAZrSZHeQ9HIGk9WP/BosRgOBBlmIfEhGRA/CoH5CTDwCaWEDGQU5hnpG1k3hV0u8aZQdVXA/PrgBHyqCmGk9kY3tz2vAoMgrTTeaPHsyM4rmRaQyQLrfBmfn72B+fra5zX1o+s19f2iuIJ48qMuNa5KIxyqoOdCpRYSS+dQ1LLnzUALsKWZeyNrGtwwEsS5LuabiKnSFlN5LvaxVr8wb0QIcZG5RIZctqebZdrp2m7zaam4PK/cfLQ7FrKiu8PLopnps5aG64jMAcVddwR3mhrzycqBdjA6TPl4Wj5crAueKL3i1x0WJYdiswJrjcoai7JgWxp1uaNMu/662xlZyBlWS2dQVUpP0sqU92pVAQHP+pMCF/28KB8QWa0mut9Ofx+FhP4J7h+vtq/BKEf1G6bBy67YlVZ3jVx5I4tpTsI89Dlhwo84ZT4bBLlPQgoiocMwTiJvuZI1vWscoVagToq0VRMDam5UZT8hhHvZsV72/rIjxdPwWah/7rjwqkIdcBaDPm8M9udFrx1snk3T34B0ffeyhboLvHOK2crb2YW+l11CumuWel6jR9IOwEu+OS5540bwqIO830S7uf6dn7b12zXVdsc+xFlMBnLAae7TkDA/Sqjw2TCKfWAJHwQRZYNo+MxZTj4smSutVvU4VJCpQtn594aQUIiSpw5D2n1qS/OBXozJaxPO6fZIm4m0qZEcR/h1U/brsjE4c23sy8/hn1w6zMVjnCE9eQPBJws7hkcXa4Z7iHemrtdlOkeH7+Xo5P9/ADfa7Lp105kPsaqIcxolMfiMJSH+4QrAzzghfhwwkCEIGeAH/NBH8PY3FHByRJgKAAA=',
    },
})
Record({
    $id: Now.ID['ab11f5878c4ffa10b419c663300973fe'],
    table: 'sys_hub_action_instance_v2',
    data: {
        action_type: 'c6c86f5feb702110f2549bf12a52285d',
        action_type_parent: '295a5b53eb702110f2549bf12a522846',
        compiled_snapshot: 'c6c86f5feb702110f2549bf12a52285d',
        flow: 'db11f5878c4ffa10b419c663300973ce',
        order: '1',
        ui_id: '76d07b30-a860-43a9-8a9a-022006e43fb0',
        values: 'H4sIAAAAAAAA/41T227bMAz9lUHPSWC7ub8NLQIU2FZgafvSFQYtUYkwWXJ1SesF+fdRtpFl6wbskeQRec4h9XRkwIOy5tb4AIbjtvW3gq3ZNFuuimolsVpkRZ5nsphNV5XMC5gVxbLI2YiphMuAL+dy9g/cPCOcgRoJGcB/p+gAOqbweHxoBAQUZT7h0Tk04XSiulC+0dA+DjDK8L3Sgups/fQ8Yg046hfQsfXxj9L/EtJQoSbofc/od36hbVLkUCI15jikPg1vvl7krROJRj5i+BbQCKT5ErTHEavBkDjrWrYOLlLCIYg7o9szYq9M6PXV8ObVDxp6VYwu5q6Zb30pVDkQO1fKwSJC3Fgea3LuwyBF3kCALU3kIbqzfVZx9L1FAiVEHa4vcz3grkln0D8JUOn3BLjVsTZferfYudfFpqInctgkK5K4Qanc7u3r2beNMp1rQ1FbDvoCiuD4fqNQp116Gx3pdcjJauoPIThVxZCYH1lU9+931Sf/ti3UmKwqa2gaZXZl4+xBdVRIWT3ZaQomUttXkuDVzkz6jzGhPcJkQ/mbLv0ITiV7PlMbepwmPhj1ErH7Nisxz/MFwhiXi6vxVGZyvKoWi/FiNafDlMVSSs5Oo+TstQbvf7lJIsqXmLzoLpFISGVUx4BDA5XSKrTfYpZdCWF5mViVdHaOWFrXbWPwvey3mIZwp5rwkWQccLD49PwToKbNJPIDAAA=',
    },
})
Record({
    $id: Now.ID['eb1139878c4ffa10b419c66330097300'],
    table: 'sys_hub_action_instance_v2',
    data: {
        action_type: '54b8ab5feb702110f2549bf12a5228b6',
        action_type_parent: '89bcd7d3eb702110f2549bf12a5228fc',
        compiled_snapshot: '54b8ab5feb702110f2549bf12a5228b6',
        flow: 'db11f5878c4ffa10b419c663300973ce',
        order: '2',
        ui_id: '85639730-06d1-40d7-b0ff-6be14681c8ae',
        values: 'H4sIAAAAAAAA/+VWXW/bNhT9K4GeLYOiJFvM29AsQIetAeI2L10hXPHD5kZTKkWl9Yz8915a8oeCpE0HLy97Ey/vJc85l4fUx20E3OvavrWtB8vlYtO+FdFlVGQFoxVTspoTmiRE0TxjlUoo5JQWlEeTSIc8llUFVPkzeRXDPAtriZnyq3e4lxTlPZhOtjiz+8Cp7XY+E2RepSSGYkbiLAUWF8AgJpQSMpNZqioydbLtjH94wEqh28bA5u5fL8BX2ggnbXT58dMkasAhSC9ddLl9NPVSlgYqaTD11z3Ni7s9zecF8JsmzPzV1nYY/T4s89vi5h2GaicCqGQSqqUVEtEoMK2cRGuwAnztNtGldx0GnARxY83mkLHS1uNSUcj92up/cKuMEBIylUSCXPazh2E5yNqH1RV4WODa3HduSOWrWnOEvpNGSAWo55vTWJ9w04Qz1Zd4qMy+ujbd2r7r5YgOC+y7iJGuRRCyCUwD9oGIWqzqL7d7lNfa7kQZJk3NwRxG4L3TVecDnm3U6fcjhfvxI42lkWvcrVxD02i7LBtX3+vdDgh4PV0aHEyVqb8gslYv7bR3zBTVh+k1xq924TtwOlD9A5fB4rDZB6s/d3LnpyqniqQqjTlhIs44ZTGbJSomKQVR0HmaF1n0MInaTfvGQNseRcLulJ+7QLGXbBCn7PUNJdzpxv+CoO7loMPD5D/2tTgeaw/t3yMvf2hQGTzlyZR3Djv2pGPPbUFxYsH3PaIxvsFqx6M/9tvtSXwwHT2X6VI6thz2GJ1WDsCect9VzbtwJi8GKme24hjAK7hSLSQ4vrrW0oRetnXnkK+THKWOnjXtaa/Gzj3t1qvYl8lEzjhVMU0Ji7OCipjNszwGVvBZklE2y+Y/tG/QG0EobfUOAYcGKm203/zZEZIKUfMyoCqHl6J2r2j4nHzPX5yeGsotpT927zvOn446/fTL/ZKin7sqXkDleFUELhe3ey7PUBwujxaPqV0+ujkW++BwbaTnujaK/+lbfVB57PmDzq9ieJErmhU5xIwVKf5PJhBXnJA4TxjIFIRM8Mk533v96RtOjQo2iQsAAA==',
    },
})
Record({
    $id: Now.ID['db11f5878c4ffa10b419c663300973ce'],
    table: 'sys_hub_flow_snapshot',
    data: {
        access: 'public',
        active: 'true',
        attributes: 'browserActivatedIn=chrome,integrationActivatedIn=standalone,viewActivatedIn=naturalLanguage',
        authored_on_release_version: '28100',
        callable_by_client_api: 'false',
        copied_from: '9d916bd7eb702110f2549bf12a522855',
        internal_name: 'docintel_extract_values_flow__claims__fnol_extraction__fnol_extraction',
        label_cache:
            '[{"name":"Updated_1.current.source_record","label":"Trigger - Record Updated➛Document Task Record➛Source Record","reference":"","reference_display":"Source Record","type":"document_id","base_type":"document_id","parent_table_name":"sys_di_task","column_name":"source_record"},{"name":"76d07b30-a860-43a9-8a9a-022006e43fb0.result","label":"1 - DocIntel - Retrieve Field Values➛Result","reference_display":"Result","type":"json","base_type":"json","attributes":{"uiType":"json","uiTypeLabel":"JSON","element_mapping_provider":"com.glide.flow_design.action.data.FlowDesignVariableMapper","uiUniqueId":"d4583b94-f4d5-463d-939a-d06b59476a0c"}},{"name":"Updated_1.current","label":"Trigger - Record Updated➛Document Task Record","reference":"sys_di_task","reference_display":"Document Task","type":"reference","base_type":"reference","attributes":{}}]',
        master: 'true',
        name: 'DocIntel Extract Values Flow - Claims - FNOL Extraction - FNOL Extraction',
        parent_flow: 'eb59670e6cb6365062a3bc17f1b080dc',
        run_as: 'system',
        sc_callable: 'false',
        status: 'published',
        sys_domain: 'global',
        sys_domain_path: '/',
        type: 'flow',
        version: '2',
    },
})
Record({
    $id: Now.ID['6f1139878c4ffa10b419c66330097370'],
    table: 'sys_flow_trigger_plan',
    data: {
        binding_strategy: 'com.snc.process_flow.engine.binding.Every',
        plan: '{"type":"PlanProxy","persistor":{"@class":".ChunkingPlanPersistor","table":"sys_flow_trigger_plan","id":"6f1139878c4ffa10b419c66330097370","name":"plan","plan_signature":null}}',
        plan_id: 'eb59670e6cb6365062a3bc17f1b080dc',
        snapshot: 'db11f5878c4ffa10b419c663300973ce',
        sys_domain: 'global',
        sys_domain_path: '/',
        trigger: 'd96b331f8c83be10b419c66330097300',
    },
})
