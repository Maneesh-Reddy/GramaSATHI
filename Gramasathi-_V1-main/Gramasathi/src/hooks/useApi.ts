import { useState, useCallback } from 'react';

// API URL configuration
const API_URL = 'http://localhost:5002/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  isFormData?: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  success: boolean;
}

function useApi<T = any>() {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
    success: false
  });

  const request = useCallback(async (endpoint: string, options: ApiOptions = {}) => {
    const {
      method = 'GET',
      headers = {},
      body = null,
      isFormData = false
    } = options;

    // Get token from local storage
    const token = localStorage.getItem('token');

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Prepare headers
      const requestHeaders: Record<string, string> = {
        ...headers
      };

      // Add authorization header if token exists
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }

      // Don't set Content-Type for FormData (browser will set it with boundary)
      if (!isFormData && method !== 'GET') {
        requestHeaders['Content-Type'] = 'application/json';
      }

      // Prepare request options
      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        credentials: 'include'
      };

      // Add body if needed
      if (body && method !== 'GET') {
        requestOptions.body = isFormData ? body : JSON.stringify(body);
      }

      // Make request
      const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
      const response = await fetch(fullUrl, requestOptions);
      const data = await response.json();

      // Check if response is ok
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setState({
        data: data.data || data,
        error: null,
        loading: false,
        success: true
      });

      return { data: data.data || data, success: true };
    } catch (error: any) {
      setState({
        data: null,
        error: error.message || 'Something went wrong',
        loading: false,
        success: false
      });

      return { error: error.message, success: false };
    }
  }, []);

  return {
    ...state,
    request
  };
}

export default useApi; 