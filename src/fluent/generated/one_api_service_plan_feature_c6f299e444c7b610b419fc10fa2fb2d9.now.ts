import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['c6f299e444c7b610b419fc10fa2fb2d9'],
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
        feature: '4af299e444c7b610b419fc10fa2fb2d2',
        return_request: 'false',
        service_plan: '4af299e444c7b610b419fc10fa2fb2d7',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '240',
    },
})
