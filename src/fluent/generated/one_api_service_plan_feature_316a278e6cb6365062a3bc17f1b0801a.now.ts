import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['316a278e6cb6365062a3bc17f1b0801a'],
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
        feature: '756a278e6cb6365062a3bc17f1b08018',
        return_request: 'true',
        service_plan: 'b56a278e6cb6365062a3bc17f1b08019',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '180',
    },
})
