/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, response) => {
      console.log('Form Account_create = ', err, response);
      
      if (response && response.success) {
        this.element.reset();     // в this.element находится открытая форма
        const accountModal = App.getModal('createAccount');
        accountModal.close();
        App.update();
      }
    });
  }
}