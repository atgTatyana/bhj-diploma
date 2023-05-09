/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент ul.sidebar-menu.accounts-panel не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('В конструктор AccountsWidget передан пустой/несущ. элемент');
    }
    this.element = element;

    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccount = this.element.querySelector('.create-account');
    createAccount.addEventListener('click', () => {
      const createAccountModal = App.getModal('createAccount');
      createAccountModal.open();
    })
    
    // через всплытие события
    this.element.addEventListener('click', (e) => {
      if (!e.target.classList.contains('header') && 
          !e.target.classList.contains('create-account') &&
          !e.target.classList.contains('fa-plus')) {

        let account = e.target.closest('.account');
        console.log('click account = ', account);
        this.onSelectAccount(account);
      }
    })
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const user = User.current();
    console.log('update_account user = ', user);
    if (user) {
      Account.list(user, (err, response) => {
        console.log('Account_list = ', err, response);
        if (response && response.success) {
          this.clear();
          this.renderItem(response.data);
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = this.element.querySelectorAll('.account');
    accounts.forEach(elem => elem.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const accounts = this.element.querySelectorAll('.account');
    accounts.forEach(elem => elem.classList.remove('active'));

    element.classList.add('active');
    let id = element.dataset.id;
    App.showPage( 'transactions', {account_id: id});
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    let accountElement = document.createElement('li');
    accountElement.classList.add('account');
    accountElement.dataset.id = item.id;
    accountElement.insertAdjacentHTML("afterbegin",
     `<a href="#">
        <span>${item.name}</span>
        <span>${item.sum} ₽</span>
      </a>`);
    return accountElement;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    for (let i = 0; i < data.length; i++) {
      let accountElement = this.getAccountHTML(data[i]);
      this.element.appendChild(accountElement);
    }
  }
}
