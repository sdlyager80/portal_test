import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['f25a638e6cb6365062a3bc17f1b0808e'],
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
        feature: '765a638e6cb6365062a3bc17f1b0808c',
        return_request: 'false',
        service_plan: '3a5a638e6cb6365062a3bc17f1b0808d',
        timeout_policy: 'continue_service_plan_execution',
        timeout_sec: '60',
    },
})
