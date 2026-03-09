import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['7a5a638e6cb6365062a3bc17f1b0806c'],
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
        feature: 'fa5a638e6cb6365062a3bc17f1b0806a',
        return_request: 'false',
        service_plan: 'be5a638e6cb6365062a3bc17f1b0806b',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '60',
    },
})
