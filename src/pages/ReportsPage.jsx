import React, { useState, useEffect } from 'react';
import { PlusIcon, UploadIcon, FileTextIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sample report data - you can fetch from API later
  const sampleReport = {
    id: 1,
    title: 'Monthly Report (John)',
    duration: '1/02/2025 - 07/02/2025',
    expenses: [
      {
        id: 1,
        date: '1/02/2025',
        description: 'Food Expense',
        notes: 'Meeting with Client Mr.Jankar at his place',
        amount: 15.00
      }
    ],
    totalAmount: 15.00,
    status: 'DRAFT'
  };

  const stats = [
    { label: 'Most Recent Reports', value: 0, color: 'text-blue-600' },
    { label: 'Unsubmitted Reports', value: 0, color: 'text-gray-600' },
    { label: 'Awaiting Approval', value: 0, color: 'text-orange-600' },
    { label: 'Awaiting Reimbursement', value: '0 (Rs 0.00)', color: 'text-green-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track your expense reports
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon size={20} />
            New Report
          </button>
          <button className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg transition-colors">
            <UploadIcon size={20} />
            Import Reports
          </button>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FileTextIcon className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Get started with Reports
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              From Reports, you can create expense reports, add expenses, and submit for approval. 
              Reports with pending actions are shown separately to help you take quick action.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PlusIcon size={18} />
                New Report
              </button>
              <button className="flex items-center gap-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg transition-colors">
                <UploadIcon size={18} />
                Import Reports
              </button>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You may have Reports shared by others
              </p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1">
                View shared Reports →
              </button>
            </div>
          </div>

          {/* Sample Report Preview */}
          <div className="flex-1">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {sampleReport.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Duration: {sampleReport.duration}
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full">
                    EXPENSES
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="w-12 h-16 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 flex items-center justify-center">
                      <FileTextIcon size={20} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {sampleReport.expenses[0].date}
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {sampleReport.expenses[0].description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {sampleReport.expenses[0].notes}
                          </p>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          ${sampleReport.expenses[0].amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get started with Reports <span className="font-bold">(2:28)</span>
                </p>
                <div className="flex justify-center gap-2 mt-2">
                  <button className="w-2 h-2 rounded-full bg-blue-600"></button>
                  <button className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Create New Report
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Monthly Report"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Add a description..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add report creation logic here
                  setShowCreateModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Create Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;