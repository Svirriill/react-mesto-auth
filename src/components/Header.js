import React from 'react';
import logo from "../images/Vector.svg";

function Header() {
    // const [email, setEmail] = React.useState('');
    // const [sign, setSign] = React.useState('Войти');
    // const [login, setLogin] = React.useState(false);
    // const [loginLink, setLoginLink] = React.useState('/sign-in');
    // const history = useHistory();

    // const onSignOut = () => {
    //     localStorage.removeItem('token');
    //     setEmail('');
    //     history.push('/sign-in');
    // }

    // const onLogin = () => {
    //     let jwt = localStorage.getItem('token');
    //     if (jwt) {
    //         auth.getContent(jwt)
    //             .then((res) => {
    //                 if (res) {
    //                     setEmail(res.data.email);
    //                 }
    //             })
    //             .catch(err => console.log(err));
    //     }
    // }
    // React.useEffect(() => {
    //     onLogin();
    // }, [login]);

    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="лого" />
            {/* <BrowserRouter>
            <Switch>
                <Route>
                    <div className="header__container">
                        <p className="header__email">{email}</p>
                        {login ? <p onClick={onSignOut} className="header__out">Выйти</p> : <Link to={loginLink} className="header__out">{sign}</Link>}
                    </div>
                </Route>
            </Switch>
            </BrowserRouter> */}
        </header>
    );
}

export default Header;