/**
 * SmartWorkspaceSecurity - Authorization and role-based access control
 *
 * Provides programmatic security checks beyond table-level ACLs.
 * Table names and role names are CONFIGURABLE via the constructor so
 * different portals can use different backing tables and roles.
 *
 * Usage in widget server scripts:
 *   // With defaults:
 *   var sec = new SmartWorkspaceSecurity();
 *
 *   // With custom config from widget options:
 *   var sec = new SmartWorkspaceSecurity({
 *       service_request_table: options.table_service_request || 'x_dxcis_smart_st_0_service_request',
 *       role_admin:            options.role_admin            || 'x_dxcis_smart_st_0.admin',
 *       role_agent:            options.role_agent            || 'x_dxcis_smart_st_0.agent'
 *   });
 */

var SmartWorkspaceSecurity = Class.create();
SmartWorkspaceSecurity.prototype = {
    DEFAULT_CONFIG: {
        service_request_table: 'x_dxcis_bpm_core_policy_administration',
        role_admin: 'x_dxcis_smart_st_0.admin',
        role_agent: 'x_dxcis_smart_st_0.agent'
    },

    /**
     * @param {Object} [config] - Optional overrides
     * @param {string} [config.service_request_table] - Service request table name
     * @param {string} [config.role_admin] - Admin role name
     * @param {string} [config.role_agent] - Agent role name
     */
    initialize: function(config) {
        config = config || {};
        this.requestTable = config.service_request_table || this.DEFAULT_CONFIG.service_request_table;
        this.ROLE_ADMIN = config.role_admin || this.DEFAULT_CONFIG.role_admin;
        this.ROLE_AGENT = config.role_agent || this.DEFAULT_CONFIG.role_agent;
    },

    /**
     * Check if user can view a specific service request
     * Agents can see requests assigned to them or in their group.
     * Admins can see all requests.
     * @param {string} userId - sys_id of the user
     * @param {string} requestId - sys_id of the service request
     * @returns {boolean}
     */
    canViewRequest: function(userId, requestId) {
        // Admins can view everything
        if (this._hasRole(userId, this.ROLE_ADMIN)) {
            return true;
        }

        // Agents can view if assigned to them
        if (this._hasRole(userId, this.ROLE_AGENT)) {
            var gr = new GlideRecord(this.requestTable);
            if (gr.get(requestId)) {
                // Assigned directly
                if (gr.getValue('assigned_to') === userId) {
                    return true;
                }
                // For now, allow all agents to view all requests
                // In production, add group-based filtering here
                return true;
            }
        }

        return false;
    },

    /**
     * Check if user can complete (close) a service request
     * Only the assigned agent or an admin can complete a request.
     * @param {string} userId - sys_id of the user
     * @param {string} requestId - sys_id of the service request
     * @returns {boolean}
     */
    canCompleteRequest: function(userId, requestId) {
        if (this._hasRole(userId, this.ROLE_ADMIN)) {
            return true;
        }

        var gr = new GlideRecord(this.requestTable);
        if (gr.get(requestId)) {
            return gr.getValue('assigned_to') === userId;
        }

        return false;
    },

    /**
     * Check if user can create new service requests
     * @param {string} userId - sys_id of the user
     * @returns {boolean}
     */
    canCreateRequest: function(userId) {
        return this._hasRole(userId, this.ROLE_AGENT) ||
               this._hasRole(userId, this.ROLE_ADMIN);
    },

    /**
     * Check if user can reassign a service request
     * Only admins or the currently assigned agent can reassign.
     * @param {string} userId - sys_id of the user
     * @param {string} requestId - sys_id of the service request
     * @returns {boolean}
     */
    canReassignRequest: function(userId, requestId) {
        if (this._hasRole(userId, this.ROLE_ADMIN)) {
            return true;
        }

        var gr = new GlideRecord(this.requestTable);
        if (gr.get(requestId)) {
            return gr.getValue('assigned_to') === userId;
        }

        return false;
    },

    /**
     * Check if user has access to the Smart Workspace portal
     * @param {string} userId - sys_id of the user
     * @returns {boolean}
     */
    hasPortalAccess: function(userId) {
        return this._hasRole(userId, this.ROLE_AGENT) ||
               this._hasRole(userId, this.ROLE_ADMIN);
    },

    /**
     * Get the list of agents for reassignment dropdowns
     * @returns {Array} Array of {sys_id, name} objects
     */
    getAgentList: function() {
        var agents = [];
        var gr = new GlideRecord('sys_user_has_role');
        gr.addQuery('role.name', this.ROLE_AGENT);
        gr.addQuery('user.active', true);
        gr.query();

        var seen = {};
        while (gr.next()) {
            var userId = gr.getValue('user');
            if (!seen[userId]) {
                seen[userId] = true;
                agents.push({
                    sys_id: userId,
                    name: gr.getDisplayValue('user')
                });
            }
        }

        return agents;
    },

    // =========================================================================
    // PRIVATE HELPERS
    // =========================================================================

    /**
     * Check if a user has a specific role
     * @param {string} userId - sys_id of the user
     * @param {string} roleName - Role name to check
     * @returns {boolean}
     */
    _hasRole: function(userId, roleName) {
        var gr = new GlideRecord('sys_user_has_role');
        gr.addQuery('user', userId);
        gr.addQuery('role.name', roleName);
        gr.query();
        return gr.hasNext();
    },

    type: 'SmartWorkspaceSecurity'
};
