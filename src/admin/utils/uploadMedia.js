import apiClient from '../../api/client.js';

/**
 * Upload a media file (image or video) to the backend
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - Returns the uploaded file URL (e.g., "/uploads/filename.ext")
 * @throws {Error} - If upload fails
 */
export async function uploadMedia(file) {
  if (!file) {
    throw new Error('No file provided');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    // DO NOT set Content-Type manually - let browser set boundary for multipart/form-data
    const response = await apiClient.post('/admin/uploads', formData, {
      headers: {
        // Let axios/browser set Content-Type with boundary automatically
      },
    });

    if (response.data?.success && response.data?.data?.url) {
      return response.data.data.url;
    } else {
      throw new Error(response.data?.message || 'Upload failed');
    }
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || 'Failed to upload file');
  }
}



