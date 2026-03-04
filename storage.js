import { STORAGE_KEY } from './constants.js';

/**
 * Storage module for managing transactions in localStorage
 */

/**
 * Get all transactions from localStorage
 * @returns {Array} Array of transactions
 */
export function getTransactions() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
}

/**
 * Save transactions to localStorage
 * @param {Array} transactions - Array of transactions to save
 */
export function saveTransactions(transactions) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Add a new transaction
 * @param {Object} transaction - Transaction object to add
 * @returns {Array} Updated transactions array
 */
export function addTransaction(transaction) {
    const transactions = getTransactions();
    transactions.push(transaction);
    saveTransactions(transactions);
    return transactions;
}

/**
 * Delete a transaction by ID
 * @param {string} id - Transaction ID to delete
 * @returns {Array} Updated transactions array
 */
export function deleteTransaction(id) {
    const transactions = getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    saveTransactions(filtered);
    return filtered;
}

/**
 * Clear all transactions
 */
export function clearAllTransactions() {
    saveTransactions([]);
}

/**
 * Get filtered transactions
 * @param {string} type - Filter type ('all', 'income', 'expense')
 * @returns {Array} Filtered transactions
 */
export function getFilteredTransactions(type) {
    const transactions = getTransactions();
    if (type === 'all') {
        return transactions;
    }
    return transactions.filter(t => t.type === type);
}
