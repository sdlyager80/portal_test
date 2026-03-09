import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['df33bd4b8c4ffa10b419c6633009730b'],
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
        feature: '5333bd4b8c4ffa10b419c66330097308',
        return_request: 'false',
        service_plan: 'db33bd4b8c4ffa10b419c6633009730a',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '60',
    },
})
