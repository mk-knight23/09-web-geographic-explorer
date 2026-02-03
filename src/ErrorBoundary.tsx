import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
        // Error logging would go to error reporting service in production
        // Example: Sentry.captureException(error, { extra: errorInfo });
        void error;
        void errorInfo;
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white rounded-[2rem] p-12 shadow-xl text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">⚠️</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mb-4">Something went wrong</h1>
                        <p className="text-slate-500 mb-8">
                            We encountered an unexpected error. Please refresh the page to try again.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-4 bg-indigo-600 text-white font-black rounded-full hover:bg-indigo-700 transition-colors"
                        >
                            Refresh Page
                        </button>
                        {this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="text-xs font-bold text-slate-400 uppercase tracking-widest cursor-pointer">
                                    Error Details
                                </summary>
                                <pre className="mt-4 text-xs text-slate-600 bg-slate-100 p-4 rounded-xl overflow-auto">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
