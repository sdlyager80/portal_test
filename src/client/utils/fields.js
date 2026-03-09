// Essential field utility functions for ServiceNow API responses
export const display = (field) => field?.display_value || '';
export const value = (field) => field?.value || '';