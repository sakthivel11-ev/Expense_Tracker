// ! Get elements from HTML

let form = document.querySelector("form")

let description = document.getElementById("dcrip")

let amount = document.getElementById("amount")

let category = document.getElementById("category")


let transactionTypeInputs = document.querySelectorAll("input[name='type']")


let addButton = form.querySelector("button");

//Target the balance,total of income , out and entry
let currentBalance = document.querySelector(".balance h2")

let totalIncome = document.querySelector(".card1 h2")

let totalOut = document.querySelector(".card2 h2")

let totalEntries = document.querySelector(".card3 h2")

// Target the list
let transationList = document.getElementById("transactionlist")

// !Target the income and expense buttons
let incomeButton = document.getElementById("inButton")

let expenseButton = document.getElementById("exButton")

// ! Get Transaction from LocalStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) ||[]

// ! Save Transactions to LocalStorage
function saveTransactions() {
    localStorage.setItem("transactions",JSON.stringify(transactions))
}

// ! get Selected transaction type

function getTransactionType (){
    let selected = document.querySelector('input[name=type]:checked');

    return selected ? selected.value : null;
}

// ! Calculation on the Summary(balance)
function updateSummary(){
    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {
        if (transaction.type == "income") {
            income += Number(transaction.amount);
        }
        else{
            expense +=Number(transaction.amount);
        }
    });

    let balance = income - expense;

    // current balance
    currentBalance.textContent =   "₹ " + balance.toFixed(2);
    //total income
    totalIncome.textContent = "₹ " + income.toFixed(2);
    //total expense
    totalOut.textContent = "₹ " + expense.toFixed(2);
    //total Entries
    totalEntries.textContent = transactions.length;

}

// ! Display the transactions
function displayTransactions(type = "all"){
    //Remove old transaction rows
    transationList.innerHTML="";

    // Create table/list headings
    let serialHeading = document.createElement("li");
    serialHeading.textContent = "S.no";

    let descriptionHeading = document.createElement("li");
    descriptionHeading.textContent = "Description";

    let categoryHeading = document.createElement("li");
    categoryHeading.textContent = "Category";

    let amountHeading = document.createElement("li");
    amountHeading.textContent = "Amount";

    // Add headings to list

    transationList.appendChild(serialHeading);
    transationList.appendChild(descriptionHeading);
    transationList.appendChild(categoryHeading);
    transationList.appendChild(amountHeading);

    // Filter transactions
    let filteredTransactions = transactions;

    if (type =="income") {
        filteredTransactions = transactions.filter((transaction)=>{
            return transaction.type == "income";
        })
    }

    if (type=="expense") {
        filteredTransactions = transactions.filter((transaction)=>{
            return transaction.type == "expense";
        })
    }

    // Display transactions

    filteredTransactions.forEach((transaction,index)=>{
        let serialNumber = document.createElement("li");
        serialNumber.textContent = index + 1;

        let description = document.createElement("li");
        description.textContent = transaction.description;

        let transactionCategory = document.createElement("li");
        transactionCategory.textContent = transaction.category;

        let transactionAmount = document.createElement("li");
        transactionAmount.textContent = "₹ " + Number(transaction.amount).toFixed(2);

// Add transaction to list

    transationList.appendChild(serialNumber);
    transationList.appendChild(description);
    transationList.appendChild(transactionCategory);
    transationList.appendChild(transactionAmount);

    })
}

// <----! ADD TRANSACTIONS---->

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    // Get the input value from html

    let descriptionValue = description.value.trim();
    let amountValue = Number(amount.value);
    let categoryValue = category.value.trim();
    let type = getTransactionType();

    // ! Validation
    if (descriptionValue == "") {
        alert("please enter Description!! ")
        return;
    }
    if (amountValue <=0 || isNaN(amountValue)) {
        alert("please enter a valid Amount!! ")
        return;
    }
    if (categoryValue == "") {
        alert("please select a Category!!")
        return;
    }
    if (type ==null) {
        alert("please select a Transaction type!! ")
        return
    }

    // ! Calculate current balance

    let income = 0;
    let expense = 0;

    transactions.forEach((transaction)=>{
        if (transaction.type == "income") {
            income +=Number(transaction.amount);
        }
        else{
            expense +=Number(transaction.amount);
        }
    })

    let balance = income - expense;

    // Check expense amount
    if (type == "expense" && amountValue > balance) {
        alert("Insuffient Balance")
        return;
    }
    
    // create transaction object
    let transaction={
        id : Date.now(),
        description : descriptionValue,
        amount : amountValue,
        category : categoryValue,
        type : type
    }

    // Add transaction to Array
    transactions.push(transaction);

    // Save transaction
    saveTransactions();

    // Update Summary
    updateSummary();

    // Display Transactions
    displayTransactions();

    // Clear Form
    form.reset();

    //keep expense selected after the reset
    document.querySelector("input[name='type'][value=expense]").checked=true;
})

// ! Income button

incomeButton.addEventListener("click", function () {
    displayTransactions("income");
});

// ! Expense button

expenseButton.addEventListener("click", function () {
    displayTransactions("expense");
});

// ! Initial display when page loads
updateSummary();

displayTransactions();

// localStorage.removeItem("transactions")

