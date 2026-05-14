import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10" />
            </div>
            
            <h1 className="text-3xl font-black text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-8">
              We've encountered an unexpected error. Don't worry, your data is safe.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Try Again
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" /> Go Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-50 rounded-xl text-left overflow-auto max-h-40">
                <p className="text-xs font-mono text-red-600 whitespace-pre-wrap">
                  {this.state.error?.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
