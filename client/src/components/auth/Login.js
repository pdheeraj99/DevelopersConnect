import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../../actions/auth';

const Login = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = loginData;

  const loginHandler = (event) => {
    event.preventDefault();
    dispatch(login({ email, password }));
  };

  if (authState.isAuthenticated) {
    return <Redirect to='dashboard' />;
  }

  return (
    <Fragment>
      <section className='container'>
        {/* <div className='alert alert-danger'>Invalid credentials</div> */}
        <h1 className='large text-primary'>Sign In</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Sign into Your Account
        </p>
        <form className='form' onSubmit={loginHandler}>
          <div className='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              value={email}
              onChange={(e) =>
                setLoginData({ ...loginData, [e.target.name]: e.target.value })
              }
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              value={password}
              onChange={(e) =>
                setLoginData({ ...loginData, [e.target.name]: e.target.value })
              }
            />
          </div>
          <input type='submit' className='btn btn-primary' value='Login' />
        </form>
        <p className='my-1'>
          Don't have an account? <Link to='register'>Sign Up</Link>
        </p>
      </section>
    </Fragment>
  );
};

export default Login;
