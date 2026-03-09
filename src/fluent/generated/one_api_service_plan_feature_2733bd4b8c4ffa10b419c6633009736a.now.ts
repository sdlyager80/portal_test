import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['2733bd4b8c4ffa10b419c6633009736a'],
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
        feature: 'a733bd4b8c4ffa10b419c66330097368',
        return_request: 'false',
        service_plan: '6b33bd4b8c4ffa10b419c66330097369',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '60',
    },
})
