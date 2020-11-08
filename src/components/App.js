import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { api } from '../utils/api.js';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import ConfirmDelete from './ConfirmDelete';
import ImagePopup from './ImagePopup';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import * as auth from './auth';

function App() {
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = React.useState(false);
  const [cardToDelete, setCardToDelete] = React.useState({});
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isInfoTooltipPopupOpen, setIsOpenPopupInfoTooltip] = React.useState(false);
  const [isLoading, setLoading] = React.useState();
  const [selectedCard, setSelectedCard] = React.useState({
    isImageOpen: false,
    link: '',
    name: '',
  });
  const [loggedIn, setLoggedIn] = React.useState(false);

  const history = useHistory();

  function handleInfoTooltip(login) {
    login ? setLoggedIn(true) : setLoggedIn(false);
    setIsOpenPopupInfoTooltip(true);
  }

  React.useEffect(() => {
    Promise.all([api.getInitialCards(), api.getUserInfo()])
      .then((res) => {
        setCurrentUser(res[1]);
        setCards(res[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => console.log(err));
  }

  function handleConfirm() {
    api
      .deleteCard(cardToDelete._id)
      .then(() => {
        setCards(cards.filter((item) => item !== cardToDelete));
        closeAllPopups();
      }
      )
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    setConfirmPopupOpen(true);
    setCardToDelete(card);
  }


  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    const { link, name } = card;
    setSelectedCard({ isImageOpen: true, link: link, name: name });
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setAddPlacePopupOpen(false);
    setConfirmPopupOpen(false);
    setIsOpenPopupInfoTooltip(false);
    setSelectedCard({
      isImageOpen: false,
      link: '',
      name: '',
    });
  }

  function handleUpdateUser(userData) {
    setLoading(true);
    api
      .patchUserInfo(userData)
      .then((newUser) => {
        setCurrentUser(newUser);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }

  function handleUpdateAvatar(avatar) {
    setLoading(true);
    api
      .patchAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }

  function handleAddPlace(card) {
    setLoading(true);
    api
      .postCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }

  const handleRegister = (password, email) => {
    auth
      .register(password, email)
      .then((res) => {
        history.push('/sign-in');
        handleInfoTooltip(true);
      })
      .catch((err) => {
        handleInfoTooltip(false);
        console.log(err);
      });
  }

  const handleLogin = (password, email) => {
    auth
      .login(password, email)
      .then((data) => {
        if (data.token) {
          setLoggedIn(true);
          handleInfoTooltip(true);
          history.push('/');
        }
      })
      .catch((err) => {
        handleInfoTooltip(false);
        console.log(err);
      })
  }

  const tokenCheck = () => {
    const jwt = localStorage.getItem('token');
    if (jwt) {
      auth.getContent(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            history.push('/');
          }
        })
        .catch(err => {
          handleInfoTooltip(false);
          console.log(err);
        });
}
  }

React.useEffect(() => {
  tokenCheck();
}, []);

return (
  <div className="page">
    <CurrentUserContext.Provider value={currentUser}>
      <Header />
      <Switch>
        <ProtectedRoute
          exact path="/"
          loggedIn={loggedIn}>
          <Main
            cards={cards}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            handleCardClick={handleCardClick}
          />
          <Footer />
        </ProtectedRoute>
        <Route path="/sign-up">
          <Register onRegister={handleRegister} />
        </Route>
        <Route path="/sign-in">
          <Login onLogin={handleLogin} />
        </Route>
        <Route>
          {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
        </Route>
      </Switch>
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isLoading={isLoading}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlace}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isLoading={isLoading}
      />
      <ConfirmDelete
        isOpen={isConfirmPopupOpen}
        onClose={closeAllPopups}
        onConfirmDelete={handleConfirm}
      />
      <ImagePopup
        name={selectedCard.name}
        link={selectedCard.link}
        onClose={closeAllPopups}
        isOpen={selectedCard.isImageOpen}
      />
      <InfoTooltip
        isOpen={isInfoTooltipPopupOpen}
        onClose={closeAllPopups}
        loggedIn={loggedIn}
      />
    </CurrentUserContext.Provider >
  </div>
);
}

export default App;
