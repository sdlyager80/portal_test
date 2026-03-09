import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['26458aba783af690b4196c8fb1ecaddd'],
    name: 'sw-workbench-tabs',
    clientScript: `api.controller = function($scope, $rootScope) {
    var c = this;
    c.activeTab = 0;
    c.checklistProgress = 0;
    c.notes = '';

    // Build overview display fields
    if (c.data.request) {
        c.requestFields = [
            { label: 'Request ID', value: c.data.request.number },
            { label: 'Type', value: c.data.request.request_type_display },
            { label: 'Status', value: c.data.request.status_display },
            { label: 'Priority', value: c.data.request.priority_display },
            { label: 'Created', value: c.data.request.created_on },
            { label: 'Due Date', value: c.data.request.due_date },
            { label: 'Assigned To', value: c.data.request.assigned_to_display },
            { label: 'Description', value: c.data.request.description }
        ];
    }

    if (c.data.policy) {
        c.policyFields = [
            { label: 'Policy Number', value: c.data.policy.number },
            { label: 'Policy Type', value: c.data.policy.policy_type },
            { label: 'Status', value: c.data.policy.status },
            { label: 'Effective Date', value: c.data.policy.effective_date },
            { label: 'Expiration Date', value: c.data.policy.expiration_date },
            { label: 'Premium', value: c.data.policy.premium_amount + ' / ' + c.data.policy.premium_frequency },
            { label: 'Coverage Amount', value: c.data.policy.coverage_amount }
        ];

        c.ownerFields = [
            { label: 'Name', value: c.data.policy.owner.name },
            { label: 'Date of Birth', value: c.data.policy.owner.dob },
            { label: 'Phone', value: c.data.policy.owner.phone },
            { label: 'Email', value: c.data.policy.owner.email },
            { label: 'Address', value: c.data.policy.owner.address.street + ', ' + c.data.policy.owner.address.city + ', ' + c.data.policy.owner.address.state + ' ' + c.data.policy.owner.address.zip }
        ];
    }

    // Initialize checklist items with completed = false
    if (c.data.checklist) {
        c.data.checklist.forEach(function(item) {
            item.completed = false;
        });
    }

    c.setTab = function(tabIndex) {
        c.activeTab = tabIndex;
    };

    c.updateChecklist = function() {
        var checklist = c.data.checklist || [];
        var total = checklist.length;
        var completed = checklist.filter(function(item) { return item.completed; }).length;
        c.checklistProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Check if all required items are complete
        var allRequiredComplete = checklist
            .filter(function(item) { return item.required; })
            .every(function(item) { return item.completed; });

        $rootScope.$broadcast('sw.checklist.updated', {
            allRequiredComplete: allRequiredComplete,
            progress: c.checklistProgress
        });
    };

    c.viewDocument = function(doc) {
        if (doc.sys_id) {
            window.open('/sys_attachment.do?sys_id=' + doc.sys_id, '_blank');
        }
    };

    c.downloadDocument = function(doc) {
        if (doc.sys_id) {
            window.location.href = '/sys_attachment.do?sys_id=' + doc.sys_id + '&download=true';
        }
    };
};
`,
    serverScript: `(function() {
    var requestId = $sp.getParameter('request_id');
    if (!requestId) return;

    // Build configurable table config from widget options
    var cfg = new x_dxcis_smart_st_0.SmartWorkspaceConfig(options);
    var tables = cfg.getTables();
    var util = new x_dxcis_smart_st_0.SmartWorkspaceUtil(tables);

    // Defaults
    data.request = null;
    data.policy = null;
    data.beneficiaries = [];
    data.pendingBeneficiaries = [];
    data.activities = [];
    data.checklist = [];
    data.documents = [];

    try {
        // Load request
        data.request = util.getRequestById(requestId);
        if (!data.request) return;

        // Load policy
        if (data.request.policy) {
            data.policy = util.getPolicyByNumber(data.request.policy);
        }

        // Load beneficiaries (active and pending)
        if (data.policy) {
            data.beneficiaries = util.getBeneficiaries(data.policy.sys_id, 'active');
            data.pendingBeneficiaries = util.getBeneficiaries(data.policy.sys_id, 'pending');
        }

        // Load activity history
        data.activities = util.getActivityHistory(data.request.sys_id,
            data.policy ? data.policy.sys_id : null);

        // Load checklist for this request type
        if (data.request.request_type) {
            data.checklist = util.getChecklistForType(data.request.request_type);
        }

        // Load documents (attachments on the request record)
        var requestTableName = tables.service_request;
        var policyTableName = tables.policy;

        var grAtt = new GlideRecord('sys_attachment');
        grAtt.addQuery('table_name', requestTableName);
        grAtt.addQuery('table_sys_id', data.request.sys_id);
        grAtt.query();
        while (grAtt.next()) {
            data.documents.push({
                sys_id: grAtt.getUniqueValue(),
                name: grAtt.getValue('file_name'),
                date: grAtt.getDisplayValue('sys_created_on'),
                type: grAtt.getValue('content_type'),
                size: grAtt.getValue('size_bytes')
            });
        }

        // Also check for documents on the policy record
        if (data.policy) {
            var grPolAtt = new GlideRecord('sys_attachment');
            grPolAtt.addQuery('table_name', policyTableName);
            grPolAtt.addQuery('table_sys_id', data.policy.sys_id);
            grPolAtt.query();
            while (grPolAtt.next()) {
                data.documents.push({
                    sys_id: grPolAtt.getUniqueValue(),
                    name: grPolAtt.getValue('file_name'),
                    date: grPolAtt.getDisplayValue('sys_created_on'),
                    type: grPolAtt.getValue('content_type'),
                    size: grPolAtt.getValue('size_bytes')
                });
            }
        }
    } catch (e) {
        gs.warn('sw-workbench-tabs: Error - ' + e.message);
    }
})();
`,
    htmlTemplate: `<div class="sw-wb-tabs" ng-if="c.data.request">

    <!-- Tab Navigation -->
    <div class="sw-tabs">
        <button class="sw-tabs__tab" ng-class="{'sw-tabs__tab--active': c.activeTab === 0}" ng-click="c.setTab(0)">
            <i class="material-icons">info</i> Overview
        </button>
        <button class="sw-tabs__tab" ng-class="{'sw-tabs__tab--active': c.activeTab === 1}" ng-click="c.setTab(1)">
            <i class="material-icons">people</i> Beneficiaries
        </button>
        <button class="sw-tabs__tab" ng-class="{'sw-tabs__tab--active': c.activeTab === 2}" ng-click="c.setTab(2)">
            <i class="material-icons">timeline</i> Timeline
        </button>
        <button class="sw-tabs__tab" ng-class="{'sw-tabs__tab--active': c.activeTab === 3}" ng-click="c.setTab(3)">
            <i class="material-icons">checklist</i> Checklist
        </button>
        <button class="sw-tabs__tab" ng-class="{'sw-tabs__tab--active': c.activeTab === 4}" ng-click="c.setTab(4)">
            <i class="material-icons">description</i> Documents
        </button>
    </div>

    <!-- TAB 0: Overview -->
    <div class="sw-wb-tabs__content sw-animate-fade-in" ng-if="c.activeTab === 0">
        <div class="sw-wb-tabs__grid">
            <!-- Request Details Card -->
            <div class="sw-card">
                <div class="sw-card__header">
                    <div class="sw-card__header-icon"><i class="material-icons">assignment</i></div>
                    <span class="sw-card__header-title">Request Details</span>
                </div>
                <div class="sw-card__body">
                    <div class="sw-info-row" ng-repeat="field in c.requestFields">
                        <span class="sw-info-row__label">{{field.label}}</span>
                        <span class="sw-info-row__value">{{field.value}}</span>
                    </div>
                </div>
            </div>

            <!-- Policy Summary Card -->
            <div class="sw-card">
                <div class="sw-card__header">
                    <div class="sw-card__header-icon"><i class="material-icons">policy</i></div>
                    <span class="sw-card__header-title">Policy Summary</span>
                </div>
                <div class="sw-card__body">
                    <div class="sw-info-row" ng-repeat="field in c.policyFields">
                        <span class="sw-info-row__label">{{field.label}}</span>
                        <span class="sw-info-row__value">{{field.value}}</span>
                    </div>
                </div>
            </div>

            <!-- Policy Owner Card -->
            <div class="sw-card">
                <div class="sw-card__header">
                    <div class="sw-card__header-icon"><i class="material-icons">person</i></div>
                    <span class="sw-card__header-title">Policy Owner</span>
                </div>
                <div class="sw-card__body">
                    <div class="sw-info-row" ng-repeat="field in c.ownerFields">
                        <span class="sw-info-row__label">{{field.label}}</span>
                        <span class="sw-info-row__value">{{field.value}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- TAB 1: Beneficiaries -->
    <div class="sw-wb-tabs__content sw-animate-fade-in" ng-if="c.activeTab === 1">
        <!-- Current Beneficiaries -->
        <div class="sw-card sw-mb-lg">
            <div class="sw-card__header">
                <div class="sw-card__header-icon"><i class="material-icons">people</i></div>
                <span class="sw-card__header-title">Current Beneficiaries</span>
            </div>
            <div class="sw-card__body">
                <table class="sw-table" ng-if="c.data.beneficiaries.length > 0">
                    <thead>
                        <tr><th>Name</th><th>Relationship</th><th>Type</th><th>Allocation</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="ben in c.data.beneficiaries">
                            <td>{{ben.name}}</td>
                            <td>{{ben.relationship}}</td>
                            <td>{{ben.type}}</td>
                            <td>{{ben.allocation}}%</td>
                            <td><span class="sw-badge sw-badge--completed">{{ben.status}}</span></td>
                        </tr>
                    </tbody>
                </table>
                <p class="sw-text-muted" ng-if="c.data.beneficiaries.length === 0">No current beneficiaries on file.</p>
            </div>
        </div>

        <!-- Pending Changes -->
        <div class="sw-card" ng-if="c.data.pendingBeneficiaries.length > 0">
            <div class="sw-card__header">
                <div class="sw-card__header-icon" style="background-color: var(--sw-color-warning-light); color: var(--sw-color-warning);">
                    <i class="material-icons">pending</i>
                </div>
                <span class="sw-card__header-title">Pending Beneficiary Changes</span>
            </div>
            <div class="sw-card__body">
                <table class="sw-table">
                    <thead>
                        <tr><th>Name</th><th>Relationship</th><th>Type</th><th>Allocation</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="ben in c.data.pendingBeneficiaries">
                            <td>{{ben.name}}</td>
                            <td>{{ben.relationship}}</td>
                            <td>{{ben.type}}</td>
                            <td>{{ben.allocation}}%</td>
                            <td><span class="sw-badge sw-badge--pending-review">Pending</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- TAB 2: Timeline -->
    <div class="sw-wb-tabs__content sw-animate-fade-in" ng-if="c.activeTab === 2">
        <div class="sw-card">
            <div class="sw-card__header">
                <div class="sw-card__header-icon"><i class="material-icons">timeline</i></div>
                <span class="sw-card__header-title">Activity History</span>
            </div>
            <div class="sw-card__body">
                <div class="sw-timeline">
                    <div class="sw-timeline__item" ng-repeat="activity in c.data.activities">
                        <div class="sw-timeline__dot"></div>
                        <div class="sw-timeline__content">
                            <div class="sw-timeline__header">
                                <span class="sw-timeline__action">{{activity.action}}</span>
                                <span class="sw-timeline__date">{{activity.date}}</span>
                            </div>
                            <div class="sw-timeline__details">{{activity.details}}</div>
                            <div class="sw-timeline__user">
                                <i class="material-icons">person</i> {{activity.user}}
                            </div>
                        </div>
                    </div>
                </div>
                <p class="sw-text-muted" ng-if="c.data.activities.length === 0">No activity recorded.</p>
            </div>
        </div>
    </div>

    <!-- TAB 3: Checklist -->
    <div class="sw-wb-tabs__content sw-animate-fade-in" ng-if="c.activeTab === 3">
        <div class="sw-card">
            <div class="sw-card__header">
                <div class="sw-card__header-icon"><i class="material-icons">checklist</i></div>
                <span class="sw-card__header-title">Processing Checklist</span>
                <span class="sw-wb-tabs__progress-label">{{c.checklistProgress}}% Complete</span>
            </div>
            <div class="sw-card__body">
                <!-- Progress bar -->
                <div class="sw-progress sw-mb-lg">
                    <div class="sw-progress__bar"
                         ng-class="{'sw-progress__bar--success': c.checklistProgress === 100}"
                         ng-style="{'width': c.checklistProgress + '%'}"></div>
                </div>

                <!-- Required items -->
                <h4 class="sw-mb-sm">Required Items</h4>
                <div class="sw-checklist">
                    <label class="sw-checkbox sw-mb-sm" ng-repeat="item in c.data.checklist" ng-if="item.required">
                        <input type="checkbox" ng-model="item.completed" ng-change="c.updateChecklist()">
                        <span ng-class="{'sw-text-muted': item.completed}"
                              ng-style="{'text-decoration': item.completed ? 'line-through' : 'none'}">
                            {{item.description}}
                        </span>
                        <span class="sw-text-error sw-text-xs" ng-if="item.required"> (Required)</span>
                    </label>
                </div>

                <!-- Optional items -->
                <h4 class="sw-mt-lg sw-mb-sm">Optional Items</h4>
                <div class="sw-checklist">
                    <label class="sw-checkbox sw-mb-sm" ng-repeat="item in c.data.checklist" ng-if="!item.required">
                        <input type="checkbox" ng-model="item.completed" ng-change="c.updateChecklist()">
                        <span ng-class="{'sw-text-muted': item.completed}"
                              ng-style="{'text-decoration': item.completed ? 'line-through' : 'none'}">
                            {{item.description}}
                        </span>
                    </label>
                </div>

                <!-- Processing Notes -->
                <h4 class="sw-mt-lg sw-mb-sm">Processing Notes</h4>
                <textarea class="sw-textarea"
                          ng-model="c.notes"
                          placeholder="Add processing notes here..."
                          rows="4"></textarea>
            </div>
        </div>
    </div>

    <!-- TAB 4: Documents -->
    <div class="sw-wb-tabs__content sw-animate-fade-in" ng-if="c.activeTab === 4">
        <div class="sw-card">
            <div class="sw-card__header">
                <div class="sw-card__header-icon"><i class="material-icons">description</i></div>
                <span class="sw-card__header-title">Documents</span>
            </div>
            <div class="sw-card__body">
                <table class="sw-table" ng-if="c.data.documents.length > 0">
                    <thead>
                        <tr><th>Document Name</th><th>Date</th><th>Type</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="doc in c.data.documents">
                            <td><i class="material-icons sw-text-primary" style="vertical-align: middle; font-size: 18px;">description</i> {{doc.name}}</td>
                            <td>{{doc.date}}</td>
                            <td>{{doc.type}}</td>
                            <td>
                                <button class="sw-btn sw-btn--ghost sw-btn--sm" ng-click="c.viewDocument(doc)">
                                    <i class="material-icons">visibility</i> View
                                </button>
                                <button class="sw-btn sw-btn--ghost sw-btn--sm" ng-click="c.downloadDocument(doc)">
                                    <i class="material-icons">download</i> Download
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p class="sw-text-muted" ng-if="c.data.documents.length === 0">No documents attached.</p>
            </div>
        </div>
    </div>
</div>
`,
    customCss: `/* =============================================================================&#13;
   sw-workbench-tabs - Tabbed Content Area for Policy Workbench&#13;
   =============================================================================&#13;
   Styles for: tab content padding, overview grid, info rows, timeline,&#13;
   checklist, progress label, and document table actions.&#13;
   Uses --sw- CSS variables from the core theme.&#13;
   ============================================================================= */&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Tab Content Container&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-wb-tabs__content {&#13;
    padding: var(--sw-spacing-lg) 0;&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Overview Grid: 2 columns on desktop, 1 on mobile&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-wb-tabs__grid {&#13;
    display: grid;&#13;
    grid-template-columns: repeat(2, 1fr);&#13;
    gap: var(--sw-spacing-lg);&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Info Row: label/value pairs inside overview cards&#13;
   Already defined in sw-info-row widget; these are local refinements.&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-wb-tabs .sw-info-row {&#13;
    display: flex;&#13;
    align-items: flex-start;&#13;
    gap: var(--sw-spacing-sm);&#13;
    padding: var(--sw-spacing-sm) 0;&#13;
    border-bottom: 1px solid var(--sw-color-border-light);&#13;
    font-size: var(--sw-font-size-base);&#13;
    line-height: var(--sw-line-height);&#13;
&#13;
    &:last-child {&#13;
        border-bottom: none;&#13;
    }&#13;
}&#13;
&#13;
.sw-wb-tabs .sw-info-row__label {&#13;
    width: 140px;&#13;
    min-width: 140px;&#13;
    flex-shrink: 0;&#13;
    font-size: var(--sw-font-size-sm);&#13;
    font-weight: var(--sw-font-weight-medium);&#13;
    color: var(--sw-color-text-tertiary);&#13;
    text-transform: uppercase;&#13;
    letter-spacing: 0.025em;&#13;
}&#13;
&#13;
.sw-wb-tabs .sw-info-row__value {&#13;
    flex: 1;&#13;
    font-weight: var(--sw-font-weight-medium);&#13;
    color: var(--sw-color-text-primary);&#13;
    word-break: break-word;&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Timeline: Vertical line on left with dots and content cards&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-timeline {&#13;
    position: relative;&#13;
    padding-left: var(--sw-spacing-xl);&#13;
&#13;
    /* Vertical line */&#13;
    &::before {&#13;
        content: '';&#13;
        position: absolute;&#13;
        top: 0;&#13;
        bottom: 0;&#13;
        left: 5px;&#13;
        width: 2px;&#13;
        background-color: var(--sw-color-border);&#13;
    }&#13;
}&#13;
&#13;
.sw-timeline__item {&#13;
    position: relative;&#13;
    padding-bottom: var(--sw-spacing-lg);&#13;
&#13;
    &:last-child {&#13;
        padding-bottom: 0;&#13;
    }&#13;
}&#13;
&#13;
.sw-timeline__dot {&#13;
    position: absolute;&#13;
    left: calc(-1 * var(--sw-spacing-xl) + 0px);&#13;
    top: 4px;&#13;
    width: 12px;&#13;
    height: 12px;&#13;
    border-radius: var(--sw-radius-full);&#13;
    background-color: var(--sw-color-primary);&#13;
    border: 2px solid var(--sw-color-bg-primary);&#13;
    box-shadow: 0 0 0 2px var(--sw-color-primary-light);&#13;
    z-index: 1;&#13;
}&#13;
&#13;
.sw-timeline__content {&#13;
    background-color: var(--sw-color-bg-tertiary);&#13;
    border: 1px solid var(--sw-color-border-light);&#13;
    border-radius: var(--sw-radius-md);&#13;
    padding: var(--sw-spacing-md);&#13;
}&#13;
&#13;
.sw-timeline__header {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    justify-content: space-between;&#13;
    margin-bottom: var(--sw-spacing-xs);&#13;
}&#13;
&#13;
.sw-timeline__action {&#13;
    font-size: var(--sw-font-size-base);&#13;
    font-weight: var(--sw-font-weight-semibold);&#13;
    color: var(--sw-color-text-primary);&#13;
}&#13;
&#13;
.sw-timeline__date {&#13;
    font-size: var(--sw-font-size-xs);&#13;
    color: var(--sw-color-text-tertiary);&#13;
    white-space: nowrap;&#13;
}&#13;
&#13;
.sw-timeline__details {&#13;
    font-size: var(--sw-font-size-sm);&#13;
    color: var(--sw-color-text-secondary);&#13;
    margin-bottom: var(--sw-spacing-xs);&#13;
    line-height: var(--sw-line-height);&#13;
}&#13;
&#13;
.sw-timeline__user {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    gap: var(--sw-spacing-xs);&#13;
    font-size: var(--sw-font-size-sm);&#13;
    color: var(--sw-color-text-tertiary);&#13;
&#13;
    .material-icons {&#13;
        font-size: 14px;&#13;
    }&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Checklist&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-checklist {&#13;
    display: flex;&#13;
    flex-direction: column;&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Progress Label: Floats right inside the card header&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-wb-tabs__progress-label {&#13;
    margin-left: auto;&#13;
    font-size: var(--sw-font-size-sm);&#13;
    font-weight: var(--sw-font-weight-semibold);&#13;
    color: var(--sw-color-primary);&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Document Table: Inline action buttons&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
.sw-wb-tabs .sw-table td .sw-btn--ghost {&#13;
    margin-right: var(--sw-spacing-xs);&#13;
&#13;
    &:last-child {&#13;
        margin-right: 0;&#13;
    }&#13;
}&#13;
&#13;
/* --------------------------------------------------------------------------&#13;
   Responsive&#13;
   -------------------------------------------------------------------------- */&#13;
&#13;
@media (max-width: 768px) {&#13;
    .sw-wb-tabs__grid {&#13;
        grid-template-columns: 1fr;&#13;
    }&#13;
&#13;
    .sw-wb-tabs .sw-info-row {&#13;
        flex-direction: column;&#13;
        gap: var(--sw-spacing-xs);&#13;
    }&#13;
&#13;
    .sw-wb-tabs .sw-info-row__label {&#13;
        width: auto;&#13;
        min-width: auto;&#13;
    }&#13;
&#13;
    .sw-timeline {&#13;
        padding-left: var(--sw-spacing-lg);&#13;
    }&#13;
&#13;
    .sw-timeline__header {&#13;
        flex-direction: column;&#13;
        align-items: flex-start;&#13;
        gap: var(--sw-spacing-xs);&#13;
    }&#13;
&#13;
    .sw-tabs {&#13;
        overflow-x: auto;&#13;
        -webkit-overflow-scrolling: touch;&#13;
    }&#13;
}&#13;`,
    id: 'sw-workbench-tabs',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
})
