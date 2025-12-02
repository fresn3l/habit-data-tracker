/**
 * Application Entry Point
 * 
 * This is the React application's entry point. It:
 * - Renders the root App component
 * - Sets up React StrictMode for development warnings
 * - Imports global CSS styles
 * 
 * React StrictMode helps identify potential problems by:
 * - Identifying components with unsafe lifecycles
 * - Warning about legacy string ref API usage
 * - Detecting unexpected side effects
 * - Warning about deprecated APIs
 * 
 * @module main
 * @fileoverview React application entry point
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * Render the application to the DOM.
 * 
 * Uses React 18's createRoot API for concurrent rendering.
 * The root element is expected to exist in index.html with id="root".
 * 
 * @see https://react.dev/reference/react-dom/client/createRoot
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
