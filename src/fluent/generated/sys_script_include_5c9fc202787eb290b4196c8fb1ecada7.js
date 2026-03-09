/**
 * SmartWorkspaceUtil - Central utility script include for Smart Workspace
 *
 * Provides data access methods for all widgets with CONFIGURABLE TABLE NAMES.
 * Table names are passed via the tableConfig parameter so widgets can override
 * them through their options schema. This enables multiple portals to point
 * at different underlying tables (e.g., different lines of business).
 *
 * Usage in widget server scripts:
 *   // With defaults (uses x_sw_* tables):
 *   var util = new SmartWorkspaceUtil();
 *
 *   // With custom tables from widget options:
 *   var util = new SmartWorkspaceUtil({
 *       service_request: options.table_service_request || 'x_dxcis_smart_st_0_service_request',
 *       policy:          options.table_policy          || 'x_dxcis_smart_st_0_policy',
 *       beneficiary:     options.table_beneficiary     || 'x_dxcis_smart_st_0_beneficiary',
 *       payment_history: options.table_payment_history || 'x_dxcis_smart_st_0_payment_history',
 *       activity_log:    options.table_activity_log    || 'x_dxcis_smart_st_0_activity_log',
 *       checklist_item:  options.table_checklist_item  || 'x_dxcis_smart_st_0_checklist_item',
 *       request_type:    options.table_request_type    || 'x_dxcis_smart_st_0_request_type'
 *   });
 */

