import { CATEGORIES, TRANSACTION_TYPES } from './constants.js';
import { generateId, validateTransaction } from './utils.js';
import { 
    getTransactions, 
    addTransaction, 
    deleteTransaction, 
    clearAllTransactions,
    getFilteredTransactions 
} from './storage.js';
import { 
    updateSummary, 
    renderTransactions, 
    showNotification,
    updateCategoryOptions,
    resetForm,
    confirmAction
} from './UI.js';

/**
 * Budget Tracker Application
 * Main application logic
 */

class BudgetTracker {
    constructor() {
        this.transactions = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        // Load initial data
        this.loadTransactions();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize UI
        this.updateUI();
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('transaction-form');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Transaction type change
        const typeSelect = document.getElementById('type');
        typeSelect.addEventListener('change', (e) => {
            updateCategoryOptions(e.target.value, CATEGORIES);
        });

        // Filter change
        const filterSelect = document.getElementById('filter-type');
        filterSelect.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.updateUI();
        });

        // Clear all button
        const clearAllBtn = document.getElementById('clear-all');
        clearAllBtn.addEventListener('click', () => this.handleClearAll());

        // Transaction list (event delegation for delete buttons)
        const transactionsList = document.getElementById('transactions-list');
        transactionsList.addEventListener('click', (e) => {
            if (e.target.closest('.btn-delete')) {
                const id = e.target.closest('.btn-delete').dataset.id;
                this.handleDelete(id);
            }
        });

        // Initialize category options
        updateCategoryOptions('income', CATEGORIES);
    }

    loadTransactions() {
        this.transactions = getTransactions();
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;

        const transaction = {
            id: generateId(),
            description,
            amount,
            type,
            category,
            date: new Date().toISOString()
        };

        if (!validateTransaction(transaction)) {
            showNotification('Please fill in all fields correctly', 'error');
            return;
        }

        this.transactions = addTransaction(transaction);
        this.updateUI();
        resetForm();
        showNotification(`${type === TRANSACTION_TYPES.INCOME ? 'Income' : 'Expense'} added successfully!`, 'success');
    }

    handleDelete(id) {
        if (confirmAction('Are you sure you want to delete this transaction?')) {
            this.transactions = deleteTransaction(id);
            this.updateUI();
            showNotification('Transaction deleted', 'info');
        }
    }

    handleClearAll() {
        if (this.transactions.length === 0) {
            showNotification('No transactions to clear', 'info');
            return;
        }

        if (confirmAction('Are you sure you want to delete all transactions? This action cannot be undone.')) {
            clearAllTransactions();
            this.transactions = [];
            this.updateUI();
            showNotification('All transactions cleared', 'info');
        }
    }

    updateUI() {
        const filteredTransactions = getFilteredTransactions(this.currentFilter);
        updateSummary(this.transactions);
        renderTransactions(filteredTransactions);
    }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BudgetTracker());
} else {
    new BudgetTracker();
}
