import apiClient from './client.js';

/**
 * Submit contact message
 * @param {Object} contactData 
 * @returns {Promise<Object>}
 */
export async function submitContactMessage(contactData) {
    try {
        const response = await apiClient.post('/contact', contactData);
        return response.data;
    } catch (error) {
        console.error('Failed to submit contact message:', error.message);
        throw error;
    }
}
