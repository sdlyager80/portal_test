import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['9c6aa38e6cb6365062a3bc17f1b080ca'],
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
        feature: 'd06aa38e6cb6365062a3bc17f1b080c9',
        return_request: 'false',
        service_plan: '146aa38e6cb6365062a3bc17f1b080ca',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '60',
    },
})
