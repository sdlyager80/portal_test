/**
 * InsuranceService
 * API client for the FSO Insurance Portal scripted REST API.
 * Uses window.g_ck (ServiceNow CSRF token) for authentication.
 */
export class InsuranceService {
    constructor() {
        this.base = '/api/x_dxcis_smart_st_0/fso_insurance_portal';
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-UserToken': window.g_ck,
        };
    }

    async _handleResponse(res) {
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.message || `HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
    }

    getPolicies(filters = {}, limit = 50, offset = 0) {
        return fetch(`${this.base}/policies`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ filters, limit, offset }),
        }).then((r) => this._handleResponse(r));
    }

    getBillingRecords(filters = {}, limit = 50, offset = 0) {
        return fetch(`${this.base}/billing`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ filters, limit, offset }),
        }).then((r) => this._handleResponse(r));
    }

    getServiceDefinitions(category = '') {
        return fetch(`${this.base}/services/${category}`, {
            method: 'GET',
            headers: this.headers,
        }).then((r) => this._handleResponse(r));
    }

    createPolicyTask(data) {
        return fetch(`${this.base}/policies/create`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data),
        }).then((r) => this._handleResponse(r));
    }

    createBillingTask(data) {
        return fetch(`${this.base}/billing/create`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data),
        }).then((r) => this._handleResponse(r));
    }
}
