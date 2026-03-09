import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['996ae38e6cb6365062a3bc17f1b080ba'],
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
        feature: '196ae38e6cb6365062a3bc17f1b080ac',
        return_request: 'true',
        service_plan: '596ae38e6cb6365062a3bc17f1b080ad',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '180',
    },
})
