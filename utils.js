// Utility functions

/**
 * Format number as currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Format date
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(d);
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Validate transaction data
 * @param {Object} transaction - Transaction object to validate
 * @returns {boolean} True if valid
 */
export function validateTransaction(transaction) {
    if (!transaction.description || transaction.description.trim() === '') {
        return false;
    }
    if (!transaction.amount || transaction.amount <= 0) {
        return false;
    }
    if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
        return false;
    }
    if (!transaction.category || transaction.category.trim() === '') {
        return false;
    }
    return true;
}
