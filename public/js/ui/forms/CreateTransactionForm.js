/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const user = User.current();
    console.log('renderSelect user = ', user);

    if (user) {
      Account.list(user, (err, response) => {
        console.log('select_AccountList = ', err, response);

        if (response && response.success) {
          const incomeAccountsList = document.getElementById('income-accounts-list');
          const expenseAccountsList = document.getElementById('expense-accounts-list');
          incomeAccountsList.innerHTML = '';
          expenseAccountsList.innerHTML = '';

          const options = response.data.map(el => el.name);
          const value = response.data.map(el => el.id);
          options.forEach((element, index) => {
            incomeAccountsList[index] = new Option(element, value[index]);
            expenseAccountsList[index] = new Option(element, value[index]);
          })
        }
      });
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      console.log('Form Transaction_create = ', err, response);
      
      if (response && response.success) {
        this.element.reset();     // в this.element находится открытая форма
        const modalId = this.element.closest('.modal').dataset.modalId;
        const transactionModal = App.getModal(modalId);
        transactionModal.close();
        App.update();
      }
    });
  }
}