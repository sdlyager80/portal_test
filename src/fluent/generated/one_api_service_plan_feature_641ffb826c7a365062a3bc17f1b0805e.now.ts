import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['641ffb826c7a365062a3bc17f1b0805e'],
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
        feature: 'e41ffb826c7a365062a3bc17f1b0805c',
        return_request: 'false',
        service_plan: 'a81ffb826c7a365062a3bc17f1b0805d',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '60',
    },
})
