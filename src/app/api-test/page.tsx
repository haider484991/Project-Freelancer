'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ApiTestPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [testKey, setTestKey] = useState<number>(0);

  const runApiTest = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      // Set up test token
      localStorage.setItem('authToken', 'test_token_123');
      document.cookie = `auth_token=test_token_123; path=/; max-age=86400; SameSite=Strict`;
      
      // Log initial state
      setTestResult(prev => prev + 'Test started. Set test tokens.\n\n');
      
      // Step 1: Test direct proxy call
      setTestResult(prev => prev + '1. Testing direct proxy call...\n');
      const directResponse = await axios.post('/api/proxy', {
        mdl: 'dashboard',
        act: 'get'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer test_token_123`
        }
      });
      
      setTestResult(prev => prev + `✅ Direct proxy call succeeded\nStatus: ${directResponse.status}\nData: ${JSON.stringify(directResponse.data, null, 2)}\n\n`);
      
      // Step 2: Test API client module
      setTestResult(prev => prev + '2. Testing API client module...\n');
      const { dashboardApi } = await import('@/services/fitTrackApi');
      const clientResponse = await dashboardApi.get();
      
      setTestResult(prev => prev + `✅ API client call succeeded\nStatus: ${clientResponse.status}\nData: ${JSON.stringify(clientResponse.data, null, 2)}\n\n`);
      
      setTestResult(prev => prev + '✅ All tests passed!');
    } catch (error) {
      console.error('API test error:', error);
      if (axios.isAxiosError(error)) {
        setTestResult(prev => prev + `❌ Test failed: ${error.message}\n`);
        if (error.response) {
          setTestResult(prev => prev + `Status: ${error.response.status}\nData: ${JSON.stringify(error.response.data, null, 2)}\n\n`);
        } else {
          setTestResult(prev => prev + `No response received\n\n`);
        }
      } else {
        setTestResult(prev => prev + `❌ Test failed with error: ${error instanceof Error ? error.message : String(error)}\n\n`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">API Test Tool</h1>
        
        <div className="mb-6">
          <button
            onClick={() => {
              setTestKey(prev => prev + 1);
              runApiTest();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Run API Test'}
          </button>
        </div>
        
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Test Results</h2>
          <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-96" key={testKey}>
            {testResult || 'Click "Run API Test" to start testing...'}
          </pre>
        </div>
        
        <div className="mt-6 text-gray-600 text-sm">
          <p>This page tests direct API connectivity and helps diagnose issues with the proxy server.</p>
        </div>
      </div>
    </div>
  );
} 