/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('В конструктор TransactionsWidget передан пустой/несущ. элемент');
    }
    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const incomeButton = document.querySelector('.create-income-button');
    const expenseButton = document.querySelector('.create-expense-button');

    incomeButton.addEventListener('click', () => {
      const newIncome = App.getModal('newIncome');
      newIncome.open();
    })

    expenseButton.addEventListener('click', () => {
      const newExpense = App.getModal('newExpense');
      newExpense.open();
    })
  }
}
