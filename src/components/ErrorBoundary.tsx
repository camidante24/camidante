import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="container-custom py-24 text-center">
          <h1 className="text-4xl font-bold mb-4">Algo salió mal</h1>
          <p className="text-on-surface-variant mb-8">
            {this.state.error?.message ?? 'Error inesperado'}
          </p>
          <Link to="/" className="btn-primary inline-block">Volver al inicio</Link>
        </div>
      );
    }
    return this.props.children;
  }
}
