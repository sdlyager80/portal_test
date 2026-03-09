import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['b4c2242b8c0fbe10b419c66330097363'],
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
        feature: '3cc2242b8c0fbe10b419c66330097360',
        return_request: 'false',
        service_plan: 'f4c2242b8c0fbe10b419c66330097362',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '60',
    },
})
