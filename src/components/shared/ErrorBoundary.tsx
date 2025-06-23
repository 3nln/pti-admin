import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pti-blue-50 to-pti-blue-100 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-pti-red-50">
                  <AlertTriangle className="h-8 w-8 text-pti-red" />
                </div>
              </div>
              <CardTitle className="text-xl text-pti-gray-900">
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-pti-gray-600">
                We're sorry, but something unexpected happened. Please try
                refreshing the page or contact support if the problem persists.
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="text-left p-3 bg-pti-red-50 rounded text-xs text-pti-red-700 font-mono">
                  {this.state.error.message}
                </div>
              )}
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="bg-pti-blue hover:bg-pti-blue-600"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Simple error display component for API errors etc.
interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({
  title = "Error",
  message,
  onRetry,
  className,
}: ErrorDisplayProps) {
  return (
    <Card className={className}>
      <CardContent className="text-center p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-pti-red-50">
            <AlertTriangle className="h-6 w-6 text-pti-red" />
          </div>
        </div>
        <h3 className="font-semibold text-pti-gray-900 mb-2">{title}</h3>
        <p className="text-pti-gray-600 mb-4">{message}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-pti-red text-pti-red hover:bg-pti-red hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
