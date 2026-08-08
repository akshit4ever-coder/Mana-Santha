import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/UI/button";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    // Send to error tracking service (Sentry, etc.)
    if (typeof window !== "undefined" && window.__SENTRY__) {
      window.__SENTRY__.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="max-w-md rounded-xl border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <h2 className="font-semibold text-destructive">Oops! Something went wrong</h2>
                  <p className="text-sm text-destructive/80">{this.state.error?.message}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => {
                    this.setState({ hasError: false });
                    window.location.href = "/";
                  }}
                  className="w-full rounded-full"
                >
                  Go Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full rounded-full"
                >
                  Reload
                </Button>
              </div>
              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                  <details>
                    <summary className="cursor-pointer font-mono font-semibold">Error Details</summary>
                    <pre className="mt-2 whitespace-pre-wrap break-words">{this.state.error?.stack}</pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
