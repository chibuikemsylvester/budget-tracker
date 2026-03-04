import { formatCurrency, formatDate } from './utils.js';
import { TRANSACTION_TYPES } from './constants.js';

/**
 * UI module for managing DOM updates
 */

/**
 * Update summary cards with totals
 * @param {Array} transactions - Array of transactions
 */
export function updateSummary(transactions) {
    const income = transactions
        .filter(t => t.type === TRANSACTION_TYPES.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
        .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;

    document.getElementById('total-income').textContent = formatCurrency(income);
    document.getElementById('total-expenses').textContent = formatCurrency(expenses);
    
    const balanceElement = document.getElementById('balance');
    balanceElement.textContent = formatCurrency(balance);
    
    // Update balance card styling based on positive/negative balance
    const balanceCard = document.querySelector('.balance-card');
    balanceCard.classList.remove('positive', 'negative');
    if (balance > 0) {
        balanceCard.classList.add('positive');
    } else if (balance < 0) {
        balanceCard.classList.add('negative');
    }
}

/**
 * Render transactions list
 * @param {Array} transactions - Array of transactions to render
 */
export function renderTransactions(transactions) {
    const container = document.getElementById('transactions-list');
    
    if (transactions.length === 0) {
        container.innerHTML = '<p class="empty-state">No transactions yet. Add your first transaction above!</p>';
        return;
    }

    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );

    container.innerHTML = sortedTransactions.map(transaction => `
        <div class="transaction-item ${transaction.type}" data-id="${transaction.id}">
            <div class="transaction-details">
                <div class="transaction-header">
                    <span class="transaction-description">${transaction.description}</span>
                    <span class="transaction-amount ${transaction.type}">
                        ${transaction.type === TRANSACTION_TYPES.INCOME ? '+' : '-'}${formatCurrency(transaction.amount)}
                    </span>
                </div>
                <div class="transaction-meta">
                    <span class="transaction-category">${transaction.category}</span>
                    <span class="transaction-date">${formatDate(transaction.date)}</span>
                </div>
            </div>
            <button class="btn-delete" data-id="${transaction.id}" aria-label="Delete transaction">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    `).join('');
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success', 'error', 'info')
 */
export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger reflow for animation
    notification.offsetHeight;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Update category options based on transaction type
 * @param {string} type - Transaction type ('income' or 'expense')
 * @param {Array} categories - Array of category options
 */
export function updateCategoryOptions(type, categories) {
    const categorySelect = document.getElementById('category');
    const options = categories[type];
    
    categorySelect.innerHTML = '<option value="">Select category</option>' +
        options.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

/**
 * Reset form
 */
export function resetForm() {
    document.getElementById('transaction-form').reset();
}

/**
 * Show confirmation dialog
 * @param {string} message - Message to display
 * @returns {boolean} True if confirmed
 */
export function confirmAction(message) {
    return confirm(message);
}
