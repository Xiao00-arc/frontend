import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSignIcon, 
  FileTextIcon, 
  ShieldCheckIcon, 
  BarChart3Icon, 
  UsersIcon, 
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon 
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="bg-black bg-opacity-50 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <DollarSignIcon className="h-8 w-8 text-green-400 mr-2" />
              <span className="text-2xl font-bold text-white">Expense System</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-md transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Manage Your Business{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-500">
              Expenses,
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-500">
              Effortlessly.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
            Our platform provides a complete, secure, and scalable solution for tracking, 
            approving, and managing business expenses for any organization.
          </p>
          
          <Link
            to="/signup"
            className="inline-flex items-center bg-green-600 text-white text-lg px-8 py-4 rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Start Managing Expenses for Free
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Secure Authentication</h3>
              <p className="text-gray-300 leading-relaxed">
                Robust JWT-based security with role-based access control to protect your financial data.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <FileTextIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Receipt Management</h3>
              <p className="text-gray-300 leading-relaxed">
                Upload and manage receipts with support for PNG, PDF formats and automatic organization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <BarChart3Icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Advanced Reporting</h3>
              <p className="text-gray-300 leading-relaxed">
                Generate detailed reports and analytics to track spending patterns and budget compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose Expense System?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Streamline your expense management process with our comprehensive platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: UsersIcon,
                title: "Multi-User Support",
                description: "Manage expenses for entire teams with role-based permissions"
              },
              {
                icon: ClockIcon,
                title: "Real-time Processing",
                description: "Instant expense submissions and approval workflows"
              },
              {
                icon: CheckCircleIcon,
                title: "Automated Approvals",
                description: "Configurable approval workflows based on amount and category"
              },
              {
                icon: DollarSignIcon,
                title: "Cost Tracking",
                description: "Track expenses by category, department, and time period"
              },
              {
                icon: FileTextIcon,
                title: "Audit Trail",
                description: "Complete audit logs for compliance and accountability"
              },
              {
                icon: BarChart3Icon,
                title: "Budget Management",
                description: "Set budgets and receive alerts when limits are approached"
              }
            ].map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "99.9%", label: "Uptime" },
              { number: "50ms", label: "Response Time" },
              { number: "256-bit", label: "Encryption" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
                <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Expense Management?
          </h2>
          <p className="text-xl text-green-100 mb-12">
            Join thousands of businesses already using Expense System to streamline their financial processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              Create Your Account
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      </div>      {/* Footer */}
      <footer className="bg-black bg-opacity-80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <DollarSignIcon className="h-8 w-8 text-green-400 mr-2" />
              <span className="text-2xl font-bold text-white">Expense System</span>
            </div>
            <div className="text-gray-400">
              © 2025 Expense System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;