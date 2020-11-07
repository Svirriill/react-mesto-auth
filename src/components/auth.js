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
                return Promise.reject(`${res.status}`)
                    .then((res) => {
                        if (res.status === 400) {
                            console.log('Некорректно заполнено одно из полей');
                        }
                    })
            }
            return res.json()
        })
        .then((data) => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                return data;
            } else {
                return;
            }
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
            return res.json()
                .then((res) => {
                    if (res.status === 400) {
                        console.log('Не передано одно из полей');
                    }
                    else if (res.status === 401) {
                        console.log('Пользователь с таким email не найден');
                    }
                })
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
            .then(res => res.json())
            .then(data => data)
    };
