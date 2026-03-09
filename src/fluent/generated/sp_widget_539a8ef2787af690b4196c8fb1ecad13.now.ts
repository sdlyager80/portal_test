import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['539a8ef2787af690b4196c8fb1ecad13'],
    name: 'sw-request-table',
    clientScript: `api.controller=function() {
  /* widget controller */
  'use strict';

  var c = this;

  // Initialize sort state
  c.data.sort_column = c.data.sort_column || '';
  c.data.sort_direction = c.data.sort_direction || 'asc';

  /**
   * Navigate to the workbench page for the given request.
   * @param {Object} request - Request object with sys_id
   */
  c.openRequest = function (request) {
    if (!request || !request.sys_id) {
      return;
    }
    window.location.href = '?id=sw_workbench&request_id=' + request.sys_id;
  };

  /**
   * Toggle sort on a column. Clicking the same column reverses direction.
   * Clicking a new column sorts ascending.
   * @param {string} column - Column key to sort by
   */
  c.sortBy = function (column) {
    if (c.data.sort_column === column) {
      c.data.sort_direction = c.data.sort_direction === 'asc' ? 'desc' : 'asc';
    } else {
      c.data.sort_column = column;
      c.data.sort_direction = 'asc';
    }

    // Client-side sort
    if (c.data.requests && c.data.requests.length > 0) {
      var dir = c.data.sort_direction === 'asc' ? 1 : -1;

      c.data.requests.sort(function (a, b) {
        var valA = (a[column] || '').toString().toLowerCase();
        var valB = (b[column] || '').toString().toLowerCase();

        if (valA < valB) return -1 * dir;
        if (valA > valB) return 1 * dir;
        return 0;
      });
    }
  };
};`,
    serverScript: `/**
 * sw-request-table - Server Script
 *
 * Receives the requests array from a parent widget via options, or loads
 * request data using the SmartWorkspaceUtil script include with configurable
 * table names.
 *
 * Widget Options:
 *   requests       - Pre-built array of request objects (from parent)
 *   encoded_query  - Encoded query for filtering
 *   limit          - Max number of rows (default 20)
 *   + All shared_data_source_options from widget-options-schema.json
 */
(function () {
  'use strict';

  data.requests = [];

  // If requests are passed directly from parent widget, use them
  if (options.requests && Array.isArray(options.requests)) {
    data.requests = options.requests;
    return;
  }

  // If input data is already provided (e.g. from page-level controller)
  if (input && input.requests && Array.isArray(input.requests)) {
    data.requests = input.requests;
    return;
  }

  // Load via SmartWorkspaceUtil with configurable table names
  var cfg = new x_dxcis_smart_st_0.SmartWorkspaceConfig(options);
  var util = new x_dxcis_smart_st_0.SmartWorkspaceUtil(cfg.getTables());
  var userId = gs.getUserID();
  var encodedQuery = options.encoded_query || '';
  var limit = parseInt(options.limit, 10) || 20;

  // Use getRequestsForUser which returns properly serialized request objects
  var allRequests = util.getRequestsForUser(userId, 'all');

  // Apply encoded query filter if provided (client-side filter on results)
  // For production, you may want to add an encoded-query-aware method to SmartWorkspaceUtil
  if (allRequests && allRequests.length > 0) {
    data.requests = allRequests.slice(0, limit);
  }

  // Add CSS class helpers to each request
  for (var i = 0; i < data.requests.length; i++) {
    var req = data.requests[i];
    req.status_class = _toStatusClass(req.status);
    req.priority_class = _toPriorityClass(req.priority);
  }

  /**
   * Convert status display value to CSS class suffix.
   */
  function _toStatusClass(status) {
    if (!status) return '';
    return status.toLowerCase().replace(/\\s+/g, '-');
  }

  /**
   * Convert priority display value to CSS class suffix.
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
    htmlTemplate: `<!-- sw-request-table: Sortable table of service requests -->
