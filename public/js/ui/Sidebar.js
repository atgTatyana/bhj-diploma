/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarMini = document.querySelector('.sidebar-mini');
    
    sidebarToggle.addEventListener('click', () => {
      sidebarMini.classList.toggle('sidebar-open');
      sidebarMini.classList.toggle('sidebar-collapse');
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const loginButton = document.querySelector('.menu-item_login');
    const registerButton = document.querySelector('.menu-item_register');
    const logoutButton = document.querySelector('.menu-item_logout');

    loginButton.addEventListener('click', () => {
      // возвращает созданный в App.initModal() sэкземпляр класса Modal (всплывающего окна):
      const loginModal = App.getModal('login');
      console.log('open_loginModal = ', loginModal);     // {element: div#modal-login.modal.fade.in}
      loginModal.open();
    })

    registerButton.addEventListener('click', () => {
      const registerModal = App.getModal('register');
      console.log('open_registerModal = ', registerModal);     // {element: div#modal-register.modal.fade.in}
      registerModal.open();
    })

    logoutButton.addEventListener('click', () => {
      User.logout((err, response) => {
        console.log('Sidebar_logout = ', err, response);
        if (response && response.success) {
          App.setState('init');
        }
      });
    })
  }
}