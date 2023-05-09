/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
	const xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	let url = options.url;
	const formData = new FormData();
	
	// если data в options нет, то options.data будет undefined
	if (options.method === 'GET' && options.data) {
		url += '?';
		for (let property in options.data) {
			url += property + '=' + options.data[property] + '&';
		}
		url = url.slice(0, url.length - 1);
		console.log('url = ', url);
		
	} else if (options.method !== 'GET') {
		for (let property in options.data) {
			formData.append(property, options.data[property]);
		}
	}

	try {
		xhr.open(options.method, url);
		if (options.method === 'GET') {
			xhr.send();
		} else {
			xhr.send(formData);
		}	
	} catch (error) {
		// перехват сетевой ошибки:
		options.callback(error);
	}
	
	xhr.addEventListener('load', () => {
		console.log('serverResponse = ', xhr.response.error, xhr.response);
		options.callback(xhr.response.error, xhr.response);
	})
};

// ответ {"success":false,"user":null,"error":"Пользователь не авторизован"}
// ответ {success: true, data: Array(1)}