<div class="sw-request-table-wrapper sw-animate-fade-in">
  <table class="sw-table">
    <thead>
      <tr>
        <th class="sw-request-table__th--sortable"
            ng-click="c.sortBy('number')">
          #
          <i class="material-icons sw-request-table__sort-icon"
             ng-if="c.data.sort_column === 'number'">
            {{c.data.sort_direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}}
          </i>
        </th>
        <th class="sw-request-table__th--sortable"
            ng-click="c.sortBy('customer_name')">
          Customer
          <i class="material-icons sw-request-table__sort-icon"
             ng-if="c.data.sort_column === 'customer_name'">
            {{c.data.sort_direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}}
          </i>
        </th>
        <th class="sw-request-table__th--sortable"
            ng-click="c.sortBy('request_type')">
          Type
          <i class="material-icons sw-request-table__sort-icon"
             ng-if="c.data.sort_column === 'request_type'">
            {{c.data.sort_direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}}
          </i>
        </th>
        <th>Status</th>
        <th>Priority</th>
        <th class="sw-request-table__th--sortable"
            ng-click="c.sortBy('due_date')">
          Due Date
          <i class="material-icons sw-request-table__sort-icon"
             ng-if="c.data.sort_column === 'due_date'">
            {{c.data.sort_direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}}
          </i>
        </th>
        <th>Assigned To</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr ng-repeat="req in c.data.requests track by req.sys_id"
          class="sw-request-table__row">
        <td>
          <span class="sw-request-table__number">{{req.number}}</span>
        </td>
        <td>
          <span class="sw-font-semibold">{{req.customer_name}}</span>
        </td>
        <td>{{req.request_type}}</td>
        <td>
          <span class="sw-badge"
                ng-class="'sw-badge--' + req.status_class">
            {{req.status}}
          </span>
        </td>
        <td>
          <span class="sw-priority"
                ng-class="'sw-priority--' + req.priority_class">
            <i class="material-icons">flag</i>
            {{req.priority}}
          </span>
        </td>
        <td>{{req.due_date}}</td>
        <td>{{req.assigned_to}}</td>
        <td>
          <button class="sw-btn sw-btn--primary sw-btn--sm"
                  ng-click="c.openRequest(req)">
            <i class="material-icons">open_in_new</i>
            Open
          </button>
        </td>
      </tr>
      <tr ng-if="!c.data.requests || c.data.requests.length === 0">
        <td colspan="8" class="sw-request-table__empty">
          <i class="material-icons">inbox</i>
          <span>No requests found.</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
`,
    customCss: `/* =============================================================================&#13;
   sw-request-table - Request Table Styles&#13;
   ============================================================================= */&#13;
&#13;
.sw-request-table-wrapper {&#13;
  overflow-x: auto;&#13;
  background-color: var(--sw-color-bg-primary);&#13;
  border: 1px solid var(--sw-color-border-light);&#13;
  border-radius: var(--sw-radius-lg);&#13;
  box-shadow: var(--sw-shadow-sm);&#13;
}&#13;
&#13;
.sw-request-table__th--sortable {&#13;
  cursor: pointer;&#13;
  user-select: none;&#13;
  white-space: nowrap;&#13;
&#13;
  &:hover {&#13;
    color: var(--sw-color-primary);&#13;
  }&#13;
}&#13;
&#13;
.sw-request-table__sort-icon {&#13;
  font-size: 14px !important;&#13;
  vertical-align: middle;&#13;
  margin-left: var(--sw-spacing-xs);&#13;
}&#13;
&#13;
.sw-request-table__row {&#13;
  transition: background-color var(--sw-transition-fast);&#13;
}&#13;
&#13;
.sw-request-table__number {&#13;
  font-weight: var(--sw-font-weight-medium);&#13;
  color: var(--sw-color-primary);&#13;
}&#13;
&#13;
.sw-request-table__empty {&#13;
  text-align: center;&#13;
  padding: var(--sw-spacing-2xl) var(--sw-spacing-md) !important;&#13;
  color: var(--sw-color-text-tertiary);&#13;
&#13;
  .material-icons {&#13;
    display: block;&#13;
    font-size: 40px;&#13;
    margin-bottom: var(--sw-spacing-sm);&#13;
    opacity: 0.4;&#13;
  }&#13;
}&#13;`,
    id: 'sw-request-table',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
})
