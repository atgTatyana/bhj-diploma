/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static URL = '/account';
  /**
   * Получает информацию о счёте
   * id задаёт идентификатор записи, пример получения определённого счёта: /account/2
   * */
  static get(id = '', callback){
    let urlId = this.URL + '/' + id;
    console.log({
      url: urlId,
      method: 'GET',
      callback,
    });
    createRequest({
      url: urlId,
      method: 'GET',
      callback,
    });
  }
}
