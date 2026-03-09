import { gs, GlideRecord } from '@servicenow/glide';

/**
 * Insurance Data Service Handler
 * Provides REST API endpoints for FSO Insurance Portal
 */

export function getPolicies(request, response) {
    try {
        const { limit = 50, offset = 0, filters = {} } = JSON.parse(request.body.data || '{}');
        
        const gr = new GlideRecord('x_dxcis_bpm_core_policy_administration');
        
        // Apply filters
        if (filters.policy_number) {
            gr.addQuery('number', 'CONTAINS', filters.policy_number);
        }
        if (filters.state) {
            gr.addQuery('state', filters.state);
        }
        if (filters.assigned_to) {
            gr.addQuery('assigned_to', filters.assigned_to);
        }
        
        gr.addQuery('active', true);
        gr.orderByDesc('sys_created_on');
        gr.chooseWindow(offset, offset + limit);
        gr.query();
        
        const policies = [];
        while (gr.next()) {
            policies.push({
                sys_id: gr.sys_id.toString(),
                number: gr.number.toString(),
                short_description: gr.short_description.toString(),
                state: gr.state.getDisplayValue(),
                state_value: gr.state.toString(),
                assigned_to: gr.assigned_to.getDisplayValue(),
                assigned_to_value: gr.assigned_to.toString(),
                consumer: gr.consumer.getDisplayValue(),
                priority: gr.priority.getDisplayValue(),
                opened_at: gr.opened_at.getDisplayValue(),
                sys_created_on: gr.sys_created_on.getDisplayValue()
            });
        }
        
        response.setStatus(200);
        response.getStreamWriter().writeString(JSON.stringify({
            result: policies,
            total: policies.length
        }));
        
    } catch (error) {
        gs.error('Error in getPolicies: ' + error.message);
        response.setStatus(500);
        response.getStreamWriter().writeString(JSON.stringify({
            error: 'Failed to fetch policies',
            message: error.message
        }));
    }
}

export function getBillingRecords(request, response) {
    try {
        const { limit = 50, offset = 0, filters = {} } = JSON.parse(request.body.data || '{}');
        
        const gr = new GlideRecord('x_dxcis_bpm_core_billing_payment');
        
        // Apply filters
        if (filters.number) {
            gr.addQuery('number', 'CONTAINS', filters.number);
        }
        if (filters.state) {
            gr.addQuery('state', filters.state);
        }
        if (filters.consumer) {
            gr.addQuery('consumer', filters.consumer);
        }
        
        gr.addQuery('active', true);
        gr.orderByDesc('sys_created_on');
        gr.chooseWindow(offset, offset + limit);
        gr.query();
        
        const billingRecords = [];
        while (gr.next()) {
            billingRecords.push({
                sys_id: gr.sys_id.toString(),
                number: gr.number.toString(),
                short_description: gr.short_description.toString(),
                state: gr.state.getDisplayValue(),
                state_value: gr.state.toString(),
                consumer: gr.consumer.getDisplayValue(),
                consumer_value: gr.consumer.toString(),
                priority: gr.priority.getDisplayValue(),
                opened_at: gr.opened_at.getDisplayValue(),
                sys_created_on: gr.sys_created_on.getDisplayValue()
            });
        }
        
        response.setStatus(200);
        response.getStreamWriter().writeString(JSON.stringify({
            result: billingRecords,
            total: billingRecords.length
        }));
        
    } catch (error) {
        gs.error('Error in getBillingRecords: ' + error.message);
        response.setStatus(500);
        response.getStreamWriter().writeString(JSON.stringify({
            error: 'Failed to fetch billing records',
            message: error.message
        }));
    }
}

export function getServiceDefinitions(request, response) {
    try {
        const { category } = request.pathParams;
        
        const gr = new GlideRecord('sn_bom_service_definition');
        gr.addQuery('active', true);
        
        // Filter by category if provided
        if (category === 'policy') {
            gr.addQuery('name', 'CONTAINS', 'Policy');
        } else if (category === 'billing') {
            gr.addQuery('name', 'CONTAINS', 'Billing');
        }
        
        gr.orderBy('name');
        gr.query();
        
        const services = [];
        while (gr.next()) {
            services.push({
                sys_id: gr.sys_id.toString(),
                name: gr.name.toString(),
                id: gr.id.toString(),
                description: gr.description.toString(),
                task_table: gr.task_table.toString(),
                service_type: gr.service_type.toString()
            });
        }
        
        response.setStatus(200);
        response.getStreamWriter().writeString(JSON.stringify({
            result: services
        }));
        
    } catch (error) {
        gs.error('Error in getServiceDefinitions: ' + error.message);
        response.setStatus(500);
        response.getStreamWriter().writeString(JSON.stringify({
            error: 'Failed to fetch service definitions',
            message: error.message
        }));
    }
}

export function createPolicyTask(request, response) {
    try {
        const data = JSON.parse(request.body.data);
        
        const gr = new GlideRecord('x_dxcis_bpm_core_policy_administration');
        gr.initialize();
        
        // Set required fields
        gr.short_description = data.short_description || '';
        gr.description = data.description || '';
        gr.consumer = data.consumer || '';
        gr.priority = data.priority || '3';
        gr.state = '1'; // New
        
        // Set service definition if provided
        if (data.service_definition) {
            gr.service_definition = data.service_definition;
        }
        
        const sysId = gr.insert();
        
        if (sysId) {
            response.setStatus(201);
            response.getStreamWriter().writeString(JSON.stringify({
                result: {
                    sys_id: sysId,
                    number: gr.number.toString()
                },
                message: 'Policy task created successfully'
            }));
        } else {
            throw new Error('Failed to create policy task');
        }
        
    } catch (error) {
        gs.error('Error in createPolicyTask: ' + error.message);
        response.setStatus(500);
        response.getStreamWriter().writeString(JSON.stringify({
            error: 'Failed to create policy task',
            message: error.message
        }));
    }
}

export function createBillingTask(request, response) {
    try {
        const data = JSON.parse(request.body.data);
        
        const gr = new GlideRecord('x_dxcis_bpm_core_billing_payment');
        gr.initialize();
        
        // Set required fields
        gr.short_description = data.short_description || '';
        gr.description = data.description || '';
        gr.consumer = data.consumer || '';
        gr.priority = data.priority || '3';
        gr.state = '1'; // New
        
        // Set service definition if provided
        if (data.service_definition) {
            gr.service_definition = data.service_definition;
        }
        
        const sysId = gr.insert();
        
        if (sysId) {
            response.setStatus(201);
            response.getStreamWriter().writeString(JSON.stringify({
                result: {
                    sys_id: sysId,
                    number: gr.number.toString()
                },
                message: 'Billing task created successfully'
            }));
        } else {
            throw new Error('Failed to create billing task');
        }
        
    } catch (error) {
        gs.error('Error in createBillingTask: ' + error.message);
        response.setStatus(500);
        response.getStreamWriter().writeString(JSON.stringify({
            error: 'Failed to create billing task',
            message: error.message
        }));
    }
}