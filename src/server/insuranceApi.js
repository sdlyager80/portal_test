import { gs, GlideDateTime } from '@servicenow/glide';

export function getInsuranceData(request, response) {
    try {
        // Simple response for now - using GlideDateTime properly
        const now = new GlideDateTime();
        const data = {
            status: 'active',
            message: 'Insurance Portal API is working',
            timestamp: now.getDisplayValue()
        };
        
        response.setStatus(200);
        response.getStreamWriter().writeString(JSON.stringify({
            result: data
        }));
        
    } catch (error) {
        gs.error('Insurance API Error: ' + error.message);
        response.setStatus(500);
        response.getStreamWriter().writeString(JSON.stringify({
            error: 'Internal server error',
            message: error.message
        }));
    }
}