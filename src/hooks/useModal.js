/**
 * Custom React Hook for Modal State Management
 * 
 * Provides a reusable pattern for managing modal open/close state
 * and the data associated with the modal.
 * 
 * @module hooks/useModal
 * @returns {Object} Modal management interface
 */

import { useState, useCallback } from 'react'

/**
 * Custom hook for managing modal state.
 * 
 * @param {boolean} [initialState=false] - Initial open/closed state
 * @returns {Object} Modal state management interface
 * @property {boolean} isOpen - Whether modal is currently open
 * @property {Object|null} data - Data associated with the modal
 * @property {Function} open - Open the modal (optionally with data)
 * @property {Function} close - Close the modal and clear data
 * @property {Function} toggle - Toggle modal open/closed state
 * 
 * @example
 * const modal = useModal()
 * 
 * // Open with data
 * modal.open({ id: 1, name: 'Example' })
 * 
 * // Close
 * modal.close()
 * 
 * // Check if open
 * if (modal.isOpen) { ... }
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)
  const [data, setData] = useState(null)

  /**
   * Open the modal, optionally with associated data.
   * 
   * @param {*} [modalData=null] - Data to associate with the modal
   */
  const open = useCallback((modalData = null) => {
    setData(modalData)
    setIsOpen(true)
  }, [])

  /**
   * Close the modal and clear associated data.
   */
  const close = useCallback(() => {
    setIsOpen(false)
    setData(null)
  }, [])

  /**
   * Toggle the modal open/closed state.
   */
  const toggle = useCallback(() => {
    setIsOpen(prev => {
      if (prev) {
        setData(null)
      }
      return !prev
    })
  }, [])

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
  }
}

