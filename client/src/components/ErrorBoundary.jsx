import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
                    <div className="glass-card p-8 max-w-md w-full animate-slide-up">
                        {/* Error Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-red-500/20 rounded-full">
                                <AlertCircle className="w-16 h-16 text-red-400" />
                            </div>
                        </div>

                        {/* Error Message */}
                        <h1 className="text-2xl font-bold text-white mb-4 text-center">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-gray-300 mb-6 text-center">
                            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
                        </p>

                        {/* Error Details (Development Only) */}
                        {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                            <details className="mb-6 bg-black/30 rounded-lg p-4">
                                <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                                    Technical Details
                                </summary>
                                <pre className="text-xs text-red-300 mt-2 overflow-auto max-h-40">
                                    {this.state.error?.stack}
                                </pre>
                            </details>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={this.handleReload}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Reload Page
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="btn-secondary w-full"
                            >
                                Go to Home
                            </button>
                        </div>

                        {/* Help Text */}
                        <p className="text-gray-400 text-xs text-center mt-6">
                            If this problem persists, please try clearing your browser cache
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
