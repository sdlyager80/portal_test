import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['c2bc5bba78723a90b4196c8fb1ecad0c'],
    table: 'sp_css',
    data: {
        css: `/* =============================================================================&#13;
   Smart Workspace - Dark Theme Override&#13;
   =============================================================================&#13;
   Scoped under body.sw-theme-dark to override all --sw- design tokens.&#13;
   Applied dynamically by the sw-theme-switcher widget.&#13;
   ============================================================================= */&#13;
&#13;
body.sw-theme-dark {&#13;
    /* ----- Primary Palette ----- */&#13;
    --sw-color-primary: #4DB8FF;&#13;
    --sw-color-primary-hover: #80CCFF;&#13;
    --sw-color-primary-light: #1A3A5C;&#13;
    --sw-color-primary-lighter: #152D47;&#13;
    --sw-color-primary-text: #1E1E1E;&#13;
&#13;
    /* ----- Semantic Colors ----- */&#13;
    --sw-color-success: #4ADE80;&#13;
    --sw-color-success-light: #1A3A28;&#13;
    --sw-color-warning: #FFB366;&#13;
    --sw-color-warning-light: #3D2A14;&#13;
    --sw-color-error: #FF6B6B;&#13;
    --sw-color-error-light: #3D1A1A;&#13;
    --sw-color-info: #4DB8FF;&#13;
    --sw-color-info-light: #1A3A5C;&#13;
&#13;
    /* ----- Neutral / Surface ----- */&#13;
    --sw-color-text-primary: #E8E8E8;&#13;
    --sw-color-text-secondary: #B0B0B0;&#13;
    --sw-color-text-tertiary: #808080;&#13;
    --sw-color-text-inverse: #1E1E1E;&#13;
    --sw-color-bg-primary: #1E1E1E;&#13;
    --sw-color-bg-secondary: #252525;&#13;
    --sw-color-bg-tertiary: #2D2D2D;&#13;
    --sw-color-border: #404040;&#13;
    --sw-color-border-light: #353535;&#13;
&#13;
    /* ----- Overlay ----- */&#13;
    --sw-color-overlay: rgba(0, 0, 0, 0.7);&#13;
    --sw-color-backdrop: rgba(255, 255, 255, 0.02);&#13;
&#13;
    /* ----- Elevation / Shadows ----- */&#13;
    --sw-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);&#13;
    --sw-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);&#13;
    --sw-shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);&#13;
&#13;
    /* ----- Priority Colors (slightly brighter for contrast) ----- */&#13;
    --sw-priority-urgent: #FF6B6B;&#13;
    --sw-priority-high: #FFB366;&#13;
    --sw-priority-medium: #4DB8FF;&#13;
    --sw-priority-low: #4ADE80;&#13;
&#13;
    /* ----- Status Colors ----- */&#13;
    --sw-status-in-progress: #4DB8FF;&#13;
    --sw-status-pending-review: #FFB366;&#13;
    --sw-status-awaiting-documents: #FFB366;&#13;
    --sw-status-completed: #4ADE80;&#13;
    --sw-status-cancelled: #808080;&#13;
}&#13;
&#13;
/* ----- Dark theme adjustments for specific components ----- */&#13;
&#13;
body.sw-theme-dark .sw-select {&#13;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23B0B0B0' d='M6 8L1 3h10z'/%3E%3C/svg%3E");&#13;
}&#13;
&#13;
body.sw-theme-dark .sw-card {&#13;
    border-color: var(--sw-color-border);&#13;
}&#13;
&#13;
body.sw-theme-dark .sw-table th {&#13;
    background-color: var(--sw-color-bg-tertiary);&#13;
    border-bottom-color: var(--sw-color-border);&#13;
}&#13;
&#13;
body.sw-theme-dark .sw-table td {&#13;
    border-bottom-color: var(--sw-color-border-light);&#13;
}&#13;
&#13;
body.sw-theme-dark .sw-table tr:hover td {&#13;
    background-color: var(--sw-color-bg-tertiary);&#13;
}&#13;
&#13;
body.sw-theme-dark .sw-portal-header {&#13;
    border-bottom-color: var(--sw-color-border);&#13;
}&#13;
&#13;
body.sw-theme-dark .sw-portal-layout__sidenav {&#13;
    border-right-color: var(--sw-color-border);&#13;
}&#13;`,
        name: 'sw-dark',
        turn_off_scss_compilation: 'false',
    },
})
