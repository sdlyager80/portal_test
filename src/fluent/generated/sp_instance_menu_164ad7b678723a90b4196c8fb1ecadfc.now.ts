import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['164ad7b678723a90b4196c8fb1ecadfc'],
    table: 'sp_instance_menu',
    data: {
        active: 'true',
        advanced_placeholder_dimensions: 'false',
        async_load: 'false',
        async_load_device_type: 'desktop,tablet,mobile',
        async_load_trigger: 'viewport',
        color: 'default',
        order: '1',
        placeholder_dimensions:
            '{&#13;	"mobile": {&#13;		"height": "250px",&#13;		"width": "100%"&#13;	},&#13;	"desktop": {&#13;		"height": "250px",&#13;		"width": "100%"&#13;	},&#13;	"tablet": {&#13;		"height": "250px",&#13;		"width": "100%"&#13;	}&#13;}',
        placeholder_dimensions_script:
            'function evaluateConfig(options) { return {	"mobile": {		"height": "250px",		"width": "100%"	},	"desktop": {		"height": "250px",		"width": "100%"	},	"tablet": {		"height": "250px",		"width": "100%"	}}; }',
        placeholder_template: `<!-- 
	AngularJS template with configurable options.
	Use the \`options\` object to control dynamic behavior.
	Example: Display an element when max row count is 10:
	<div ng-if="options.maxRowCount === 10"></div>
	The \`skeleton-container\` class is used for loading placeholders.
-->
	<div class="skeleton-container">
	<!-- Header Skeleton -->
	<div class="skeleton-box skeleton-header"></div>
	<!-- Body Skeleton -->
	<div class="skeleton-box skeleton-line"></div>
	<div class="skeleton-box skeleton-line small"></div>
	<div class="skeleton-box skeleton-line medium"></div>
</div>`,
        preserve_placeholder_size: 'false',
        size: 'md',
        title: 'Smart Workspace Main Menu',
        widget_parameters: `"items": [
    { "label": "Dashboard", "icon": "dashboard", "page": "sw_home", "order": 100 },
    { "label": "My Work Queue", "icon": "assignment", "page": "sw_home", "params": "tab=my_work", "order": 200 },
    { "label": "New Request", "icon": "add_circle", "page": "sw_new_request", "order": 300 },
    { "label": "Search Policies", "icon": "search", "page": "sw_search", "order": 400 },
    { "label": "Reports", "icon": "assessment", "page": "sw_reports", "order": 500 }
  ]`,
    },
})
