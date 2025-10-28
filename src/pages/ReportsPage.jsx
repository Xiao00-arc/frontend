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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage and track your expense reports
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            <PlusIcon size={20} />
            <span className="hidden sm:inline">New Report</span>
            <span className="sm:hidden">New</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base">
            <UploadIcon size={20} />
            <span className="hidden sm:inline">Import Reports</span>
            <span className="sm:hidden">Import</span>
          </button>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileTextIcon className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Get started with Reports
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
              From Reports, you can create expense reports, add expenses, and submit for approval. 
              Reports with pending actions are shown separately to help you take quick action.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                <PlusIcon size={18} />
                New Report
              </button>
              <button className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base">
                <UploadIcon size={18} />
                Import Reports
              </button>
            </div>
            <div className="mt-6">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                You may have Reports shared by others
              </p>
              <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium mt-1">
                View shared Reports →
              </button>
            </div>
          </div>

          {/* Sample Report Preview */}
          <div className="flex-1">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 sm:p-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-4">
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      {sampleReport.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Duration: {sampleReport.duration}
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                    EXPENSES
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-start gap-2 sm:gap-3 bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg">
                    <div className="w-10 h-12 sm:w-12 sm:h-16 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 flex items-center justify-center flex-shrink-0">
                      <FileTextIcon size={16} className="text-gray-400 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                            {sampleReport.expenses[0].date}
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                            {sampleReport.expenses[0].description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {sampleReport.expenses[0].notes}
                          </p>
                        </div>
                        <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white whitespace-nowrap">
                          ${sampleReport.expenses[0].amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 text-center">
            <p className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Create New Report
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Monthly Report"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Add a description..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add report creation logic here
                  setShowCreateModal(false);
                }}
                className="flex-1 px-4 py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
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