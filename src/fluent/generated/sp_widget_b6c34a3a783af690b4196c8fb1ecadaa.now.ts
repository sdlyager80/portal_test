import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['b6c34a3a783af690b4196c8fb1ecadaa'],
    name: 'sw-work-queue',
    clientScript: `api.controller = function($scope, $location, $rootScope) {
    /* jshint validthis: true */
    var c = this;

    c.activeTab = 0;
    c.viewMode = 'cards';
    c.filteredRequests = [];
    c.urgentRequests = [];

    // Check URL params for initial tab
    var tabParam = $location.search().tab;
    if (tabParam === 'my_work') c.activeTab = 0;

    // Initialize filtered data
    filterRequests();

    c.setTab = function(tabIndex) {
        c.activeTab = tabIndex;
        filterRequests();
    };

    c.setViewMode = function(mode) {
        c.viewMode = mode;
    };

    c.openRequest = function(req) {
        // Navigate to workbench page with request_id parameter
        var url = '?id=sw_workbench&request_id=' + req.sys_id;
        window.location.href = url;
    };

    c.getPriorityColor = function(priority) {
        var colors = {
            'urgent': 'var(--sw-priority-urgent)',
            'high': 'var(--sw-priority-high)',
            'medium': 'var(--sw-priority-medium)',
            'low': 'var(--sw-priority-low)'
        };
        return colors[priority] || colors['medium'];
    };

    c.getStatusClass = function(status) {
        var classMap = {
            'in_progress': 'in-progress',
            'pending_review': 'pending-review',
            'awaiting_documents': 'awaiting-documents',
            'completed': 'completed',
            'cancelled': 'cancelled'
        };
        return classMap[status] || 'in-progress';
    };

    function filterRequests() {
        var all = c.data.allRequests || [];
        var myRequests = c.data.myRequests || [];

        switch (c.activeTab) {
            case 0: // My Work Queue
                c.filteredRequests = myRequests;
                break;
            case 1: // All Requests
                c.filteredRequests = all;
                break;
            case 2: // Urgent
                c.filteredRequests = all.filter(function(r) { return r.priority === '1'; });
                break;
        }

        // Urgent requests for "My Priorities" section
        c.urgentRequests = myRequests.filter(function(r) {
            return r.priority === '1' || r.priority === 'critical';
        }).slice(0, 5);
    }

    // Listen for request completed events to refresh
    $rootScope.$on('sw.request.completed', function() {
        c.server.update().then(function() {
            filterRequests();
        }).catch(function(err) {
            console.warn('Failed to refresh work queue', err);
        });
    });
};
`,
    serverScript: `(function() {
    // Build configurable table config from widget options
    var cfg = new x_dxcis_smart_st_0.SmartWorkspaceConfig(options);
    var util = new x_dxcis_smart_st_0.SmartWorkspaceUtil(cfg.getTables());
    var userId = gs.getUserID();

    // Default empty arrays
    data.myRequests = [];
    data.allRequests = [];
	data.urgentReqs = [];

    try {
        // Load all three filtered sets
        data.myRequests = util.getRequestsForUser(userId, 'my_work');
        data.allRequests = util.getRequestsForUser(userId, 'all');
		data.urgentReqs = data.allRequests.filter(function(r) { return r.priority === '1'; });
    } catch (e) {
        gs.warn('sw-work-queue: Error loading requests - ' + e.message);
    }
})();
`,
    htmlTemplate: `<div class="sw-work-queue sw-animate-slide-up">
    <!-- Header row: title + view toggle buttons -->
    <div class="sw-work-queue__header">
        <h2 class="sw-work-queue__title">Work Queue</h2>
        <div class="sw-work-queue__actions">
            <button class="sw-btn sw-btn--ghost sw-btn--sm"
                    ng-class="{'sw-btn--active': c.viewMode === 'cards'}"
                    ng-click="c.setViewMode('cards')">
                <i class="material-icons">grid_view</i>
            </button>
            <button class="sw-btn sw-btn--ghost sw-btn--sm"
                    ng-class="{'sw-btn--active': c.viewMode === 'table'}"
                    ng-click="c.setViewMode('table')">
                <i class="material-icons">view_list</i>
            </button>
        </div>
    </div>

    <!-- Tabs -->
    <div class="sw-tabs">
        <button class="sw-tabs__tab"
                ng-class="{'sw-tabs__tab--active': c.activeTab === 0}"
                ng-click="c.setTab(0)">
            My Work Queue <span class="sw-work-queue__count">{{c.data.myRequests.length}}</span>
        </button>
        <button class="sw-tabs__tab"
                ng-class="{'sw-tabs__tab--active': c.activeTab === 1}"
                ng-click="c.setTab(1)">
            All Requests <span class="sw-work-queue__count">{{c.data.allRequests.length}}</span>
        </button>
        <button class="sw-tabs__tab"
                ng-class="{'sw-tabs__tab--active': c.activeTab === 2}"
                ng-click="c.setTab(2)">
            Urgent <span class="sw-work-queue__count">{{c.data.urgentReqs.length}}</span>
        </button>
    </div>

    <!-- Card View -->
    <div class="sw-work-queue__grid" ng-if="c.viewMode === 'cards'">
        <div class="sw-request-card" ng-repeat="req in c.filteredRequests track by req.sys_id"
             ng-click="c.openRequest(req)"
             ng-style="{'border-left-color': c.getPriorityColor(req.priority)}">
            <div class="sw-request-card__header">
                <span class="sw-request-card__number">{{req.number}}</span>
                <span class="sw-badge sw-badge--{{c.getStatusClass(req.status)}}">{{req.status_display}}</span>
            </div>
            <div class="sw-request-card__customer">{{req.customer_name}}</div>
            <div class="sw-request-card__type">{{req.request_type_display}}</div>
            <div class="sw-request-card__footer">
                <span class="sw-priority sw-priority--{{req.priority}}">
                    <i class="material-icons">flag</i> {{req.priority_display}}
                </span>
                <span class="sw-request-card__date">
                    <i class="material-icons">event</i> {{req.due_date}}
                </span>
            </div>
        </div>
    </div>

    <!-- Table View -->
    <div class="sw-work-queue__table-wrap" ng-if="c.viewMode === 'table'">
        <table class="sw-table">
            <thead>
                <tr>
                    <th>Request #</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Assigned To</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr ng-repeat="req in c.filteredRequests track by req.sys_id">
                    <td>{{req.number}}</td>
                    <td>{{req.customer_name}}</td>
                    <td>{{req.request_type_display}}</td>
                    <td><span class="sw-badge sw-badge--{{c.getStatusClass(req.status)}}">{{req.status_display}}</span></td>
                    <td><span class="sw-priority sw-priority--{{req.priority}}"><i class="material-icons">flag</i> {{req.priority_display}}</span></td>
                    <td>{{req.due_date}}</td>
                    <td>{{req.assigned_to_display}}</td>
                    <td><button class="sw-btn sw-btn--secondary sw-btn--sm" ng-click="c.openRequest(req)">Open</button></td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- My Priorities section (only on My Work tab) -->
    <div class="sw-work-queue__priorities" ng-if="c.activeTab === 0 && c.urgentRequests.length > 0">
        <h3 class="sw-work-queue__subtitle">
            <i class="material-icons sw-text-error">warning</i> My Priorities
        </h3>
        <div class="sw-priority-list">
            <div class="sw-priority-item" ng-repeat="req in c.urgentRequests track by req.sys_id"
                 ng-click="c.openRequest(req)">
                <span class="sw-priority sw-priority--{{req.priority}}">
                    <i class="material-icons">flag</i>
                </span>
                <span class="sw-priority-item__name">{{req.customer_name}}</span>
                <span class="sw-priority-item__type">{{req.request_type_display}}</span>
                <span class="sw-priority-item__date">Due: {{req.due_date}}</span>
            </div>
        </div>
    </div>
</div>
`,
    customCss: `/* ==========================================================================&#13;
   sw-work-queue&#13;
   Main work queue widget with tabs, card/table views, and priorities&#13;
   ========================================================================== */&#13;
&#13;
.sw-work-queue {&#13;
    background-color: var(--sw-color-surface, #ffffff);&#13;
    border-radius: var(--sw-border-radius-lg, 12px);&#13;
    box-shadow: var(--sw-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08));&#13;
&#13;
    /* Fluid padding */&#13;
    padding: clamp(16px, 2.5vw, 32px);&#13;
&#13;
    /* NEW: visual breathing room */&#13;
    margin-top: clamp(16px, 3vh, 32px);&#13;
}&#13;
&#13;
&#13;
/* Animation */&#13;
.sw-animate-slide-up {&#13;
    animation: sw-slide-up 0.35s ease-out;&#13;
}&#13;
&#13;
@keyframes sw-slide-up {&#13;
    from {&#13;
        opacity: 0;&#13;
        transform: translateY(12px);&#13;
    }&#13;
    to {&#13;
        opacity: 1;&#13;
        transform: translateY(0);&#13;
    }&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Header&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-work-queue__header {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    justify-content: space-between;&#13;
    margin-bottom: var(--sw-spacing-md, 16px);&#13;
}&#13;
&#13;
.sw-work-queue__title {&#13;
    font-size: clamp(1.2rem, 2vw, 1.6rem);&#13;
    font-weight: 700;&#13;
    color: var(--sw-color-text-primary, #1a1a2e);&#13;
    margin: 0;&#13;
}&#13;
&#13;
.sw-work-queue__actions {&#13;
    display: flex;&#13;
    gap: var(--sw-spacing-xs, 4px);&#13;
}&#13;
&#13;
/* Toggle buttons */&#13;
.sw-btn--ghost {&#13;
    background: transparent;&#13;
    border: 1px solid var(--sw-color-border, #e5e7eb);&#13;
    color: var(--sw-color-text-muted, #6b7280);&#13;
    border-radius: var(--sw-border-radius-sm, 6px);&#13;
    cursor: pointer;&#13;
    padding: var(--sw-spacing-xs, 4px) var(--sw-spacing-sm, 8px);&#13;
    display: inline-flex;&#13;
    align-items: center;&#13;
    justify-content: center;&#13;
    transition: all 0.15s ease;&#13;
&#13;
    .material-icons {&#13;
        font-size: 20px;&#13;
    }&#13;
&#13;
    &:hover {&#13;
        background-color: var(--sw-color-bg-hover, #f3f4f6);&#13;
        color: var(--sw-color-text-primary, #1a1a2e);&#13;
    }&#13;
&#13;
    &.sw-btn--active {&#13;
        background-color: var(--sw-color-primary, #4f46e5);&#13;
        border-color: var(--sw-color-primary, #4f46e5);&#13;
        color: var(--sw-color-on-primary, #ffffff);&#13;
    }&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Tabs&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-tabs {&#13;
    display: flex;&#13;
    gap: var(--sw-spacing-xs, 4px);&#13;
    border-bottom: 1px solid var(--sw-color-border, #e5e7eb);&#13;
    margin-bottom: var(--sw-spacing-lg, 24px);&#13;
}&#13;
&#13;
.sw-tabs__tab {&#13;
    position: relative;&#13;
    background: transparent;&#13;
    border: none;&#13;
    font-size: clamp(0.85rem, 1.2vw, 1rem);&#13;
    padding: clamp(8px, 1.5vw, 12px)&#13;
             clamp(12px, 2vw, 20px);&#13;
    font-weight: var(--sw-font-weight-medium, 500);&#13;
    color: var(--sw-color-text-muted, #6b7280);&#13;
    cursor: pointer;&#13;
    transition: color 0.15s ease;&#13;
    white-space: nowrap;&#13;
&#13;
    &:hover {&#13;
        color: var(--sw-color-text-primary, #1a1a2e);&#13;
    }&#13;
&#13;
    &--active {&#13;
        color: var(--sw-color-primary, #4f46e5);&#13;
&#13;
        &::after {&#13;
            content: '';&#13;
            position: absolute;&#13;
            bottom: -1px;&#13;
            left: 0;&#13;
            right: 0;&#13;
            height: 2px;&#13;
            background-color: var(--sw-color-primary, #4f46e5);&#13;
            border-radius: 2px 2px 0 0;&#13;
        }&#13;
    }&#13;
}&#13;
&#13;
.sw-work-queue__count {&#13;
    display: inline-flex;&#13;
    align-items: center;&#13;
    justify-content: center;&#13;
    min-width: 20px;&#13;
    height: 20px;&#13;
    padding: 0 6px;&#13;
    font-size: var(--sw-font-size-xs, 0.75rem);&#13;
    font-weight: var(--sw-font-weight-semibold, 600);&#13;
    background-color: var(--sw-color-primary-light, #eef2ff);&#13;
    color: var(--sw-color-primary, #4f46e5);&#13;
    border-radius: var(--sw-border-radius-full, 50px);&#13;
    margin-left: var(--sw-spacing-xs, 4px);&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Card View (Grid)&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-work-queue__grid {&#13;
    display: grid;&#13;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));&#13;
    gap: clamp(12px, 2vw, 24px);&#13;
}&#13;
&#13;
.sw-request-card {&#13;
    background-color: var(--sw-color-surface, #ffffff);&#13;
    border: 1px solid var(--sw-color-border, #e5e7eb);&#13;
    border-left: 4px solid var(--sw-color-border, #e5e7eb);&#13;
    border-radius: var(--sw-border-radius-md, 8px);&#13;
    padding: var(--sw-spacing-md, 16px);&#13;
    cursor: pointer;&#13;
    transition: box-shadow 0.2s ease, transform 0.2s ease;&#13;
&#13;
    &:hover {&#13;
        box-shadow: var(--sw-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.12));&#13;
        transform: translateY(-1px);&#13;
    }&#13;
}&#13;
&#13;
.sw-request-card__header {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    justify-content: space-between;&#13;
    margin-bottom: var(--sw-spacing-sm, 8px);&#13;
}&#13;
&#13;
.sw-request-card__number {&#13;
    font-size: var(--sw-font-size-sm, 0.875rem);&#13;
    font-weight: var(--sw-font-weight-semibold, 600);&#13;
    color: var(--sw-color-primary, #4f46e5);&#13;
}&#13;
&#13;
.sw-request-card__customer {&#13;
    font-size: clamp(1rem, 1.5vw, 1.2rem);&#13;
    font-weight: var(--sw-font-weight-semibold, 600);&#13;
    color: var(--sw-color-text-primary, #1a1a2e);&#13;
    margin-bottom: var(--sw-spacing-xs, 4px);&#13;
}&#13;
&#13;
.sw-request-card__type {&#13;
    font-size: var(--sw-font-size-sm, 0.875rem);&#13;
    color: var(--sw-color-text-muted, #6b7280);&#13;
    margin-bottom: var(--sw-spacing-md, 16px);&#13;
}&#13;
&#13;
.sw-request-card__footer {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    justify-content: space-between;&#13;
    font-size: var(--sw-font-size-xs, 0.75rem);&#13;
    color: var(--sw-color-text-muted, #6b7280);&#13;
}&#13;
&#13;
.sw-request-card__date {&#13;
    display: inline-flex;&#13;
    align-items: center;&#13;
    gap: var(--sw-spacing-xs, 4px);&#13;
&#13;
    .material-icons {&#13;
        font-size: 14px;&#13;
    }&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Badges&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-badge {&#13;
    display: inline-flex;&#13;
    align-items: center;&#13;
    padding: 2px 8px;&#13;
    font-size: var(--sw-font-size-xs, 0.75rem);&#13;
    font-weight: var(--sw-font-weight-medium, 500);&#13;
    border-radius: var(--sw-border-radius-full, 50px);&#13;
    white-space: nowrap;&#13;
&#13;
    &--in-progress {&#13;
        background-color: var(--sw-color-primary-light, #eef2ff);&#13;
        color: var(--sw-color-primary, #4f46e5);&#13;
    }&#13;
&#13;
    &--pending-review {&#13;
        background-color: var(--sw-color-warning-light, #fef3c7);&#13;
        color: var(--sw-color-warning, #d97706);&#13;
    }&#13;
&#13;
    &--awaiting-documents {&#13;
        background-color: var(--sw-color-info-light, #dbeafe);&#13;
        color: var(--sw-color-info, #2563eb);&#13;
    }&#13;
&#13;
    &--completed {&#13;
        background-color: var(--sw-color-success-light, #d1fae5);&#13;
        color: var(--sw-color-success, #059669);&#13;
    }&#13;
&#13;
    &--cancelled {&#13;
        background-color: var(--sw-color-error-light, #fee2e2);&#13;
        color: var(--sw-color-error, #dc2626);&#13;
    }&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Priority indicator&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-priority {&#13;
    display: inline-flex;&#13;
    align-items: center;&#13;
    gap: 2px;&#13;
    font-size: var(--sw-font-size-xs, 0.75rem);&#13;
    font-weight: var(--sw-font-weight-medium, 500);&#13;
&#13;
    .material-icons {&#13;
        font-size: 14px;&#13;
    }&#13;
&#13;
    &--urgent {&#13;
        color: var(--sw-priority-urgent, #dc2626);&#13;
    }&#13;
&#13;
    &--high {&#13;
        color: var(--sw-priority-high, #ea580c);&#13;
    }&#13;
&#13;
    &--medium {&#13;
        color: var(--sw-priority-medium, #d97706);&#13;
    }&#13;
&#13;
    &--low {&#13;
        color: var(--sw-priority-low, #059669);&#13;
    }&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Table View&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-work-queue__table-wrap {&#13;
    overflow-x: auto;&#13;
    -webkit-overflow-scrolling: touch;&#13;
}&#13;
&#13;
.sw-table {&#13;
    width: 100%;&#13;
    border-collapse: collapse;&#13;
    font-size: var(--sw-font-size-sm, 0.875rem);&#13;
&#13;
    thead {&#13;
        th {&#13;
            text-align: left;&#13;
            padding: var(--sw-spacing-sm, 8px) var(--sw-spacing-md, 16px);&#13;
            font-weight: var(--sw-font-weight-semibold, 600);&#13;
            color: var(--sw-color-text-muted, #6b7280);&#13;
            font-size: var(--sw-font-size-xs, 0.75rem);&#13;
            text-transform: uppercase;&#13;
            letter-spacing: 0.05em;&#13;
            border-bottom: 1px solid var(--sw-color-border, #e5e7eb);&#13;
            white-space: nowrap;&#13;
        }&#13;
    }&#13;
&#13;
    tbody {&#13;
        tr {&#13;
            border-bottom: 1px solid var(--sw-color-border-light, #f3f4f6);&#13;
            transition: background-color 0.15s ease;&#13;
&#13;
            &:hover {&#13;
                background-color: var(--sw-color-bg-hover, #f9fafb);&#13;
            }&#13;
&#13;
            &:last-child {&#13;
                border-bottom: none;&#13;
            }&#13;
        }&#13;
&#13;
        td {&#13;
            padding: var(--sw-spacing-sm, 12px) var(--sw-spacing-md, 16px);&#13;
            color: var(--sw-color-text-primary, #1a1a2e);&#13;
            white-space: nowrap;&#13;
        }&#13;
    }&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Buttons (shared)&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-btn {&#13;
    display: inline-flex;&#13;
    align-items: center;&#13;
    justify-content: center;&#13;
    gap: var(--sw-spacing-xs, 4px);&#13;
    border: none;&#13;
    border-radius: var(--sw-border-radius-sm, 6px);&#13;
    font-weight: var(--sw-font-weight-medium, 500);&#13;
    cursor: pointer;&#13;
    transition: all 0.15s ease;&#13;
    white-space: nowrap;&#13;
&#13;
    &--sm {&#13;
        padding: var(--sw-spacing-xs, 4px) var(--sw-spacing-sm, 8px);&#13;
        font-size: var(--sw-font-size-xs, 0.75rem);&#13;
    }&#13;
&#13;
    &--secondary {&#13;
        background-color: var(--sw-color-primary-light, #eef2ff);&#13;
        color: var(--sw-color-primary, #4f46e5);&#13;
        border: 1px solid transparent;&#13;
&#13;
        &:hover {&#13;
            background-color: var(--sw-color-primary, #4f46e5);&#13;
            color: var(--sw-color-on-primary, #ffffff);&#13;
        }&#13;
    }&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   My Priorities Section&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-work-queue__priorities {&#13;
    margin-top: var(--sw-spacing-lg, 24px);&#13;
    padding-top: var(--sw-spacing-lg, 24px);&#13;
    border-top: 1px solid var(--sw-color-border, #e5e7eb);&#13;
}&#13;
&#13;
.sw-work-queue__subtitle {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    gap: var(--sw-spacing-sm, 8px);&#13;
    font-size: var(--sw-font-size-base, 1rem);&#13;
    font-weight: var(--sw-font-weight-semibold, 600);&#13;
    color: var(--sw-color-text-primary, #1a1a2e);&#13;
    margin: 0 0 var(--sw-spacing-md, 16px) 0;&#13;
&#13;
    .material-icons {&#13;
        font-size: 20px;&#13;
    }&#13;
}&#13;
&#13;
.sw-text-error {&#13;
    color: var(--sw-color-error, #dc2626);&#13;
}&#13;
&#13;
.sw-priority-list {&#13;
    display: flex;&#13;
    flex-direction: column;&#13;
    gap: var(--sw-spacing-xs, 4px);&#13;
}&#13;
&#13;
.sw-priority-item {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    gap: var(--sw-spacing-md, 16px);&#13;
    padding: var(--sw-spacing-sm, 10px) var(--sw-spacing-md, 16px);&#13;
    background-color: var(--sw-color-bg-subtle, #f9fafb);&#13;
    border-radius: var(--sw-border-radius-sm, 6px);&#13;
    cursor: pointer;&#13;
    transition: background-color 0.15s ease;&#13;
&#13;
    &:hover {&#13;
        background-color: var(--sw-color-bg-hover, #f3f4f6);&#13;
    }&#13;
}&#13;
&#13;
.sw-priority-item__name {&#13;
    font-weight: var(--sw-font-weight-semibold, 600);&#13;
    color: var(--sw-color-text-primary, #1a1a2e);&#13;
    font-size: var(--sw-font-size-sm, 0.875rem);&#13;
}&#13;
&#13;
.sw-priority-item__type {&#13;
    font-size: var(--sw-font-size-sm, 0.875rem);&#13;
    color: var(--sw-color-text-muted, #6b7280);&#13;
    flex: 1;&#13;
}&#13;
&#13;
.sw-priority-item__date {&#13;
    font-size: var(--sw-font-size-xs, 0.75rem);&#13;
    color: var(--sw-color-text-tertiary, #9ca3af);&#13;
    white-space: nowrap;&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Responsive&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
@media (max-width: 768px) {&#13;
    .sw-work-queue {&#13;
        padding: var(--sw-spacing-md, 16px);&#13;
    }&#13;
&#13;
    .sw-work-queue__grid {&#13;
        grid-template-columns: 1fr;&#13;
    }&#13;
&#13;
    .sw-tabs {&#13;
        overflow-x: auto;&#13;
        -webkit-overflow-scrolling: touch;&#13;
    }&#13;
&#13;
    .sw-priority-item {&#13;
        flex-wrap: wrap;&#13;
        gap: var(--sw-spacing-sm, 8px);&#13;
    }&#13;
&#13;
    .sw-priority-item__type {&#13;
        flex: none;&#13;
        width: 100%;&#13;
        padding-left: 30px;&#13;
    }&#13;
&#13;
    .sw-priority-item__date {&#13;
        padding-left: 30px;&#13;
    }&#13;
}&#13;`,
    id: 'sw-work-queue',
})
