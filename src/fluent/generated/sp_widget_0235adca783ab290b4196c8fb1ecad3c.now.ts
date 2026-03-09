import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['0235adca783ab290b4196c8fb1ecad3c'],
    name: 'sw-dashboard-metrics',
    clientScript: `api.controller = function($scope) {
    /* jshint validthis: true */
    var c = this;
    // Metrics data is populated by the server script.
    // No additional client-side logic required.
};
`,
    serverScript: `(function() {
    // Build configurable table config from widget options
    var cfg = new x_dxcis_smart_st_0.SmartWorkspaceConfig(options);
    var util = new x_dxcis_smart_st_0.SmartWorkspaceUtil(cfg.getTables());
    var userId = gs.getUserID();

    // Default empty metrics in case of any error
    var rawMetrics = {
        pendingRequests: 0,
        completedToday: 0,
        avgProcessingTime: '0 days',
        customerSatisfaction: 'N/A',
        urgentItems: 0,
        myAssigned: 0
    };

    try {
        rawMetrics = util.getDashboardMetrics(userId);
    } catch (e) {
        gs.warn('sw-dashboard-metrics: Error loading metrics - ' + e.message);
    }

    data.metrics = [
        {
            icon: 'pending_actions',
            label: 'Pending Requests',
            value: rawMetrics.pendingRequests,
            color: '#F59E0B',
            bgColor: 'rgba(245,158,11,0.1)'
        },
        {
            icon: 'check_circle',
            label: 'Completed Today',
            value: rawMetrics.completedToday,
            color: '#10B981',
            bgColor: 'rgba(16,185,129,0.1)'
        },
        {
            icon: 'schedule',
            label: 'Avg Processing Time',
            value: rawMetrics.avgProcessingTime,
            color: '#6366F1',
            bgColor: 'rgba(99,102,241,0.1)'
        },
        {
            icon: 'sentiment_satisfied',
            label: 'Customer Satisfaction',
            value: rawMetrics.customerSatisfaction,
            color: '#10B981',
            bgColor: 'rgba(16,185,129,0.1)'
        },
        {
            icon: 'priority_high',
            label: 'Urgent Items',
            value: rawMetrics.urgentItems,
            color: '#EF4444',
            bgColor: 'rgba(239,68,68,0.1)'
        },
        {
            icon: 'person',
            label: 'My Assigned',
            value: rawMetrics.myAssigned,
            color: '#6366F1',
            bgColor: 'rgba(99,102,241,0.1)'
        }
    ];
})();
`,
    htmlTemplate: `<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<div class="sw-metrics-grid sw-animate-fade-in">
    <div class="sw-metric" ng-repeat="metric in c.data.metrics track by $index">
        <div class="sw-metric__icon" ng-style="{'background-color': metric.bgColor, 'color': metric.color}">
            <i class="material-icons">{{metric.icon}}</i>
        </div>
        <div class="sw-metric__content">
            <div class="sw-metric__value">{{metric.value}}</div>
            <div class="sw-metric__label">{{metric.label}}</div>
        </div>
    </div>
</div>
`,
    customCss: `/* =========================================&#13;
   Metrics grid – zoom & responsive safe&#13;
========================================= */&#13;
&#13;
.sw-metrics-grid {&#13;
    display: grid;&#13;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));&#13;
    gap: 16px;&#13;
    padding: 16px 0;&#13;
    max-width: 100%;&#13;
}&#13;
&#13;
&#13;
.sw-metric {&#13;
    display: flex;&#13;
    flex-direction: row;&#13;
    align-items: center;&#13;
    gap: var(--sw-spacing-md, 16px);&#13;
    background-color: var(--sw-color-surface, #ffffff);&#13;
    padding: clamp(16px, 2.5vw, 24px);&#13;
    border-radius: var(--sw-border-radius-md, 8px);&#13;
    box-shadow: var(--sw-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08));&#13;
    transition: box-shadow 0.2s ease, transform 0.2s ease;&#13;
&#13;
    &:hover {&#13;
        box-shadow: var(--sw-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.12));&#13;
        transform: translateY(-2px);&#13;
    }&#13;
}&#13;
&#13;
.sw-metric__icon {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    justify-content: center;&#13;
     width: clamp(44px, 4vw, 64px);&#13;
  	height: clamp(44px, 4vw, 64px);&#13;
    min-width: 48px;&#13;
    border-radius: var(--sw-border-radius-full, 50%);&#13;
    font-size: 24px;&#13;
&#13;
    .material-icons {&#13;
        font-size: clamp(20px, 2.2vw, 28px);&#13;
    }&#13;
}&#13;
&#13;
.sw-metric__content {&#13;
    display: flex;&#13;
    flex-direction: column;&#13;
    gap: var(--sw-spacing-xs, 4px);&#13;
}&#13;
&#13;
.sw-metric__value {&#13;
    font-size: clamp(1.4rem, 2.2vw, 2rem);&#13;
  	font-weight: 700;&#13;
    color: var(--sw-color-text-primary, #1a1a2e);&#13;
    line-height: 1.2;&#13;
}&#13;
&#13;
.sw-metric__label {&#13;
    font-size: var(--sw-font-size-sm, 0.875rem);&#13;
    color: var(--sw-color-text-muted, #6b7280);&#13;
    line-height: 1.4;&#13;
}&#13;
&#13;
/* Animation */&#13;
.sw-animate-fade-in {&#13;
    animation: sw-fade-in 0.3s ease-out;&#13;
}&#13;
&#13;
@keyframes sw-fade-in {&#13;
    from {&#13;
        opacity: 0;&#13;
        transform: translateY(8px);&#13;
    }&#13;
    to {&#13;
        opacity: 1;&#13;
        transform: translateY(0);&#13;
    }&#13;
}&#13;
&#13;
&#13;
.sw-metrics-grid {&#13;
    display: grid;&#13;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));&#13;
    gap: 16px;&#13;
}&#13;
&#13;
.sw-metric,&#13;
.sw-metric__content {&#13;
    min-width: 0;&#13;
}&#13;
&#13;
&#13;
&#13;`,
    id: 'sw-dashboard-metrics',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
    roles: ['snc_internal'],
})
