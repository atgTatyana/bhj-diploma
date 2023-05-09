/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('В конструктор TransactionsPage передан пустой/несущ. элемент');
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions && this.lastOptions.account_id) {
      this.render({ account_id: this.lastOptions.account_id });
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccount = this.element.querySelector('.remove-account')
    const transactionRemove = this.element.querySelector('.content');

    removeAccount.addEventListener('click', () => {
      this.removeAccount();
    })

    // через всплытие события
    transactionRemove.addEventListener('click', (e) => {
      if (e.target.classList.contains('fa-trash') || e.target.classList.contains('transaction__remove')) {
        let id = e.target.closest('.transaction__remove').dataset.id;
        console.log('click = ', e.target, id);

        this.removeTransaction(id);
      }
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      let id = {
        id: this.lastOptions.account_id
      }
      let isRemove = confirm('Вы действительно хотите удалить счёт?');
      if (isRemove) {
        this.clear();
        Account.remove(id, (err, response) => {
          console.log('Account.remove = ', err, response);
          if (response && response.success) {
            App.updateWidgets();
            App.updateForms();
          }
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    let isRemove = confirm('Вы действительно хотите удалить эту транзакцию?');
    if (isRemove) {
      let transactionId = {
        account_id: this.lastOptions.account_id,
        id,
      }
      Transaction.remove(transactionId, (err, response) => {
        console.log('Transaction.remove = ', err, response);
        if (response && response.success) {
          App.update();
        }  
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (options) {
      this.lastOptions = options;
      Account.get(options.account_id, (err, response) => {
        console.log('renderName_Account.get = ', err, response);
        if (response && response.success) {
          this.renderTitle(response.data.name);

          Transaction.list(options, (err, response) => {
            console.log('renderTransactions_Transaction.list = ', err, response);
            this.renderTransactions(response.data);
          })
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const title = this.element.querySelector('.content-title');
    title.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    let newDate = date.slice(8, 10);
    switch (date.slice(5, 7)) {
      case '01':
        newDate += ' января ';
        break;
      case '02':
        newDate += ' февраля ';
        break;
      case '03':
        newDate += ' марта ';
        break;
      case '04':
        newDate += ' апреля ';
        break;
      case '05':
        newDate += ' мая ';
        break;
      case '06':
        newDate += ' июня ';
        break;
      case '07':
        newDate += ' июля ';
        break;
      case '08':
        newDate += ' августа ';
        break;            
      case '09':
        newDate += ' сентября ';
        break;
      case '10':
        newDate += ' октября ';
        break;
      case '11':
        newDate += ' ноября ';
        break;
      case '12':
        newDate += ' декабря ';
        break;    
    }
    newDate += `${date.slice(0, 4)} г. в ${date.slice(11, 16)}`;
    return newDate;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const transactionElement = document.createElement('div');
    transactionElement.classList.add('transaction', 'row');
    const elClass = item.type === 'income' ? 'transaction_income' : 'transaction_expense';
    transactionElement.classList.add(elClass);
    let date = this.formatDate(item.created_at);
    transactionElement.insertAdjacentHTML('afterbegin', 
     `<div class="col-md-7 transaction__details">
        <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${date}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
          ${item.sum}<span class="currency"> ₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id=${item.id}>
          <i class="fa fa-trash"></i>  
        </button>
      </div>`);
    return transactionElement;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = document.querySelector('.content');
    content.innerHTML = '';
    let renderedElement; 
    for (let i = 0; i < data.length; i++) {
      renderedElement = this.getTransactionHTML(data[i]);
      content.appendChild(renderedElement);
    }
  }
}