var SmartWorkspaceUtil = Class.create();
SmartWorkspaceUtil.prototype = {

    /**
     * Default table configuration. Every table name used by this class
     * is stored here and can be overridden via the constructor.
     */
    DEFAULT_TABLES: {
        service_request: 'x_dxcis_bpm_core_policy_administration',
        policy: 'x_dxcis_smart_st_0_policy',
        beneficiary: 'x_dxcis_smart_st_0_beneficiary',
        payment_history: 'x_dxcis_bpm_core_billing_payment',
        activity_log: 'x_dxcis_smart_st_0_activity_log',
        checklist_item: 'x_dxcis_smart_st_0_checklist_item',
        request_type: 'x_dxcis_smart_st_0_request_type'
    },

    /**
     * @param {Object} [tableConfig] - Optional overrides for table names.
     *        Keys match DEFAULT_TABLES; only the keys you provide are overridden.
     */
    initialize: function(tableConfig) {
        this.tables = {};
        var defaults = this.DEFAULT_TABLES;
        tableConfig = tableConfig || {};

        for (var key in defaults) {
            if (defaults.hasOwnProperty(key)) {
                this.tables[key] = tableConfig[key] || defaults[key];
            }
        }
    },

    /**
     * Returns the resolved table configuration (useful for debugging
     * or passing downstream).
     * @returns {Object}
     */
    getTableConfig: function() {
        return this.tables;
    },

    // =========================================================================
    // SERVICE REQUESTS
    // =========================================================================

    /**
     * Get service requests assigned to a specific user
     * @param {string} userId - sys_id of the user
     * @param {string} [filter] - Optional: 'my_work', 'all', 'urgent'
     * @returns {Array} Array of request objects
     */
    getRequestsForUser: function(userId, filter) {
        var requests = [];
        var gr = this._safeGlideRecord(this.tables.service_request);

        gs.info('[sw-util] querying table = ' + this.tables.service_request);

        if (!gr) return requests;

        if (filter === 'my_work') {
            gr.addQuery('assigned_to', userId);
            gr.addQuery('state', 'NOT IN', '7,3,4,5');
        } else if (filter === 'urgent') {
            gr.addQuery('priority', '1');
            gr.addQuery('state', 'NOT IN', '7,3,4,5');
        } else {
            // 'all' - no user filter, exclude completed
            gr.addQuery('state', 'NOT IN', '7,3,4,5');
        }

        gr.orderByDesc('priority');
        gr.orderBy('due_date');
        gr.query();

        gs.info('[sw-util] query row count = ' + gr.getRowCount());


        while (gr.next()) {
            requests.push(this._serializeRequest(gr));
        }

        return requests;
    },

    /**
     * Get a single service request by sys_id or number
     * @param {string} requestId - sys_id or number (SR-XXXX)
     * @returns {Object|null} Request object or null
     */
    getRequestById: function(requestId) {
        var gr = this._safeGlideRecord(this.tables.service_request);
        if (!gr) return null;

        // Try sys_id first, then number
        if (gr.get(requestId)) {
            return this._serializeRequest(gr);
        }

        gr.initialize();
        gr.addQuery('number', requestId);
        gr.query();
        if (gr.next()) {
            return this._serializeRequest(gr);
        }

        return null;
    },

    /**
     * Create a new service request
     * @param {Object} data - Request data fields
     * @returns {string} sys_id of the created record
     */
    createRequest: function(data) {
        var gr = new GlideRecord(this.tables.service_request);
        gr.initialize();

        if (data.policy) gr.setValue('policy', data.policy);
        if (data.customer_name) gr.setValue('customer_name', data.customer_name);
        if (data.request_type) gr.setValue('request_type', data.request_type);
        if (data.priority) gr.setValue('priority', data.priority);
        if (data.description) gr.setValue('description', data.description);
        if (data.due_date) gr.setValue('due_date', data.due_date);
        if (data.policy_type) gr.setValue('policy_type', data.policy_type);
        if (data.policy_value) gr.setValue('policy_value', data.policy_value);

        // Auto-assign to current user if not specified
        gr.setValue('assigned_to', data.assigned_to || gs.getUserID());
        gr.setValue('status', 'in_progress');

        var sysId = gr.insert();

        // Log the creation activity
        if (sysId) {
            this._logActivity(sysId, null, 'Service Request Created',
                'New ' + (data.request_type_label || 'service') + ' request initiated');
        }

        return sysId;
    },

    /**
     * Complete a service request
     * @param {string} requestId - sys_id of the request
     * @param {string} [notes] - Optional completion notes
     * @returns {boolean} Success
     */
    completeRequest: function(requestId, notes) {
        var gr = new GlideRecord(this.tables.service_request);
        if (!gr.get(requestId)) return false;

        gr.setValue('status', 'completed');
        if (notes) {
            gr.processing_notes.setJournalEntry(notes);
        }
        gr.update();

        this._logActivity(requestId, gr.getValue('policy'),
            'Service Request Completed', 'Request completed by ' + gs.getUserDisplayName());

        return true;
    },

    /**
     * Get the number field value for a service request by sys_id.
     * Useful after createRequest() to retrieve the auto-generated number.
     * @param {string} sysId - sys_id of the service request
     * @returns {string|null}
     */
    getRequestNumber: function(sysId) {
        var gr = new GlideRecord(this.tables.service_request);
        if (gr.get(sysId)) {
            return gr.getValue('number');
        }
        return null;
    },

    // =========================================================================
    // POLICIES
    // =========================================================================

    /**
     * Get policy details by sys_id or number
     * @param {string} policyId - sys_id or policy number (POL-XXXX)
     * @returns {Object|null} Policy object or null
     */
    getPolicyByNumber: function(policyId) {
        var gr = new GlideRecord(this.tables.policy);

        if (gr.get(policyId)) {
            return this._serializePolicy(gr);
        }

        gr.initialize();
        gr.addQuery('number', policyId);
        gr.query();
        if (gr.next()) {
            return this._serializePolicy(gr);
        }

        return null;
    },

    /**
     * Look up a policy sys_id by its number
     * @param {string} policyNumber - e.g. 'POL-789456123'
     * @returns {string} sys_id or empty string
     */
    getPolicySysIdByNumber: function(policyNumber) {
        var gr = new GlideRecord(this.tables.policy);
        gr.addQuery('number', policyNumber);
        gr.query();
        if (gr.next()) {
            return gr.getUniqueValue();
        }
        return '';
    },

    /**
     * Search policies by keyword (number, owner name)
     * @param {string} keyword - Search term
     * @param {number} [limit] - Max results (default 20)
     * @returns {Array} Array of policy summary objects
     */
    searchPolicies: function(keyword, limit) {
        var results = [];
        limit = limit || 20;

        var gr = new GlideRecord(this.tables.policy);
        var qc = gr.addQuery('number', 'CONTAINS', keyword);
        qc.addOrCondition('owner_name', 'CONTAINS', keyword);
        gr.setLimit(limit);
        gr.query();

        while (gr.next()) {
            results.push({
                sys_id: gr.getUniqueValue(),
                number: gr.getValue('number'),
                policy_type: gr.getDisplayValue('policy_type'),
                status: gr.getDisplayValue('status'),
                owner_name: gr.getValue('owner_name'),
                coverage_amount: gr.getDisplayValue('coverage_amount')
            });
        }

        return results;
    },

    // =========================================================================
    // DASHBOARD METRICS
    // =========================================================================

    /**
     * Get aggregated dashboard metrics for a user
     * @param {string} userId - sys_id of the user
     * @returns {Object} Metrics object with counts
     */
    getDashboardMetrics: function(userId) {
        var tbl = this.tables.service_request;
        var metrics = {
            pendingRequests: 0,
            completedToday: 0,
            avgProcessingTime: '0 days',
            customerSatisfaction: 'N/A',
            urgentItems: 0,
            myAssigned: 0
        };

        // If the service request table doesn't exist, return empty metrics
        if (!this._tableExists(tbl)) {
            gs.debug('SmartWorkspaceUtil.getDashboardMetrics: Table ' + tbl + ' not found. Returning empty metrics.');
            return metrics;
        }

        try {
            // Pending requests (all non-completed)
            var ga = new GlideAggregate(tbl);
            ga.addQuery('state', '!=', 'closed_complete');
            ga.addQuery('state', '!=', 'closed_incomplete');
            ga.addAggregate('COUNT');
            ga.query();
            if (ga.next()) {
                metrics.pendingRequests = parseInt(ga.getAggregate('COUNT'), 10) || 0;
            }

            // Completed today
            ga = new GlideAggregate(tbl);
            ga.addQuery('state', 'closed_complete');
            ga.addQuery('sys_updated_on', '>=', gs.beginningOfToday());
            ga.addAggregate('COUNT');
            ga.query();
            if (ga.next()) {
                metrics.completedToday = parseInt(ga.getAggregate('COUNT'), 10) || 0;
            }

            // Average processing time (completed in last 30 days)
            var grAvg = new GlideRecord(tbl);
            grAvg.addQuery('state', 'closed_complete');
            grAvg.addQuery('sys_updated_on', '>=', gs.daysAgo(30));
            grAvg.query();
            var totalDays = 0;
            var count = 0;
            while (grAvg.next()) {
                var created = new GlideDateTime(grAvg.getValue('sys_created_on'));
                var updated = new GlideDateTime(grAvg.getValue('sys_updated_on'));
                var duration = GlideDateTime.subtract(created, updated);
                totalDays += duration.getNumericValue() / (1000 * 60 * 60 * 24);
                count++;
            }
            if (count > 0) {
                metrics.avgProcessingTime = (totalDays / count).toFixed(1) + ' days';
            }

            // Urgent items
            ga = new GlideAggregate(tbl);
            ga.addQuery('priority', '1');
            ga.addQuery('state', '!=', 'closed_complete');
            ga.addQuery('state', '!=', 'closed_incomplete');
            ga.addAggregate('COUNT');
            ga.query();
            if (ga.next()) {
                metrics.urgentItems = parseInt(ga.getAggregate('COUNT'), 10) || 0;
            }

            // My assigned (non-completed)
            ga = new GlideAggregate(tbl);
            ga.addQuery('assigned_to', userId);
            ga.addQuery('state', '!=', 'closed_complete');
            ga.addQuery('state', '!=', 'closed_incomplete');
            ga.addAggregate('COUNT');
            ga.query();
            if (ga.next()) {
                metrics.myAssigned = parseInt(ga.getAggregate('COUNT'), 10) || 0;
            }
        } catch (e) {
            gs.warn('SmartWorkspaceUtil.getDashboardMetrics error: ' + e.message);
        }

        return metrics;
    },

    // =========================================================================
    // CHECKLIST
    // =========================================================================

    /**
     * Get checklist template items for a request type
     * @param {string} requestTypeId - sys_id of the request type
     * @returns {Array} Array of checklist item objects
     */
    getChecklistForType: function(requestTypeId) {
        var items = [];
        var gr = new GlideRecord(this.tables.checklist_item);
        gr.addQuery('request_type', requestTypeId);
        gr.orderBy('order');
        gr.query();

        while (gr.next()) {
            items.push({
                sys_id: gr.getUniqueValue(),
                description: gr.getValue('description'),
                required: gr.getValue('required') === '1',
                order: parseInt(gr.getValue('order'), 10)
            });
        }

        return items;
    },

    // =========================================================================
    // BENEFICIARIES
    // =========================================================================

    /**
     * Get beneficiaries for a policy
     * @param {string} policyId - sys_id of the policy
     * @param {string} [status] - Optional filter: 'active', 'pending'
     * @returns {Array} Array of beneficiary objects
     */
    getBeneficiaries: function(policyId, status) {
        var beneficiaries = [];
        var gr = new GlideRecord(this.tables.beneficiary);
        gr.addQuery('policy', policyId);
        if (status) {
            gr.addQuery('status', status);
        }
        gr.query();

        while (gr.next()) {
            beneficiaries.push({
                sys_id: gr.getUniqueValue(),
                name: gr.getValue('name'),
                relationship: gr.getDisplayValue('relationship'),
                allocation: parseInt(gr.getValue('allocation'), 10),
                type: gr.getDisplayValue('beneficiary_type'),
                status: gr.getDisplayValue('status')
            });
        }

        return beneficiaries;
    },

    // =========================================================================
    // ACTIVITY LOG
    // =========================================================================

    /**
     * Get activity history for a request or policy
     * @param {string} requestId - sys_id of the service request (optional)
     * @param {string} policyId - sys_id of the policy (optional)
     * @returns {Array} Array of activity objects, newest first
     */
    getActivityHistory: function(requestId, policyId) {
        var activities = [];
        var gr = new GlideRecord(this.tables.activity_log);

        if (requestId) {
            gr.addQuery('service_request', requestId);
        }
        if (policyId) {
            gr.addQuery('policy', policyId);
        }

        gr.orderByDesc('action_date');
        gr.query();

        while (gr.next()) {
            activities.push({
                sys_id: gr.getUniqueValue(),
                date: gr.getDisplayValue('action_date'),
                action: gr.getValue('action'),
                user: gr.getDisplayValue('performed_by'),
                details: gr.getValue('details')
            });
        }

        return activities;
    },

    // =========================================================================
    // PAYMENT HISTORY
    // =========================================================================

    /**
     * Get payment history for a policy
     * @param {string} policyId - sys_id of the policy
     * @returns {Array} Array of payment objects
     */
    getPaymentHistory: function(policyId) {
        var payments = [];
        var gr = new GlideRecord(this.tables.payment_history);
        gr.addQuery('policy', policyId);
        gr.orderByDesc('payment_date');
        gr.query();

        while (gr.next()) {
            payments.push({
                sys_id: gr.getUniqueValue(),
                date: gr.getDisplayValue('payment_date'),
                amount: gr.getDisplayValue('amount'),
                method: gr.getDisplayValue('payment_method'),
                status: gr.getDisplayValue('status')
            });
        }

        return payments;
    },

    // =========================================================================
    // REQUEST TYPES
    // =========================================================================

    /**
     * Get all active request types for dropdowns
     * @returns {Array} Array of {sys_id, name, label} objects
     */
    getRequestTypes: function() {
        var types = [];
        var gr = new GlideRecord(this.tables.request_type);
        gr.addQuery('active', true);
        gr.orderBy('order');
        gr.query();

        while (gr.next()) {
            types.push({
                sys_id: gr.getUniqueValue(),
                name: gr.getValue('name'),
                label: gr.getValue('label')
            });
        }

        return types;
    },

    // =========================================================================
    // PRIVATE HELPERS
    // =========================================================================

    /**
     * Serialize a GlideRecord of service_request to a plain object
     */
    _serializeRequest: function(gr) {
        return {
            sys_id: gr.getUniqueValue(),
            number: gr.getValue('number'),
            policy: gr.getValue('policy'),
            policy_display: gr.getDisplayValue('policy'),
            customer_name: gr.getValue('customer_name'),
            request_type: gr.getValue('request_type'),
            request_type_display: gr.getDisplayValue('request_type'),
            status: gr.getValue('status'),
            status_display: gr.getDisplayValue('status'),
            priority: gr.getValue('priority'),
            priority_display: gr.getDisplayValue('priority'),
            assigned_to: gr.getValue('assigned_to'),
            assigned_to_display: gr.getDisplayValue('assigned_to'),
            created_on: gr.getDisplayValue('sys_created_on'),
            updated_on: gr.getDisplayValue('sys_updated_on'),
            due_date: gr.getDisplayValue('due_date'),
            description: gr.getValue('description'),
            policy_type: gr.getValue('policy_type'),
            policy_value: gr.getValue('policy_value')
        };
    },

    /**
     * Serialize a GlideRecord of policy to a plain object
     */
    _serializePolicy: function(gr) {
        return {
            sys_id: gr.getUniqueValue(),
            number: gr.getValue('number'),
            policy_type: gr.getDisplayValue('policy_type'),
            status: gr.getDisplayValue('status'),
            effective_date: gr.getDisplayValue('effective_date'),
            expiration_date: gr.getDisplayValue('expiration_date'),
            premium_amount: gr.getDisplayValue('premium_amount'),
            premium_frequency: gr.getDisplayValue('premium_frequency'),
            coverage_amount: gr.getDisplayValue('coverage_amount'),
            owner: {
                name: gr.getValue('owner_name'),
                dob: gr.getDisplayValue('owner_dob'),
                phone: gr.getValue('owner_phone'),
                email: gr.getValue('owner_email'),
                address: {
                    street: gr.getValue('owner_street'),
                    city: gr.getValue('owner_city'),
                    state: gr.getValue('owner_state'),
                    zip: gr.getValue('owner_zip')
                }
            },
            insured: {
                name: gr.getValue('insured_name'),
                relationship: gr.getValue('insured_relationship')
            }
        };
    },

    /**
     * Check if a table exists in this instance.
     * Caches results to avoid repeated lookups.
     * @param {string} tableName - Table name to check
     * @returns {boolean}
     */
    _tableExists: function(tableName) {
        if (!this._tableCache) {
            this._tableCache = {};
        }
        if (this._tableCache.hasOwnProperty(tableName)) {
            return this._tableCache[tableName];
        }
        var gr = new GlideRecord('sys_db_object');
        gr.addQuery('name', tableName);
        gr.query();
        var exists = gr.hasNext();
        this._tableCache[tableName] = exists;
        return exists;
    },

    /**
     * Safely query a table - returns null if table doesn't exist.
     * @param {string} tableName - Table name to query
     * @returns {GlideRecord|null}
     */
    _safeGlideRecord: function(tableName) {
        if (!this._tableExists(tableName)) {
            gs.debug('SmartWorkspaceUtil: Table ' + tableName + ' does not exist, skipping.');
            return null;
        }
        return new GlideRecord(tableName);
    },

    /**
     * Safely create a GlideAggregate - returns null if table doesn't exist.
     * @param {string} tableName - Table name to aggregate
     * @returns {GlideAggregate|null}
     */
    _safeGlideAggregate: function(tableName) {
        if (!this._tableExists(tableName)) {
            gs.debug('SmartWorkspaceUtil: Table ' + tableName + ' does not exist, skipping aggregate.');
            return null;
        }
        return new GlideAggregate(tableName);
    },

    /**
     * Create an activity log entry
     */
    _logActivity: function(requestId, policyId, action, details) {
        var gr = new GlideRecord(this.tables.activity_log);
        gr.initialize();
        if (requestId) gr.setValue('service_request', requestId);
        if (policyId) gr.setValue('policy', policyId);
        gr.setValue('action', action);
        gr.setValue('performed_by', gs.getUserID());
        gr.setValue('action_date', new GlideDateTime());
        gr.setValue('details', details);
        gr.insert();
    },

    type: 'SmartWorkspaceUtil'
};