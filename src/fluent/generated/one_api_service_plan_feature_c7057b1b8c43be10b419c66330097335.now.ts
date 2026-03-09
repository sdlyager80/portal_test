import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['c7057b1b8c43be10b419c66330097335'],
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
        feature: '8f053b1b8c43be10b419c663300973ff',
        return_request: 'false',
        service_plan: 'c7057b1b8c43be10b419c66330097302',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '60',
    },
})
