import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['34c8eb8a6cb6365062a3bc17f1b080db'],
    table: 'sys_documentation',
    data: {
        element: 'table_name',
        label: 'Table Name',
        language: 'en',
        name: 'var__m_sys_hub_flow_input_a4c8eb8a6cb6365062a3bc17f1b0809f',
    },
})
Record({
    $id: Now.ID['85c7d25f8c0b7e10b419c66330097387'],
    table: 'sys_documentation',
    data: {
        element: 'changed_fields',
        label: 'Changed Fields',
        language: 'en',
        name: 'var__m_sys_hub_flow_input_a4c8eb8a6cb6365062a3bc17f1b0809f',
    },
})
Record({
    $id: Now.ID['bcc8eb8a6cb6365062a3bc17f1b080d5'],
    table: 'sys_documentation',
    data: {
        element: 'current',
        label: 'Record',
        language: 'en',
        name: 'var__m_sys_hub_flow_input_a4c8eb8a6cb6365062a3bc17f1b0809f',
    },
})
Record({
    $id: Now.ID['31c7165f8c0b7e10b419c66330097353'],
    table: 'sys_documentation',
    data: {
        element: 'changed_fields',
        label: 'Changed Fields',
        language: 'en',
        name: 'var__m_sys_hub_flow_input_6931f9878c4ffa10b419c6633009737d',
    },
})
Record({
    $id: Now.ID['3531f9878c4ffa10b419c66330097394'],
    table: 'sys_documentation',
    data: {
        element: 'table_name',
        label: 'Table Name',
        language: 'en',
        name: 'var__m_sys_hub_flow_input_6931f9878c4ffa10b419c6633009737d',
    },
})
Record({
    $id: Now.ID['3931f9878c4ffa10b419c6633009738b'],
    table: 'sys_documentation',
    data: {
        element: 'current',
        label: 'Record',
        language: 'en',
        name: 'var__m_sys_hub_flow_input_6931f9878c4ffa10b419c6633009737d',
    },
})
Record({
    $id: Now.ID['92c7165f8c0b7e10b419c663300973da'],
    table: 'sys_flow_record_trigger',
    data: {
        active: 'true',
        condition: 'docintel_attachment=true',
        on_delete: 'false',
        on_insert: 'true',
        on_update: 'true',
        run_flow_in: 'background',
        run_on_extended: 'false',
        run_when_setting: 'both',
        run_when_user_setting: 'any',
        sys_domain: 'global',
        sys_domain_path: '/',
        table: 'x_dxcis_claims_a_0_claims_fnol',
    },
})
Record({
    $id: Now.ID['56c7165f8c0b7e10b419c663300973db'],
    table: 'sys_trigger_runner_mapping',
    data: {
        active: 'true',
        data: '{"run_flow_in":"background","run_when_user_list":[],"run_when_setting":"both","run_when_user_setting":"any","run_on_extended":"false"}',
        identifier: 'a4c8eb8a6cb6365062a3bc17f1b0809f',
        runner: 'FDTriggerRunner',
        trigger: '92c7165f8c0b7e10b419c663300973da',
    },
})
Record({
    $id: Now.ID['28c8eb8a6cb6365062a3bc17f1b080a2'],
    table: 'sys_flow_cat_variable_model',
    data: {
        id: 'a4c8eb8a6cb6365062a3bc17f1b0809f',
        name: 'DocIntel Task Processing Flow - Claims - FNOL Extraction - Annuity Claim form Extraction',
    },
})
Record({
    $id: Now.ID['6531f9878c4ffa10b419c6633009737e'],
    table: 'sys_flow_cat_variable_model',
    data: {
        id: '6931f9878c4ffa10b419c6633009737d',
        name: 'DocIntel Task Processing Flow - Claims - FNOL Extraction - Annuity Claim form Extraction',
    },
})
Record({
    $id: Now.ID['01c7d25f8c0b7e10b419c6633009737f'],
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
        model: 'a4c8eb8a6cb6365062a3bc17f1b0809f',
        model_id: 'a4c8eb8a6cb6365062a3bc17f1b0809f',
        model_table: 'sys_hub_flow',
        name: 'var__m_sys_hub_flow_input_a4c8eb8a6cb6365062a3bc17f1b0809f',
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
    $id: Now.ID['2cc8eb8a6cb6365062a3bc17f1b080ad'],
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
        model: 'a4c8eb8a6cb6365062a3bc17f1b0809f',
        model_id: 'a4c8eb8a6cb6365062a3bc17f1b0809f',
        model_table: 'sys_hub_flow',
        name: 'var__m_sys_hub_flow_input_a4c8eb8a6cb6365062a3bc17f1b0809f',
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
    $id: Now.ID['f8c8eb8a6cb6365062a3bc17f1b080d7'],
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
        model: 'a4c8eb8a6cb6365062a3bc17f1b0809f',
        model_id: 'a4c8eb8a6cb6365062a3bc17f1b0809f',
        model_table: 'sys_hub_flow',
        name: 'var__m_sys_hub_flow_input_a4c8eb8a6cb6365062a3bc17f1b0809f',
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
    $id: Now.ID['3131f9878c4ffa10b419c6633009738f'],
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
        model: '6931f9878c4ffa10b419c6633009737d',
        model_id: '6931f9878c4ffa10b419c6633009737d',
        model_table: 'sys_hub_flow_snapshot',
        name: 'var__m_sys_hub_flow_input_6931f9878c4ffa10b419c6633009737d',
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
    $id: Now.ID['6931f9878c4ffa10b419c6633009737f'],
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
        model: '6931f9878c4ffa10b419c6633009737d',
        model_id: '6931f9878c4ffa10b419c6633009737d',
        model_table: 'sys_hub_flow_snapshot',
        name: 'var__m_sys_hub_flow_input_6931f9878c4ffa10b419c6633009737d',
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
    $id: Now.ID['fdc7165f8c0b7e10b419c6633009733f'],
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
        model: '6931f9878c4ffa10b419c6633009737d',
        model_id: '6931f9878c4ffa10b419c6633009737d',
        model_table: 'sys_hub_flow_snapshot',
        name: 'var__m_sys_hub_flow_input_6931f9878c4ffa10b419c6633009737d',
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
    $id: Now.ID['44b7125f8c0b7e10b419c663300973dc'],
    table: 'sys_hub_trigger_instance_v2',
    data: {
        flow: 'a4c8eb8a6cb6365062a3bc17f1b0809f',
        name: 'Created or Updated',
        trigger_definition: 'a45d9180c32222002841b63b12d3aea7',
        trigger_inputs:
            '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',
        trigger_type: 'record_create_or_update',
    },
})
Record({
    $id: Now.ID['7931f9878c4ffa10b419c663300973a0'],
    table: 'sys_hub_trigger_instance_v2',
    data: {
        flow: '6931f9878c4ffa10b419c6633009737d',
        name: 'Created or Updated',
        trigger_definition: 'a45d9180c32222002841b63b12d3aea7',
        trigger_inputs:
            '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',
        trigger_type: 'record_create_or_update',
    },
})
Record({
    $id: Now.ID['78c82f8a6cb6365062a3bc17f1b0801f'],
    table: 'sys_hub_action_instance_v2',
    data: {
        action_type: 'dc85af9beb702110f2549bf12a5228d6',
        action_type_parent: 'bea253dbeb302110f2549bf12a522840',
        compiled_snapshot: 'dc85af9beb702110f2549bf12a5228d6',
        flow: 'a4c8eb8a6cb6365062a3bc17f1b0809f',
        order: '1',
        ui_id: '6e1fa36a-f09d-4993-afc2-b4d3ade21307',
        values: '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',
    },
})
Record({
    $id: Now.ID['3cc82f8a6cb6365062a3bc17f1b08022'],
    table: 'sys_hub_action_instance_v2',
    data: {
        action_type: '1ca82b5feb702110f2549bf12a522896',
        action_type_parent: '5fe85713eb702110f2549bf12a522824',
        compiled_snapshot: '1ca82b5feb702110f2549bf12a522896',
        flow: 'a4c8eb8a6cb6365062a3bc17f1b0809f',
        order: '2',
        ui_id: '62bbfafa-512d-49be-b197-e341f1b0c8cb',
        values: 'H4sIAAAAAAAA/41TXW+bMBT9K5WfIQJC0iRvU6NIkbZVWrq+dBW62NeJNWOobdKyKP9914CyaO2kPXJ8ru/5ME8nBtyr2myN82A47jq3FWzF5jPkWTZPsMzTLE0Tmc3yZSnTDGZZtshmLGIq8PgCOWD2Dx5y4hmokJge3M+CZiJ2BN0G5HSaYyphOodYJksR58vlNAbJs7jMxRQEZuk0uZ2Mg+czjQrlGg3d43gDIfygtLBo2OrpOWINWNrm0bLV6a+j/5WroURN1Adae7Ndf2TAd00ALEqk6zmO0Odx8tsVXlsRxKQRwzePRiCpkKAdRqwCI8DXtmMrb1sCLIK4N7q7MA7K+MFlBW9O/aKl0yy62rtirnOFUEXQxq5OijEoYqxr3lZo/M3DwJFr8LCjjdy39hJirTi6ISiBElrt766xgXDfhKcyjHgo9XsBvNZtZb4OgbHLXVd9tY7EYROiCOZGp3J3qF8vuW2U6VMbD3XNQV9RESw/bBTq0OhotOhLihh4b1XZ+iD8xFr18L6qAfyoLNQYkioqaBpl9kVj66PqlZCxarLX9DGRun4lB07tzWT4dyZUI0w2hK97+BGsCul8oWtoOGz8btRLi/2fNeM8XywSGSe3EuKc5zJe5FzEKEBKmS/zkgt2jkKwdxqc+xMmmShe2hDF8BYpXGVUr4BDA6XSync/2iSZClHzIqgq6NVZUlnbvowx9mIoMSzhVjX+E9k44pjw+fk30s9jHBUEAAA=',
    },
})
Record({
    $id: Now.ID['3931f9878c4ffa10b419c6633009739d'],
    table: 'sys_hub_action_instance_v2',
    data: {
        action_type: 'dc85af9beb702110f2549bf12a5228d6',
        action_type_parent: 'bea253dbeb302110f2549bf12a522840',
        compiled_snapshot: 'dc85af9beb702110f2549bf12a5228d6',
        flow: '6931f9878c4ffa10b419c6633009737d',
        order: '1',
        ui_id: '6e1fa36a-f09d-4993-afc2-b4d3ade21307',
        values: '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',
    },
})
Record({
    $id: Now.ID['fd31f9878c4ffa10b419c6633009739e'],
    table: 'sys_hub_action_instance_v2',
    data: {
        action_type: '1ca82b5feb702110f2549bf12a522896',
        action_type_parent: '5fe85713eb702110f2549bf12a522824',
        compiled_snapshot: '1ca82b5feb702110f2549bf12a522896',
        flow: '6931f9878c4ffa10b419c6633009737d',
        order: '2',
        ui_id: '62bbfafa-512d-49be-b197-e341f1b0c8cb',
        values: 'H4sIAAAAAAAA/41TXW+bMBT9K5WfIQJC0iRvU6NIkbZVWrq+dBW62NeJNWOobdKyKP9914CyaO2kPXJ8ru/5ME8nBtyr2myN82A47jq3FWzF5jPkWTZPsMzTLE0Tmc3yZSnTDGZZtshmLGIq8PgCOWD2Dx5y4hmokJge3M+CZiJ2BN0G5HSaYyphOodYJksR58vlNAbJs7jMxRQEZuk0uZ2Mg+czjQrlGg3d43gDIfygtLBo2OrpOWINWNrm0bLV6a+j/5WroURN1Adae7Ndf2TAd00ALEqk6zmO0Odx8tsVXlsRxKQRwzePRiCpkKAdRqwCI8DXtmMrb1sCLIK4N7q7MA7K+MFlBW9O/aKl0yy62rtirnOFUEXQxq5OijEoYqxr3lZo/M3DwJFr8LCjjdy39hJirTi6ISiBElrt766xgXDfhKcyjHgo9XsBvNZtZb4OgbHLXVd9tY7EYROiCOZGp3J3qF8vuW2U6VMbD3XNQV9RESw/bBTq0OhotOhLihh4b1XZ+iD8xFr18L6qAfyoLNQYkioqaBpl9kVj66PqlZCxarLX9DGRun4lB07tzWT4dyZUI0w2hK97+BGsCul8oWtoOGz8btRLi/2fNeM8XywSGSe3EuKc5zJe5FzEKEBKmS/zkgt2jkKwdxqc+xMmmShe2hDF8BYpXGVUr4BDA6XSync/2iSZClHzIqgq6NVZUlnbvowx9mIoMSzhVjX+E9k44pjw+fk30s9jHBUEAAA=',
    },
})
Record({
    $id: Now.ID['6931f9878c4ffa10b419c6633009737d'],
    table: 'sys_hub_flow_snapshot',
    data: {
        access: 'public',
        active: 'true',
        attributes:
            'browserActivatedIn=chrome,integrationActivatedIn=standalone,labelCacheCleanUpExecuted=true,timeFromCreateToActivate=31170232000,viewActivatedIn=naturalLanguage',
        authored_on_release_version: '28100',
        callable_by_client_api: 'false',
        copied_from: 'e0b9ab9feb702110f2549bf12a5228e6',
        description: 'DocDataExtractor Flow Template for processing a task',
        internal_name: 'docintel_task_processing_flow__claims__fnol_extraction__annuity_claim_form_extraction',
        label_cache:
            '[{"name":"Created_1.table_name","label":"Trigger - Record Created➛Incident Table","reference":"incident","reference_display":"Incident","type":"table_name","base_type":"table_name","attributes":{"test_input_hidden":"true"}},{"name":"Created_1.current.sys_id","label":"Trigger - Record Created➛Incident Record➛Sys ID","reference":"","reference_display":"Sys ID","type":"GUID","base_type":"GUID","parent_table_name":"incident","column_name":"sys_id"},{"name":"6e1fa36a-f09d-4993-afc2-b4d3ade21307.task_id","label":"1 - DocIntel - Create a Document Task➛Task ID","reference_display":"Task ID","type":"string","base_type":"string","attributes":{"uiType":"string","uiTypeLabel":"String","element_mapping_provider":"com.glide.flow_design.action.data.FlowDesignVariableMapper","pwd2droppable":"true","uiUniqueId":"a7335496-1038-4dd2-8efb-a38349d0513f"}}]',
        master: 'true',
        name: 'DocIntel Task Processing Flow - Claims - FNOL Extraction - Annuity Claim form Extraction',
        parent_flow: 'a4c8eb8a6cb6365062a3bc17f1b0809f',
        run_as: 'user',
        sc_callable: 'false',
        status: 'published',
        sys_domain: 'global',
        sys_domain_path: '/',
        type: 'flow',
        version: '2',
    },
})
Record({
    $id: Now.ID['7131f9878c4ffa10b419c663300973bd'],
    table: 'sys_flow_trigger_plan',
    data: {
        binding_strategy: 'com.snc.process_flow.engine.binding.OncePerRecord',
        plan: '{"type":"PlanProxy","persistor":{"@class":".ChunkingPlanPersistor","table":"sys_flow_trigger_plan","id":"7131f9878c4ffa10b419c663300973bd","name":"plan","plan_signature":null}}',
        plan_id: 'a4c8eb8a6cb6365062a3bc17f1b0809f',
        snapshot: 'd30c52171d837a5062a3fd68f681ceee',
        sys_domain: 'global',
        sys_domain_path: '/',
        trigger: '92c7165f8c0b7e10b419c663300973da',
    },
})
