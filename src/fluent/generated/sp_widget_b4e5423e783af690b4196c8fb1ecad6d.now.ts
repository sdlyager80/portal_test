import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['b4e5423e783af690b4196c8fb1ecad6d'],
    name: 'sw-workbench-header',
    clientScript: `api.controller = function($scope, $rootScope, $timeout) {
    var c = this;
    c.canComplete = false;
    c.showSuccess = false;

    c.goBack = function() {
        window.location.href = '?id=sw_home';
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

    c.reassign = function() {
        // Placeholder for reassign modal
        alert('Reassign functionality coming soon');
    };

    c.completeRequest = function() {
        if (!c.canComplete) return;
        c.server.get({
            action: 'complete',
            request_id: c.data.request.sys_id
        }).then(function(response) {
            if (response.data.success) {
                c.showSuccess = true;
                $rootScope.$broadcast('sw.request.completed');
                $timeout(function() {
                    window.location.href = '?id=sw_home';
                }, 2000);
            }
        }).catch(function(err) {
            console.warn('Failed to complete request', err);
        });
    };

    // Listen for checklist updates from the tabs widget
    $rootScope.$on('sw.checklist.updated', function(event, data) {
        c.canComplete = data.allRequiredComplete;
    });
};
`,
    serverScript: `(function() {
    var requestId = $sp.getParameter('request_id');
    if (!requestId) {
        data.error = 'No request specified';
        return;
    }

    // Build configurable table/role config from widget options
    var cfg = new x_dxcis_smart_st_0.SmartWorkspaceConfig(options);
    var sec = new x_dxcis_smart_st_0.SmartWorkspaceSecurity(cfg.getSecurity());
    var util = new x_dxcis_smart_st_0.SmartWorkspaceUtil(cfg.getTables());
    var userId = gs.getUserID();

    try {
        if (!sec.canViewRequest(userId, requestId)) {
            data.error = 'Access denied';
            return;
        }

        data.request = util.getRequestById(requestId);

        if (!data.request) {
            data.error = 'Request not found';
            return;
        }

        data.canComplete = sec.canCompleteRequest(userId, requestId);

        // Handle complete action
        if (input && input.action === 'complete') {
            var success = util.completeRequest(input.request_id);
            data.success = success;
        }
    } catch (e) {
        gs.warn('sw-workbench-header: Error - ' + e.message);
        data.error = 'An error occurred loading the request';
    }
})();
`,
    htmlTemplate: `<div class="sw-wb-header sw-animate-fade-in" ng-if="c.data.request">
    <div class="sw-wb-header__left">
        <button class="sw-btn sw-btn--ghost" ng-click="c.goBack()">
            <i class="material-icons">arrow_back</i> Back to Dashboard
        </button>
        <div class="sw-wb-header__info">
            <h1 class="sw-wb-header__title">{{c.data.request.number}}</h1>
            <span class="sw-wb-header__type">{{c.data.request.request_type_display}}</span>
            <span class="sw-badge sw-badge--{{c.getStatusClass(c.data.request.status)}}">
                {{c.data.request.status_display}}
            </span>
            <span class="sw-priority sw-priority--{{c.data.request.priority}}">
                <i class="material-icons">flag</i> {{c.data.request.priority_display}}
            </span>
        </div>
    </div>
    <div class="sw-wb-header__actions">
        <button class="sw-btn sw-btn--secondary" ng-click="c.reassign()">
            <i class="material-icons">swap_horiz</i> Reassign
        </button>
        <button class="sw-btn sw-btn--primary"
                ng-click="c.completeRequest()"
                ng-disabled="!c.canComplete">
            <i class="material-icons">check_circle</i> Complete Request
        </button>
    </div>
</div>

<!-- Success alert -->
<div class="sw-alert sw-alert--success sw-mt-md" ng-if="c.showSuccess">
    <i class="material-icons">check_circle</i>
    Request completed successfully! Redirecting to dashboard...
</div>

<!-- Error / not found -->
<div class="sw-alert sw-alert--error" ng-if="c.data.error">
    <i class="material-icons">error</i> {{c.data.error}}
</div>
`,
    customCss: `/* =============================================================================&#13;
   sw-workbench-header - Workbench Page Header Bar&#13;
   =============================================================================&#13;
   Back navigation, request info (title, type, badges), and action buttons.&#13;
   Uses --sw- CSS variables from the core theme.&#13;
   ============================================================================= */&#13;
&#13;
.sw-wb-header {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    justify-content: space-between;&#13;
    gap: var(--sw-spacing-md);&#13;
    padding: var(--sw-spacing-md) var(--sw-spacing-lg);&#13;
    background-color: var(--sw-color-bg-primary);&#13;
    border: 1px solid var(--sw-color-border-light);&#13;
    border-radius: var(--sw-radius-lg);&#13;
    box-shadow: var(--sw-shadow-sm);&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Left Section: Back button + Request info&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-wb-header__left {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    gap: var(--sw-spacing-md);&#13;
    min-width: 0;&#13;
    flex: 1;&#13;
}&#13;
&#13;
.sw-wb-header__info {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    gap: var(--sw-spacing-sm);&#13;
    flex-wrap: wrap;&#13;
    min-width: 0;&#13;
}&#13;
&#13;
.sw-wb-header__title {&#13;
    font-size: var(--sw-font-size-xl);&#13;
    font-weight: var(--sw-font-weight-bold);&#13;
    color: var(--sw-color-text-primary);&#13;
    margin: 0;&#13;
    white-space: nowrap;&#13;
}&#13;
&#13;
.sw-wb-header__type {&#13;
    font-size: var(--sw-font-size-sm);&#13;
    font-weight: var(--sw-font-weight-medium);&#13;
    color: var(--sw-color-text-secondary);&#13;
    white-space: nowrap;&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Right Section: Action buttons&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-wb-header__actions {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    gap: var(--sw-spacing-sm);&#13;
    flex-shrink: 0;&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Responsive: Stack on mobile&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
@media (max-width: 768px) {&#13;
    .sw-wb-header {&#13;
        flex-direction: column;&#13;
        align-items: flex-start;&#13;
        padding: var(--sw-spacing-md);&#13;
    }&#13;
&#13;
    .sw-wb-header__left {&#13;
        flex-direction: column;&#13;
        align-items: flex-start;&#13;
        width: 100%;&#13;
    }&#13;
&#13;
    .sw-wb-header__info {&#13;
        width: 100%;&#13;
    }&#13;
&#13;
    .sw-wb-header__actions {&#13;
        width: 100%;&#13;
        justify-content: flex-end;&#13;
    }&#13;
}&#13;`,
    id: 'sw-workbench-header',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
})
