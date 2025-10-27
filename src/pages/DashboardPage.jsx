import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import expenseService from '../services/expenseService';
import approvalService from '../services/approvalService';
import { PlusIcon, FileTextIcon, ClockIcon, CheckCircleIcon, XCircleIcon, UploadIcon } from 'lucide-react';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    unreportedExpenses: 0,
    totalExpenses: 0,
    approvedExpenses: 0,
    rejectedExpenses: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    setUser(currentUser);
    fetchDashboardData(currentUser);
  }, []);

  const fetchDashboardData = async (currentUser) => {
    try {
      setLoading(true);
      
      // Check if user is admin/manager or employee
      const isAdminOrManager = currentUser?.role?.includes('ADMIN') || 
                               currentUser?.role?.includes('MANAGER') ||
                               currentUser?.role?.includes('FINANCE_MANAGER');

      if (isAdminOrManager) {
        // Fetch all expenses for admin/manager
        const expensesResponse = await expenseService.getAllExpenses({ page: 0, size: 100 });
        const expenses = expensesResponse.data.content || [];
        
        // Fetch all approvals
        const approvalsResponse = await approvalService.getAllApprovals({ page: 0, size: 100 });
        const approvals = approvalsResponse.data.content || [];
        
        const pendingApprovals = approvals.filter(a => a.approvalStatus === 'PENDING').length;
        
        setStats({
          pendingApprovals,
          unreportedExpenses: 0,
          totalExpenses: expenses.length,
          approvedExpenses: expenses.filter(e => e.status === 'APPROVED').length,
          rejectedExpenses: expenses.filter(e => e.status === 'REJECTED').length
        });
      } else {
        // Fetch my expenses for employee
        const expensesResponse = await expenseService.getMyExpenses({ page: 0, size: 100 });
        const expenses = expensesResponse.data.content || [];
        
        setStats({
          pendingApprovals: expenses.filter(e => e.status === 'PENDING').length,
          unreportedExpenses: 0,
          totalExpenses: expenses.length,
          approvedExpenses: expenses.filter(e => e.status === 'APPROVED').length,
          rejectedExpenses: expenses.filter(e => e.status === 'REJECTED').length
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const QuickActionCard = ({ icon: Icon, title, description, onClick, color }) => (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-4`}>
        <Icon className="text-white" size={24} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );

  const isAdminOrManager = user?.role?.includes('ADMIN') || 
                           user?.role?.includes('MANAGER') ||
                           user?.role?.includes('FINANCE_MANAGER');

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Hello, {user ? user.username : 'User'}
        </h1>
        <p className="text-green-100">
          {isAdminOrManager 
            ? 'Welcome to your expense management dashboard' 
            : 'Welcome back to your expense dashboard'}
        </p>
      </div>

      {/* Pending Tasks */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pending Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <ClockIcon className="text-orange-600 dark:text-orange-400" size={24} />
              <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {stats.pendingApprovals}
              </span>
            </div>
            <p className="text-sm font-medium text-orange-900 dark:text-orange-300">
              {isAdminOrManager ? 'Pending Approval' : 'Pending Expenses'}
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FileTextIcon className="text-blue-600 dark:text-blue-400" size={24} />
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.unreportedExpenses}
              </span>
            </div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Unreported Expenses
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FileTextIcon className="text-gray-600 dark:text-gray-400" size={24} />
              <span className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                Rs 0.00
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
              Unreported Advances
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Add</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            icon={PlusIcon}
            title="Create Expense"
            description="Add a new expense quickly"
            onClick={() => navigate('/expenses')}
            color="bg-blue-500"
          />
          <QuickActionCard
            icon={UploadIcon}
            title="Drag Receipts or click here to attach"
            description="Upload receipts for your expenses"
            onClick={() => navigate('/expenses')}
            color="bg-green-500"
          />
          <QuickActionCard
            icon={FileTextIcon}
            title="Create Report"
            description="Generate expense reports"
            onClick={() => navigate('/reports')}
            color="bg-orange-500"
          />
        </div>
      </div>

      {/* Statistics */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={FileTextIcon}
            label="Total Expenses"
            value={stats.totalExpenses}
            color="bg-blue-500"
          />
          <StatCard
            icon={CheckCircleIcon}
            label="Approved"
            value={stats.approvedExpenses}
            color="bg-green-500"
          />
          <StatCard
            icon={XCircleIcon}
            label="Rejected"
            value={stats.rejectedExpenses}
            color="bg-red-500"
          />
          <StatCard
            icon={ClockIcon}
            label="Pending"
            value={stats.pendingApprovals}
            color="bg-orange-500"
          />
        </div>
      </div>

      {/* Reports Summary */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reports Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Most Recent Reports</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">0</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unsubmitted Reports</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">0</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting Approval</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">0 (Rs 0.00)</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting Reimbursement</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;