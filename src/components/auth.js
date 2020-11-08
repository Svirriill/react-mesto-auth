export const BASE_URL = 'https://auth.nomoreparties.co';

export const register = (password, email) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, email })
    })
        .then(res => {
            if (!res.ok) {
                return Promise.reject({
                    status: 400,
                    message: 'Некорректно заполнено одно из полей'
                })
            }
            return res.json()
        })
        .then((res) => {
            return res;
        })
};

export const login = (password, email) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, email })
    })
        .then(res => {
            if (!res.ok) {
                if (res.status === 400) {
                    return Promise.reject({
                        status: 400,
                        message: 'Не передано одно из полей'
                    })
                } else if (res.status === 401) {
                    return Promise.reject({
                        status: 401,
                        message: 'Пользователь с таким email не найден'
                    })
                }
            }
            return res.json()
                .then((data) => {
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                        return data;
                    } else {
                        return;
                    }
                })
        })
};

export const getContent = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
        .then(res => {
            if (!res.ok) {
                return Promise.reject({
                    status: 401,
                    message: 'Токен не передан или передан не в том формате'
                }, {
                    status: 401,
                    message: 'Переданный токен некорректен'
                })
            }
            res.json()
        })
        .then(data => data)
};
