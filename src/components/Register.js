import React from 'react'
import { Link } from 'react-router-dom';

const Register = (props) => {
const { onRegister } = props;

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('')

    const handleSubmit = (evt) => {
        evt.preventDefault();
        onRegister(password, email);
    }

    return (
        <form className="login" onSubmit={handleSubmit}>
            <h3 className="login__title">Регистрация</h3>
            <input
                className="login__field"
                type="text"
                name="email"
                minLength="6"
                placeholder="Email"
                value={email}
                onChange={evt => setEmail(evt.target.value)}
                required />
            <input
                className="login__field"
                type="password"
                name="password"
                placeholder="Password"
                minLength="6"
                value={password}
                onChange={evt => setPassword(evt.target.value)}
                required />
            <button className="login__button" type="submit">Зарегистрироваться</button>
            <Link className="login__link-href" to="/sign-in"> Уже зарегистрированы? Войти</Link>
            <Link className="login__link" to="/sign-in"> Войти</Link>
        </form>
    )
}

export default Register;
