import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['22d8bf9f8c43be10b419c66330097391'],
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
        feature: 'a6d8bf9f8c43be10b419c6633009738e',
        return_request: 'false',
        service_plan: '62d8bf9f8c43be10b419c66330097390',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '60',
    },
})
