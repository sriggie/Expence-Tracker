document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const summary = document.getElementById('summary');
    const expenseChart = document.getElementById('expense-chart').getContext('2d');

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

        // Render chart
        renderChart(summaryData);
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

    // Function to render chart
    function renderChart(data) {
        const labels = Object.keys(data);
        const values = Object.values(data);
        new Chart(expenseChart, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Expenses by Category',
                    data: values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderExpenses();
    calculateSummary();
});
