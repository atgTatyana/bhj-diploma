/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = '/user';

  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * const user = {
   *    id: 12,
   *    name: 'Vlad'
   * };
   * */
  static setCurrent(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('userCurrent = ', user);   // null - если нет
    return user;
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    console.log({
      url: this.URL + '/current',
      method: 'GET',
      callback: (err, response) => {
        callback(err, response);
      }  
    });
    createRequest({
      url: this.URL + '/current',
      method: 'GET',
      callback: (err, response) => {
        console.log('User.fetch current = ', err, response);
        if (response && response.success) {
          this.setCurrent(response.user);
        } else {
          this.unsetCurrent();
        }
        callback(err, response);
      },
    });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        console.log('login = ', response);
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    createRequest({
      url: this.URL + '/register',
      method: 'POST',
      data,
      callback: (err, response) => {
        console.log('register = ', response);
        if (response && response.success) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    createRequest({
      url: this.URL + '/logout',
      method: 'POST',
      // ответ сервера вернется в колбек-функцию для его обработки:
      callback: (err, response) => {
        console.log('logout = ', response);
        if (response && response.success) {
          this.unsetCurrent();
        }
        callback(err, response);
      }
    });
  }
}
