import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['ca1f7f826c7a365062a3bc17f1b08042'],
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
        feature: '021f7f826c7a365062a3bc17f1b08041',
        return_request: 'true',
        service_plan: '421f7f826c7a365062a3bc17f1b08042',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '180',
    },
})
