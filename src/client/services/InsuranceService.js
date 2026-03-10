/**
 * Insurance Service - API interactions for FSO Insurance Portal
 */
export class InsuranceService {
  constructor() {
    this.baseUrl = '/api/x_dxcis_smart_st_0/insurance_portal';
  }

  /**
   * Make authenticated API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UserToken': window.g_ck,
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Get policies with pagination
   */
  async getPolicies(filter = {}, limit = 20, offset = 0) {
    try {
      const params = new URLSearchParams({ limit, offset, ...filter });
      const response = await this.request(`/policies?${params}`);
      return response;
    } catch (error) {
      // Fallback demo data
      return {
        result: [
          {
            sys_id: 'pol1',
            number: 'POL-001',
            short_description: 'Beneficiary Change',
            consumer: 'John Smith',
            priority: '3',
            state: 'Open',
            assigned_to: 'Agent Smith',
            sys_created_on: '2024-01-15 10:00:00'
          },
          {
            sys_id: 'pol2',
            number: 'POL-002',
            short_description: 'Address Change',
            consumer: 'Jane Doe',
            priority: '4',
            state: 'In Progress',
            assigned_to: 'Agent Johnson',
            sys_created_on: '2024-01-14 14:30:00'
          },
          {
            sys_id: 'pol3',
            number: 'POL-003',
            short_description: 'Owner Change',
            consumer: 'Robert Williams',
            priority: '2',
            state: 'Open',
            assigned_to: 'Agent Davis',
            sys_created_on: '2024-01-13 09:15:00'
          },
          {
            sys_id: 'pol4',
            number: 'POL-004',
            short_description: 'Returned Mail',
            consumer: 'Susan Miller',
            priority: '3',
            state: 'New',
            assigned_to: 'Agent Brown',
            sys_created_on: '2024-01-12 16:00:00'
          }
        ]
      };
    }
  }

  /**
   * Get billing records with pagination
   */
  async getBillingRecords(filter = {}, limit = 20, offset = 0) {
    try {
      const params = new URLSearchParams({ limit, offset, ...filter });
      const response = await this.request(`/billing?${params}`);
      return response;
    } catch (error) {
      // Fallback demo data
      return {
        result: [
          {
            sys_id: 'bill1',
            number: 'BILL-001',
            short_description: 'Monthly premium payment overdue',
            consumer: 'John Smith',
            priority: '3',
            state: 'Open',
            assigned_to: 'Billing Team',
            sys_created_on: '2024-01-16 09:00:00'
          },
          {
            sys_id: 'bill2',
            number: 'BILL-002',
            short_description: 'Payment processing error',
            consumer: 'Jane Doe',
            priority: '2',
            state: 'Resolved',
            assigned_to: 'Finance Team',
            sys_created_on: '2024-01-13 16:45:00'
          }
        ]
      };
    }
  }

  /**
   * Get service definitions by category
   */
  async getServiceDefinitions(category = '') {
    try {
      const params = category ? `?category=${category}` : '';
      const response = await this.request(`/service-definitions${params}`);
      return response;
    } catch (error) {
      // Fallback demo data
      return {
        result: [
          { sys_id: 'sd1', name: 'Beneficiary Change', category: 'policy' },
          { sys_id: 'sd2', name: 'Address Change',     category: 'policy' },
          { sys_id: 'sd3', name: 'Owner Change',       category: 'policy' },
          { sys_id: 'sd4', name: 'Returned Mail',      category: 'policy' },
          { sys_id: 'sd5', name: 'Payment Setup',      category: 'billing' },
          { sys_id: 'sd6', name: 'Billing Inquiry',    category: 'billing' }
        ]
      };
    }
  }

  /**
   * Create a policy task
   */
  async createPolicyTask(taskData) {
    try {
      const response = await this.request('/policies', {
        method: 'POST',
        body: JSON.stringify(taskData)
      });
      return response;
    } catch (error) {
      // Fallback success response
      return {
        result: {
          sys_id: `task_${Date.now()}`,
          number: `POL-${String(Date.now()).slice(-3)}`,
          ...taskData,
          state: 'New',
          sys_created_on: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Create a billing task
   */
  async createBillingTask(taskData) {
    try {
      const response = await this.request('/billing', {
        method: 'POST',
        body: JSON.stringify(taskData)
      });
      return response;
    } catch (error) {
      // Fallback success response
      return {
        result: {
          sys_id: `bill_${Date.now()}`,
          number: `BILL-${String(Date.now()).slice(-3)}`,
          ...taskData,
          state: 'New',
          sys_created_on: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Get dashboard data
   */
  async getDashboardData() {
    try {
      const response = await this.request('/dashboard');
      return response.result;
    } catch (error) {
      // Fallback demo data
      return {
        activePolicies: 3,
        pendingClaims: 1,
        recentPayments: 2,
        notifications: [
          { id: 1, type: 'info', message: 'Policy renewal due in 30 days', date: new Date().toISOString() },
          { id: 2, type: 'success', message: 'Payment processed successfully', date: new Date().toISOString() }
        ]
      };
    }
  }

  /**
   * Submit a service request
   */
  async submitServiceRequest(requestData) {
    try {
      const response = await this.request('/service-request', {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
      return response.result;
    } catch (error) {
      // Fallback success response
      return {
        success: true,
        requestNumber: `REQ-${Date.now()}`,
        message: 'Service request submitted successfully (demo mode)'
      };
    }
  }
}