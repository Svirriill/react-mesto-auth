export const BASE_URL = 'https://api.nomoreparties.co';

export const register = (password, email) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, email })
    })
        .then((res) => {
                return res.json()
        })
        .then((res) => {
            return res;
        })
        .catch((err) => console.log(err));
};

export const login = (password, email) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, email })
    })
        .then((res => {
            if (res.status === 400) {
                res.send({ message: '400 - не передано одно из полей' });
            }
            if (res.status === 401) {
                res.send({ message: '401 - Данные переданы с ошибкой или не полностью' });
            }
            return res.json();
        })
        )
        .then((data) => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                return data;
            } else {
                return;
            }
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
        .then(res => res.json())
        .then(data => data)
}
