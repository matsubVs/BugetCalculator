'use strict';

const isNumber = function (num) {
    return !isNaN(Number(num)) && !isNaN(parseFloat(num)) && isFinite(parseFloat(num));
};

const calcStartButton = document.getElementById('start');
const calcClearButton = document.getElementById('cancel');

const plusButtonIncome = document.getElementsByTagName('button')[0];
const plusButtonExpenses= document.getElementsByTagName('button')[1];

const depositCheckBox = document.querySelector('#deposit-check');
const additionalIncome = document.querySelectorAll('.additional_income-item');

const budgetMonthValue = document.getElementsByClassName('budget_month-value')[0];
const budgetDayValue = document.getElementsByClassName('budget_day-value')[0];
const expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0];
const additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0];
const additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0];
const incomePeriodValue = document.getElementsByClassName('income_period-value')[0];
const targetMonthValue = document.getElementsByClassName('target_month-value')[0];
const depositBank = document.querySelector('.deposit-bank');
const depositAmount = document.querySelector('.deposit-amount');
const depositPercent = document.querySelector('.deposit-percent');

const resultInputs = [budgetMonthValue, budgetDayValue, expensesMonthValue, 
    additionalIncomeValue, additionalExpensesValue, incomePeriodValue,
    targetMonthValue]

let salaryElement = document.querySelector('.salary-amount');

let calcPeriod = document.querySelector('.salary-amount');

let incomeTitleElement = document.querySelector('.income-title');
let incomeItems = document.querySelectorAll('.income-items');

let additionalIncomeElement = document.querySelectorAll('.additional_income-item');

let expensesTitleElement = document.querySelector('.expenses-title');
let expensesItems = document.querySelectorAll('.expenses-items');
let additionalExpensesElement = document.querySelector('.additional_expenses-item');

let depositCheckElement = document.querySelector('.deposit-check');
let depositAmountElement = document.querySelector('.deposit-amount');
let depositPercentElement = document.querySelector('.deposit-percent');

let targetElement = document.querySelector('.target-amount');
let periodSelect = document.querySelector('.period-select');
let periodAmount = document.querySelector('.period-amount');

let placeholderSum = document.querySelectorAll('[placeholder="Сумма"]');
let placeholderName = document.querySelectorAll('[placeholder="Наименование"]');


class AppData {
    constructor () {
        this.budget = 0;
        this.income = {};
        this.addIncome = [];
        this.incomeMonth = 0;
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false;
        this.percentDeposit = 0;
        this.moneyDeposit = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expensesMonth = 0;
    }

    start() {
        salaryElement = document.querySelector('.salary-amount');
        if (salaryElement == '' || salaryElement.value == '') {
            return;
        };
    
        this.budget = +salaryElement.value;
        
        this.getAddExpencesIncome(additionalExpensesElement, additionalIncomeElement)
        this.getExpInc();
        this.getExpensesMonth();
        this.getInfoDeposit();
        this.getBudget();    
    
        this.showResult();

        this.saveStorage();
        this.disableFields();
    }
    
    reset() {
        salaryElement = '';
        additionalExpensesValue.value = '';
        targetElement.value = '';
        periodSelect.value = '1';
        periodAmount.textContent = '1';
    
        calcStartButton.style.display="block";
        calcClearButton.style.display="none";
    
        plusButtonExpenses.style.display = "block";
        plusButtonIncome.style.display = "block";

        plusButtonIncome.disabled = false;
        plusButtonExpenses.disabled = false;
    
        const income = document.querySelectorAll('.income-items')
        income.forEach((item, index) => {
            if (index !== 0) item.remove();
        })
    
        const expenses = document.querySelectorAll('.expenses-items')
        expenses.forEach((item, index) => {
            if (index !== 0) item.remove();
        })
    
    
        const main = document.querySelectorAll('.data input');
        const result = document.querySelectorAll('.result input');
    
        main.forEach((item) => {
            if (item.type == "range") {
                item.disabled = false;
                return;
            }
            item.style.backgroundColor = "white";
            item.style.opacity = 1;
            item.disabled = false;
            item.value = '';
        });
    
        result.forEach((item) => {
            if (item.placeholder == '0') item.value = '0';
    
            if (item.placeholder == "Наименования") item.value = "Наименования";
    
            if (item.placeholder == "Срок") item.value = "Срок";
        });
    
        this.budget = 0;
        this.income = {};
        this.addIncome = [];
        this.incomeMonth = 0;
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false;
        this.percentDeposit = 0;
        this.moneyDeposit = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expensesMonth = 0;

        depositCheckBox.checked = false;

        this.resetStorage();
    }

