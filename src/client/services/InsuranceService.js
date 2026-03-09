/**
 * Insurance Service - API client for FSO Insurance Portal
 */
export class InsuranceService {
  constructor() {
    this.baseUrl = '/api/x_dxcis_smart_st_0/fso_insurance_portal';
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-UserToken': window.g_ck
    };
  }

  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async getPolicies(filters = {}, limit = 50, offset = 0) {
    try {
      const response = await fetch(`${this.baseUrl}/policies`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          filters,
          limit,
          offset
        })
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching policies:', error);
      throw error;
    }
  }

  async getBillingRecords(filters = {}, limit = 50, offset = 0) {
    try {
      const response = await fetch(`${this.baseUrl}/billing`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          filters,
          limit,
          offset
        })
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching billing records:', error);
      throw error;
    }
  }

  async getServiceDefinitions(category = '') {
    try {
      const response = await fetch(`${this.baseUrl}/services/${category}`, {
        method: 'GET',
        headers: this.headers
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching service definitions:', error);
      throw error;
    }
  }

  async createPolicyTask(data) {
    try {
      const response = await fetch(`${this.baseUrl}/policies/create`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error creating policy task:', error);
      throw error;
    }
  }

  async createBillingTask(data) {
    try {
      const response = await fetch(`${this.baseUrl}/billing/create`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error creating billing task:', error);
      throw error;
    }
  }
}