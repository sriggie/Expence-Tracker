document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const summary = document.getElementById('summary');

    // Retrieve expenses from localStorage or initialize empty array
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

        // Render summary
        summary.innerHTML = '';
        for (const category in summaryData) {
            const total = summaryData[category];
            const categoryElement = document.createElement('div');
            categoryElement.textContent = `${category}: $${total.toFixed(2)}`;
            summary.appendChild(categoryElement);
        }
    }

    // Function to render expenses list
    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td><button onclick="deleteExpense(${index})">Delete</button></td>
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

    // Currency converter functionality
    document.getElementById('convert').addEventListener('click', async () => {
        const amount = document.getElementById('currency-amount').value;
        const fromCurrency = document.getElementById('from-currency').value;
        const toCurrency = document.getElementById('to-currency').value;

        if (fromCurrency === toCurrency) {
            document.getElementById('converted-amount').textContent = `${amount} ${fromCurrency}`;
            return;
        }

        const convertedAmount = await convertCurrency(amount, fromCurrency, toCurrency);
        document.getElementById('converted-amount').textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    });

    // Function to convert currency
    async function convertCurrency(amount, fromCurrency, toCurrency) {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();
        const exchangeRate = data.rates[toCurrency];
        return amount * exchangeRate;
    }

    // Initial rendering
    renderExpenses();
    calculateSummary();
});
