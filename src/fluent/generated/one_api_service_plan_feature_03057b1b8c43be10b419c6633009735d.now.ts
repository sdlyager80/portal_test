import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['03057b1b8c43be10b419c6633009735d'],
    table: 'one_api_service_plan_feature',
    data: {
        active: 'true',
        applicability_script: `(function(featureInput, previousFeatureOutputs) {  
	/* customize condition logic here, return true or false */  
	return true;
  })(featureInput, previousFeatureOutputs);`,
        applicability_type: 'script',
        delay_output_processing: 'false',
        error_policy: 'continue_service_plan_execution',
        feature: '83057b1b8c43be10b419c6633009735b',
        return_request: 'false',
        service_plan: '47057b1b8c43be10b419c6633009735c',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '60',
    },
})
