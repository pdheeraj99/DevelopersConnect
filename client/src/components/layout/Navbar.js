import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../actions/auth';

const Navbar = () => {
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
  };

  const loginLinks = (
    <ul>
      <li>
        <a href='!#'>Developers</a>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  const logoutLinks = (
    <ul>
      <li>
        <Link to='/' onClick={logoutHandler}>
          <i className='fas fa-sign-out-alt'></i> Logout
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> DevConnector
        </Link>
      </h1>
      {!loading &&
        (isAuthenticated ? (
          <Fragment>{logoutLinks}</Fragment>
        ) : (
          <Fragment>{loginLinks}</Fragment>
        ))}
    </nav>
  );
};

export default Navbar;
