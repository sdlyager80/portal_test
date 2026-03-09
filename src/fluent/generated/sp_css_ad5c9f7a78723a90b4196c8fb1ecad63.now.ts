import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['ad5c9f7a78723a90b4196c8fb1ecad63'],
    table: 'sp_css',
    data: {
        css: `/* =============================================================================&#13;
   Smart Workspace - Alternate Brand Theme (Teal)&#13;
   =============================================================================&#13;
   Scoped under body.sw-theme-brand-alt to override primary color tokens.&#13;
   Uses a teal/green accent instead of blue for white-label deployments.&#13;
   ============================================================================= */&#13;
&#13;
body.sw-theme-brand-alt {&#13;
    /* ----- Primary Palette (Teal) ----- */&#13;
    --sw-color-primary: #00897B;&#13;
    --sw-color-primary-hover: #00695C;&#13;
    --sw-color-primary-light: #E0F2F1;&#13;
    --sw-color-primary-lighter: #F0FAFA;&#13;
    --sw-color-primary-text: #FFFFFF;&#13;
&#13;
    /* ----- Info inherits from primary ----- */&#13;
    --sw-color-info: #00897B;&#13;
    --sw-color-info-light: #E0F2F1;&#13;
&#13;
    /* ----- Status: In Progress uses new primary ----- */&#13;
    --sw-status-in-progress: #00897B;&#13;
&#13;
    /* ----- Medium priority uses new primary ----- */&#13;
    --sw-priority-medium: #00897B;&#13;
}&#13;
&#13;
/* ----- Brand-alt theme adjustments for specific components ----- */&#13;
&#13;
body.sw-theme-brand-alt .sw-avatar {&#13;
    background-color: #00897B;&#13;
}&#13;
&#13;
body.sw-theme-brand-alt .sw-card__header-icon {&#13;
    background-color: #E0F2F1;&#13;
    color: #00897B;&#13;
}&#13;
&#13;
body.sw-theme-brand-alt .sw-tabs__tab--active {&#13;
    color: #00897B;&#13;
    border-bottom-color: #00897B;&#13;
}&#13;
&#13;
body.sw-theme-brand-alt .sw-tabs__tab:hover {&#13;
    color: #00897B;&#13;
    background-color: #F0FAFA;&#13;
}&#13;`,
        name: 'sw-brand-alt',
        turn_off_scss_compilation: 'false',
    },
})
