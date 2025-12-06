/**
 * Error Boundary Component
 * 
 * React Error Boundary that catches JavaScript errors anywhere in the child
 * component tree, logs those errors, and displays a fallback UI instead of
 * crashing the entire application.
 * 
 * This is an essential component for production applications as it provides
 * graceful error handling and prevents the entire app from breaking due to
 * a single component error.
 * 
 * @module components/ui/ErrorBoundary
 * @component
 * 
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 */

import React from 'react'
import PropTypes from 'prop-types'
import './ErrorBoundary.css'

/**
 * Error Boundary Class Component
 * 
 * Error boundaries must be class components as hooks are not yet
 * supported for error boundaries in React.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  /**
   * Static method that is called when an error is thrown.
   * 
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Component stack trace information
   * @returns {Object} State update object
   */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  /**
   * Lifecycle method called after an error is thrown.
   * 
   * Used for logging error information.
   * 
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Component stack trace information
   */
  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }

    // In production, you might want to log to an error reporting service
    // Example: logErrorToService(error, errorInfo)

    this.setState({
      errorInfo,
    })
  }

  /**
   * Handle retry action.
   * Resets error state to allow component to re-render.
   */
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry)
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠️</div>
            <h2 className="error-boundary-title">Something went wrong</h2>
            <p className="error-boundary-message">
              We're sorry, but something unexpected happened. Please try again.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-boundary-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <button 
              className="error-boundary-retry-btn"
              onClick={this.handleRetry}
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    // Render children normally if no error
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  /**
   * Child components to wrap with error boundary
   */
  children: PropTypes.node.isRequired,
  
  /**
   * Custom fallback component/function
   * If provided, this will be called with (error, retryFunction) instead
   * of the default fallback UI
   */
  fallback: PropTypes.func,
}

ErrorBoundary.defaultProps = {
  fallback: null,
}

export default ErrorBoundary

