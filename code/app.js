document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const summary = document.getElementById('summary');

    // fuction for the var to collect io stuff from the local storage you can change it 
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Function to calculate total expenses by category
    function calculateSummary() {
        const summaryData = {};
        expenses.forEach(expense => {
            if (!summaryData[expense.category]) {
                summaryData[expense.category] = 0;
            }
            summaryData[expense.category] += expense.amount;
        });

        // render summary
        summary.innerHTML = '';
        for (const category in summaryData) {
            const total = summaryData[category];
            const categoryElement = document.createElement('div');
            categoryElement.textContent = `${category}: $${total.toFixed(2)}`;
            summary.appendChild(categoryElement);
        }
    }

    // function ya ku render the expences & list them
    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const row = document.createElement('div');
            row.innerHTML = `
                <span>${expense.name}</span>
                <span>$${expense.amount.toFixed(2)}</span>
                <span>${expense.category}</span>
                <button onclick="deleteExpense(${index})">Delete</button>
            `;
            expenseList.appendChild(row);
        });
    }

    // Function to add new expense
    function addExpense(name, amount, category) {
        const expense = { name, amount, category };
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
        calculateSummary();
    }

    // Event listener for form submission
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const expenseName = document.getElementById('expense-name').value;
        const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
        const expenseCategory = document.getElementById('expense-category').value;
        addExpense(expenseName, expenseAmount, expenseCategory);
        expenseForm.reset();
    });

    // Function to delete expense
    window.deleteExpense = function(index) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
        calculateSummary();
    };

    // Initial rendering
    renderExpenses();
    calculateSummary();
});
