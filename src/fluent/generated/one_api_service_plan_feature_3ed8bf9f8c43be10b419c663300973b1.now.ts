import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['3ed8bf9f8c43be10b419c663300973b1'],
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
        feature: 'bed8bf9f8c43be10b419c663300973af',
        return_request: 'false',
        service_plan: '72d8bf9f8c43be10b419c663300973b1',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '60',
    },
})
