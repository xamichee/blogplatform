import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {logOut} from "../../Reducer/store.actions";
import userAvatar from '../../assets/user.png'

import './Header.scss';

const Header = ({user, logOut}) => {

  const headerAuth =
    <div className="header__auth auth">
      <div className="auth__sign-in auth__element">
        <Link to={'/sign-in'}>Sign In</Link>
      </div>
      <div className="auth__sign-up auth__element">
        <Link to={'/sign-up'}>Sign Up</Link>
      </div>
    </div>

  const headerUser =
    <div className='header__loggedin'>
      <div className="header__newpost">
        <Link to={'/new-article'}>Create article</Link>
      </div>
      <div className="header__user">
        <div className='header__username'>{user.username}</div>
        <div className='header__avatar'><img src={user.image || userAvatar} alt="user"/></div>
      </div>
      <div className="log-out">
        <button onClick={logOut} className="log-out__button">Log Out</button>
      </div>
    </div>

  console.log('user', user);

  return (
    <header className="header">
      <div className="header__title">
        <Link to={'/'}>
          <h6>Realworld Blog</h6>
        </Link>
      </div>
      {user.username ? headerUser : headerAuth}
    </header>
  );
};

const mapDispatchTOProps ={ logOut };

const mapStateToProps = ({user}) => ({
  user,
});

export default connect(mapStateToProps, mapDispatchTOProps)(Header);
