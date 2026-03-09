import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['dc1ffb826c7a365062a3bc17f1b08026'],
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
        feature: '541ffb826c7a365062a3bc17f1b08023',
        return_request: 'false',
        service_plan: '1c1ffb826c7a365062a3bc17f1b08025',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '60',
    },
})
