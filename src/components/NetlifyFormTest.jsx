import React, { useState } from 'react';
import { testNetlifyForm, testFormSubmission } from '../utils/formTester';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheckCircle, FiXCircle, FiAlertCircle } = FiIcons;

const NetlifyFormTest = () => {
  const [testResults, setTestResults] = useState({
    formPresent: null,
    submissionWorks: null
  });

  const runTests = async () => {
    // Test form presence
    const formPresent = testNetlifyForm();
    setTestResults(prev => ({ ...prev, formPresent }));

    // Test form submission
    const submissionWorks = await testFormSubmission();
    setTestResults(prev => ({ ...prev, submissionWorks }));
  };

  return (
    <div className="fixed bottom-4 right-4 bg-dark-gray border border-tactical-red rounded-lg p-4 max-w-sm z-50 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-tactical-red font-bold">Netlify Form Tester</h4>
        <SafeIcon 
          icon={
            testResults.formPresent && testResults.submissionWorks ? FiCheckCircle :
            testResults.formPresent === false || testResults.submissionWorks === false ? FiXCircle :
            FiAlertCircle
          } 
          className={
            testResults.formPresent && testResults.submissionWorks ? "text-green-400" :
            testResults.formPresent === false || testResults.submissionWorks === false ? "text-red-400" :
            "text-yellow-400"
          }
        />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span>Form Present:</span>
          {testResults.formPresent !== null && (
            <SafeIcon 
              icon={testResults.formPresent ? FiCheckCircle : FiXCircle}
              className={testResults.formPresent ? "text-green-400" : "text-red-400"}
            />
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Submission Works:</span>
          {testResults.submissionWorks !== null && (
            <SafeIcon 
              icon={testResults.submissionWorks ? FiCheckCircle : FiXCircle}
              className={testResults.submissionWorks ? "text-green-400" : "text-red-400"}
            />
          )}
        </div>
      </div>

      <button 
        onClick={runTests}
        className="w-full px-4 py-2 bg-tactical-red text-white rounded text-sm hover:bg-red-700 transition-colors"
      >
        Run Form Tests
      </button>
    </div>
  );
};

export default NetlifyFormTest;