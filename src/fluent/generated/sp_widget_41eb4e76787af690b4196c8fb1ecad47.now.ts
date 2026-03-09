import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['41eb4e76787af690b4196c8fb1ecad47'],
    name: 'sw-request-card',
    clientScript: `api.controller=function() {
  'use strict';

  var c = this;

  /**
   * Navigate to the workbench page for the current request.
   * Uses $location to update the URL with the request sys_id.
   */
  c.openRequest = function () {
    if (!c.data.sys_id) {
      return;
    }

    var url = '?id=sw_workbench&request_id=' + c.data.sys_id;

    if (c.data.use_location && c.$inject && c.$inject.$location) {
      c.$inject.$location.search({
        id: 'sw_workbench',
        request_id: c.data.sys_id
      });
    } else {
      window.location.href = url;
    }
  };
};`,
    serverScript: `/**
 * sw-request-card - Server Script
 *
 * Receives request data via widget options or loads by sys_id parameter
 * using SmartWorkspaceUtil with configurable table names.
 *
 * Widget Options:
 *   request_data - JSON object with request fields (passed from parent widget)
 *   + All shared_data_source_options from widget-options-schema.json
 *
 * URL Parameters:
 *   request_id   - sys_id of the request record to load
 */
(function () {
  'use strict';

  // If request_data is provided directly via options, use it
  if (options.request_data) {
    var rd = options.request_data;
    data.sys_id = rd.sys_id || '';
    data.number = rd.number || '';
    data.customer_name = rd.customer_name || '';
    data.request_type = rd.request_type || '';
    data.status = rd.status || '';
    data.status_class = _toStatusClass(rd.status);
    data.priority = rd.priority || '';
    data.priority_class = _toPriorityClass(rd.priority);
    data.due_date = rd.due_date || '';
    data.assigned_to = rd.assigned_to || '';
    return;
  }

  // Otherwise, load by sys_id from URL parameter or option
  var sysId = $sp.getParameter('request_id') || options.sys_id || '';

  if (sysId) {
    // Use SmartWorkspaceConfig for configurable table names
    var cfg = new x_dxcis_smart_st_0.SmartWorkspaceConfig(options);
    var util = new x_dxcis_smart_st_0.SmartWorkspaceUtil(cfg.getTables());
    var request = util.getRequestById(sysId);

    if (request) {
      data.sys_id = request.sys_id || '';
      data.number = request.number || '';
      data.customer_name = request.customer_name || '';
      data.request_type = request.request_type || '';
      data.status = request.status || '';
      data.status_class = _toStatusClass(request.status);
      data.priority = request.priority || '';
      data.priority_class = _toPriorityClass(request.priority);
      data.due_date = request.due_date || '';
      data.assigned_to = request.assigned_to || '';
    }
  }

  /**
   * Convert a status display value to a CSS class suffix.
   * @param {string} status
   * @returns {string}
   */
  function _toStatusClass(status) {
    if (!status) return '';
    return status.toLowerCase().replace(/\\s+/g, '-');
  }

  /**
   * Convert a priority display value to a CSS class suffix.
   * @param {string} priority
   * @returns {string}
   */
  function _toPriorityClass(priority) {
    if (!priority) return 'medium';
    var p = priority.toLowerCase();
    if (p.indexOf('urgent') > -1 || p.indexOf('critical') > -1 || p === '1') return 'urgent';
    if (p.indexOf('high') > -1 || p === '2') return 'high';
    if (p.indexOf('medium') > -1 || p === '3') return 'medium';
    if (p.indexOf('low') > -1 || p === '4') return 'low';
    return 'medium';
  }

})();
`,
    htmlTemplate: `<!-- sw-request-card: Clickable request card with priority border -->
<div class="sw-request-card sw-animate-fade-in"
     ng-class="'sw-request-card--priority-' + c.data.priority_class"
     ng-click="c.openRequest()"
     role="button"
     tabindex="0"
     aria-label="Open request {{c.data.number}}">

  <div class="sw-request-card__header">
    <div class="sw-request-card__customer">{{c.data.customer_name}}</div>
    <span class="sw-badge"
          ng-class="'sw-badge--' + c.data.status_class">
      {{c.data.status}}
    </span>
  </div>

  <div class="sw-request-card__meta">
    <span class="sw-request-card__number">{{c.data.number}}</span>
    <span class="sw-request-card__separator">&middot;</span>
    <span class="sw-request-card__type">{{c.data.request_type}}</span>
  </div>

  <div class="sw-request-card__details">
    <div class="sw-request-card__detail">
      <span class="sw-priority"
            ng-class="'sw-priority--' + c.data.priority_class">
        <i class="material-icons">flag</i>
        {{c.data.priority}}
      </span>
    </div>

    <div class="sw-request-card__detail" ng-if="c.data.due_date">
      <i class="material-icons sw-request-card__detail-icon">schedule</i>
      <span>{{c.data.due_date}}</span>
    </div>

    <div class="sw-request-card__detail" ng-if="c.data.assigned_to">
      <i class="material-icons sw-request-card__detail-icon">person</i>
      <span>{{c.data.assigned_to}}</span>
    </div>
  </div>
</div>
`,
    customCss: `/* =============================================================================&#13;
   sw-request-card - Clickable Request Card Styles&#13;
   ============================================================================= */&#13;
&#13;
.sw-request-card {&#13;
  display: flex;&#13;
  flex-direction: column;&#13;
  gap: var(--sw-spacing-sm);&#13;
  padding: var(--sw-spacing-md) var(--sw-spacing-lg);&#13;
  background-color: var(--sw-color-bg-primary);&#13;
  border: 1px solid var(--sw-color-border-light);&#13;
  border-left: 4px solid var(--sw-color-border);&#13;
  border-radius: var(--sw-radius-md);&#13;
  box-shadow: var(--sw-shadow-sm);&#13;
  cursor: pointer;&#13;
  transition: box-shadow var(--sw-transition-normal),&#13;
              transform var(--sw-transition-normal);&#13;
&#13;
  &:hover {&#13;
    box-shadow: var(--sw-shadow-md);&#13;
    transform: translateY(-1px);&#13;
  }&#13;
&#13;
  &:active {&#13;
    transform: translateY(0);&#13;
  }&#13;
&#13;
  // Priority color left border&#13;
  &--priority-urgent {&#13;
    border-left-color: var(--sw-priority-urgent);&#13;
  }&#13;
&#13;
  &--priority-high {&#13;
    border-left-color: var(--sw-priority-high);&#13;
  }&#13;
&#13;
  &--priority-medium {&#13;
    border-left-color: var(--sw-priority-medium);&#13;
  }&#13;
&#13;
  &--priority-low {&#13;
    border-left-color: var(--sw-priority-low);&#13;
  }&#13;
}&#13;
&#13;
.sw-request-card__header {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  justify-content: space-between;&#13;
  gap: var(--sw-spacing-sm);&#13;
}&#13;
&#13;
.sw-request-card__customer {&#13;
  font-size: var(--sw-font-size-base);&#13;
  font-weight: var(--sw-font-weight-semibold);&#13;
  color: var(--sw-color-text-primary);&#13;
  white-space: nowrap;&#13;
  overflow: hidden;&#13;
  text-overflow: ellipsis;&#13;
}&#13;
&#13;
.sw-request-card__meta {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  gap: var(--sw-spacing-xs);&#13;
  font-size: var(--sw-font-size-sm);&#13;
  color: var(--sw-color-text-secondary);&#13;
}&#13;
&#13;
.sw-request-card__number {&#13;
  font-weight: var(--sw-font-weight-medium);&#13;
  color: var(--sw-color-primary);&#13;
}&#13;
&#13;
.sw-request-card__separator {&#13;
  color: var(--sw-color-text-tertiary);&#13;
}&#13;
&#13;
.sw-request-card__type {&#13;
  color: var(--sw-color-text-secondary);&#13;
}&#13;
&#13;
.sw-request-card__details {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  flex-wrap: wrap;&#13;
  gap: var(--sw-spacing-md);&#13;
  margin-top: var(--sw-spacing-xs);&#13;
}&#13;
&#13;
.sw-request-card__detail {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  gap: var(--sw-spacing-xs);&#13;
  font-size: var(--sw-font-size-sm);&#13;
  color: var(--sw-color-text-secondary);&#13;
}&#13;
&#13;
.sw-request-card__detail-icon {&#13;
  font-size: 16px;&#13;
  color: var(--sw-color-text-tertiary);&#13;
}&#13;`,
    id: 'sw-request-card',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
})