    saveStorage() {
        resultInputs.forEach(item => {
            localStorage.setItem(item.classList[1], item.value);
            document.cookie = `${item.classList[1].trim()}=${item.value}`
        })

        document.cookie = 'isLoad=true'

        console.log(localStorage);
        console.log(document.cookie);

    }

    renderStorage() {
        let checkFlag = true;
        if (localStorage.length != 0) {
            resultInputs.forEach(item => {
            let storageValue = localStorage.getItem(item.classList[1])
            item.value = storageValue;
            if (!this.checkStorage()) {
                this.resetStorage();
                this.reset();
                checkFlag = false;
                return;
            }
        })
        if (checkFlag) this.disableFields();
        }
    }

    resetStorage() {
        localStorage.clear();
        let cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            let eqPos = cookie.indexOf("=");
            let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    checkStorage() {
        let cookies = document.cookie.split(";");
        for(let i = 0; i < cookies.length; i++) {
            cookies[i] = cookies[i].split("=");
        };
        cookies = cookies.splice(0, cookies.length - 1);
        cookies.forEach(item => item[0] = item[0].trim())
        
        let localStorageData = []
        for(let key = 0; key < Object.keys(localStorage).length; key++) {
            localStorageData.push([Object.keys(localStorage)[key], localStorage.getItem(Object.keys(localStorage)[key])])
        }

        localStorageData.sort();
        cookies.sort();
        let flag = true;
        for (let i = 0; i < cookies.length; i++) {
            if (cookies[i][0] == localStorageData[i][0]) {
                continue;
            } else {
                flag = false;
                break;
            }
        }

        return flag;
    }
    
    disableFields() {
        calcStartButton.style.display="none";
        calcClearButton.style.display="block";
        const main = document.querySelectorAll('.data input');
        main.forEach((item) => {
            if (item.type == "range") {
                item.disabled = false;
                return;
            }
            item.style.backgroundColor = "#cdd0da";
            item.style.opacity = 0.9;
            item.disabled = true;
        });

        plusButtonExpenses.disabled = true;
        plusButtonIncome.disabled = true;
    }
    
    showResult() {
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = Math.ceil(this.budgetDay);
        expensesMonthValue.value = this.expensesMonth;
        targetMonthValue.value = this.getTargetMonth();
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        incomePeriodValue.value = this.calcPeriod();    
    }

    addBlock(block, button) {
        const cloneBlock = block[0].cloneNode(true);
        let blockItems;

        if (block == expensesItems) {
            blockItems = document.querySelectorAll('.expenses-items');
        } else if (block == incomeItems) {
            blockItems = document.querySelectorAll('.income-items');
        }
    
        cloneBlock.children[0].value = '';
        cloneBlock.children[1].value = '';
    
        blockItems[0].parentNode.insertBefore(cloneBlock, button);
    
        if (blockItems.length === 2) {
            button.style.display = 'none'
        }
    
        placeholderSum = document.querySelectorAll('[placeholder="Сумма"]')
        placeholderName = document.querySelectorAll('[placeholder="Наименование"]')
    
        placeholderSum.forEach((elem) => {
            elem.addEventListener('input', ()=> elem.value = elem.value.replace(/[^\d]/g, ''));
        });
        
        placeholderName.forEach((elem) => {
            elem.addEventListener('input', ()=> elem.value = elem.value.replace(/[^а-яё\s\.\,\;\:]/gi, ''));
        });
    }
    
    getAddExpencesIncome(addExpenses, addIncome) {
        let elementsArray = []
        addExpenses = addExpenses.value.split(',');
        elementsArray.push(addExpenses);
        elementsArray.push(addIncome);

        const checkItem = function (item) {
            if (item !== '') {
                return true;
            } else {
                return false;
            }
        }

        for (let i = 0; i < elementsArray.length; i++) {
            elementsArray[i].forEach((item) => {
            if (typeof item == 'object') {
                item = item.value;
                item.trim();
                if (item !== '') {
                    this.addExpenses.push(item);
                }
            } else {
                item = item.trim()
                if (checkItem(item)) {
                    this.addIncome.push(item);
                }
                }
            })
        }
    }

    getExpInc() {
        incomeItems = document.querySelectorAll('.income-items');
        expensesItems = document.querySelectorAll('.expenses-items');
        const count = (item) => {
            const startStr = item.className.split('-')[0];
            const itemTitle = item.querySelector(`.${startStr}-title`).value;
            const itemAmount = item.querySelector(`.${startStr}-amount`).value;

            if (itemTitle !== '' && itemAmount !== '') {
                this[startStr][itemTitle] = +itemAmount;
                console.log(this.income);
                console.log(this.expenses);
            }
        }

        incomeItems.forEach(count);
        expensesItems.forEach(count);

        for (let key in this.income) {
            this.incomeMonth += +this.income[key];
        }
    }
    
    getExpensesMonth() {
        let sum = 0;
        
        for (let key in this.expenses) {
            console.log(this.expenses[key]);
            sum += +this.expenses[key];
        }
    
        this.expensesMonth = sum;
    }
    
    getBudget() {
        const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
        this.budgetMonth = this.budget + +this.incomeMonth - this.expensesMonth + monthDeposit;
        this.budgetDay = +this.budgetMonth / 30;
    }
    
    getTargetMonth() {
        return Math.ceil(targetElement.value / this.budgetMonth);
    }
    
    getStatusIncome() {
        if (this.budgetDay >= 1200) {
        console.log("У вас высокий уровень дохода");
        } else if (this.budgetDay < 1200 && this.budgetDay >= 600){
            console.log("У вас средний уровень дохода");
        } else if (this.budgetDay < 600 && this.budgetDay >= 0) {
            console.log("К сожалению у вас уровень дохода ниже среднего");
        };
    }
    
    changePeriodValue() {
        periodAmount.textContent = periodSelect.value;
        incomePeriodValue.value = this.calcPeriod();    
    }
    
    calcPeriod() {
        return this.budgetMonth * periodSelect.value;
    }

    getInfoDeposit() {
        if (this.deposit) {
            this.percentDeposit = +depositPercent.value;
            this.moneyDeposit = +depositAmount.value;
        }
    }

    changePercent() {
        const selectValue = this.value;
        if (selectValue === 'other') {
            depositPercent.disabled = false;
            depositPercent.style.display = 'inline-block';
            depositPercent.addEventListener('input', (event)=> {
                if (event.target.value < 0 || event.target.value > 100) {
                    alert('Введите корректное значение в поле проценты');
                    event.target.value = 0;
                }
                event.target.value = event.target.value.replace(/[^\d]/g, '')
            })
            this.depositPercent = +depositPercent.value;
        } else {
            depositPercent.style.display = 'inline-block';
            depositPercent.disabled = true;
            depositPercent.value = selectValue;
            depositPercent.removeEventListener('input', (event)=> event.target.value = event.target.value.replace(/[^\d]/g, ''))
        }
    }

    depositHandler() {
        if (depositCheckBox.checked) {
            depositBank.style.display = 'inline-block';
            depositAmount.style.display = 'inline-block';    
            this.deposit = true;
            console.log(this);
            depositBank.addEventListener('change', this.changePercent);        
        } else {
            depositBank.style.display = 'none';
            depositAmount.style.display = 'none';  
            depositBank.value = '0';
            depositAmount.value = '';  
            this.deposit = false;
            depositBank.removeEventListener('change', this.changePercent)   
        }
    }
    
    eventListeners() {
        placeholderSum.forEach(function (elem) {
            elem.addEventListener('input', ()=> elem.value = elem.value.replace(/[^\d]/g, ''));
        });
        
        placeholderName.forEach(function (elem) {
            elem.addEventListener('input', ()=> elem.value = elem.value.replace(/[^а-яё\s\.\,\;\:]/gi, ''));
        });
        
        calcStartButton.addEventListener('click', this.start.bind(this));
        calcClearButton.addEventListener('click', this.reset.bind(this));
        plusButtonExpenses.addEventListener('click', () => this.addBlock(expensesItems, plusButtonExpenses));
        plusButtonIncome.addEventListener('click', () => this.addBlock(incomeItems, plusButtonIncome));
        periodSelect.addEventListener('input', this.changePeriodValue.bind(this));

        // console.log(this);
        depositCheckBox.addEventListener('change', this.depositHandler.bind(this));
    }
};

const appData = new AppData();
appData.eventListeners();
appData.renderStorage();