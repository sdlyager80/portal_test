/**
 * SmartWorkspaceConfig - Shared configuration builder
 *
 * Builds table configuration objects from widget options.
 * Every widget that uses SmartWorkspaceUtil, SmartWorkspaceTheme, or
 * SmartWorkspaceSecurity should call this to resolve table names from
 * its options schema, falling back to defaults.
 *
 * Scoped App: x_dxcis_smart_st_0 (Smart Studio Workspace)
 * Core Data App: x_dxcis_bpm_core (BPM Core - policy admin & billing)
 *
 * Usage in widget server scripts:
 *   var cfg = new SmartWorkspaceConfig(options);
 *   var util = new SmartWorkspaceUtil(cfg.getTables());
 *   var sec  = new SmartWorkspaceSecurity(cfg.getSecurity());
 *   var theme = new SmartWorkspaceTheme(cfg.getTheme());
 */

var SmartWorkspaceConfig = Class.create();
SmartWorkspaceConfig.prototype = {

    initialize: function(options) {
        this.options = options || {};
    },

    /**
     * Get resolved table configuration for SmartWorkspaceUtil.
     *
     * Primary tables point to existing BPM Core tables:
     *   - service_request → x_dxcis_bpm_core_policy_administration
     *   - payment_history → x_dxcis_bpm_core_billing_payment
     *
     * Supporting tables default to Smart Studio Workspace scope
     * and can be created later or overridden via widget options.
     *
     * @returns {Object} Table name map
     */
    getTables: function() {
        var o = this.options;
        return {
            service_request: o.table_service_request || 'x_dxcis_bpm_core_policy_administration',
            policy:          o.table_policy          || 'x_dxcis_smart_st_0_policy',
            beneficiary:     o.table_beneficiary     || 'x_dxcis_smart_st_0_beneficiary',
            payment_history: o.table_payment_history || 'x_dxcis_bpm_core_billing_payment',
            activity_log:    o.table_activity_log    || 'x_dxcis_smart_st_0_activity_log',
            checklist_item:  o.table_checklist_item  || 'x_dxcis_smart_st_0_checklist_item',
            request_type:    o.table_request_type    || 'x_dxcis_smart_st_0_request_type'
        };
    },

    /**
     * Get resolved security configuration for SmartWorkspaceSecurity
     * @returns {Object} Security config
     */
    getSecurity: function() {
        var o = this.options;
        return {
            service_request_table: o.table_service_request || 'x_dxcis_bpm_core_policy_administration',
            role_admin:            o.role_admin            || 'x_dxcis_smart_st_0.admin',
            role_agent:            o.role_agent            || 'x_dxcis_smart_st_0.agent'
        };
    },

    /**
     * Get resolved theme configuration for SmartWorkspaceTheme
     * @returns {Object} Theme config
     */
    getTheme: function() {
        var o = this.options;
        return {
            preference_table: o.table_user_preference || 'x_dxcis_smart_st_0_user_preference'
        };
    },

    type: 'SmartWorkspaceConfig'
};
