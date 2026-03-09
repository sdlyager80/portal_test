import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['7d1f3f826c7a365062a3bc17f1b080df'],
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
        feature: 'b11f3f826c7a365062a3bc17f1b080de',
        return_request: 'true',
        service_plan: 'f11f3f826c7a365062a3bc17f1b080df',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '180',
    },
})
