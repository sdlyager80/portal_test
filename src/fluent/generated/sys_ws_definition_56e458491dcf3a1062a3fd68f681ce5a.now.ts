import { RestApi } from '@servicenow/sdk/core'

RestApi({
    $id: Now.ID['56e458491dcf3a1062a3fd68f681ce5a'],
    name: 'Insurance Policy Servicing API',
    serviceId: 'policy_servicing',
    routes: [
        {
            $id: Now.ID['f84590891dcf3a1062a3fd68f681ce08'],
            name: 'GET Policy Servicing',
            consumes: 'application/json,application/xml,text/xml',
            script: `/**
 * ServiceNow Scripted REST API Resource Script
 *
 * SETUP INSTRUCTIONS:
 * 1. Navigate to: System Web Services > Scripted REST APIs
 * 2. Click "New" to create a new API
 *    - Name: Insurance Policy Servicing API
 *    - API ID: insurance_policy (or use your scope prefix)
 *    - Base API Path: /api/x_dxcis_smart_st_0/policy_servicing
 *      (Replace x_dxcis_smart_st_0 with your actual scope)
 *
 * 3. After creating the API, create a new Resource:
 *    - HTTP Method: GET
 *    - Name: Get App
 *    - Relative Path: /
 *    - Copy the script below into the Script field
 *
 * 4. IMPORTANT: Update the property name below to match YOUR scoped property
 *    Your property name: x_dxcis_smart_st_0.policy_servicing_app
 *
 * 5. Submit and activate the REST API
 *
 * ACCESS:
 * https://[your-instance].service-now.com/api/x_dxcis_smart_st_0/policy_servicing/
 */

(function process(request, response) {
  // IMPORTANT: Replace with your actual scoped property name
  // Format: [your_scope].property_servicing_app
  // Example: x_dxcis_smart_st_0.policy_servicing_app
  var propertyName = 'x_dxcis_smart_st_0.policy_servicing_app';

  // Retrieve the React app HTML from system property
  var html = gs.getProperty(propertyName);

  // If property doesn't exist or is empty, return error
  if (!html) {
    response.setStatus(500);
    response.setBody({
      error: 'Application not configured',
      message: 'System property ' + propertyName + ' is not set. Check the property name in sys_properties.'
    });
    return;
  }

  // Set response headers
  response.setContentType('text/html');
  response.setStatus(200);

  // Write HTML to response
  response.getStreamWriter().writeString(html);

})(request, response);
`,
            produces: 'application/json,application/xml,text/xml',
            enforceAcl: [],
            authorization: false,
            authentication: false,
            internalRole: false,
        },
    ],
})
