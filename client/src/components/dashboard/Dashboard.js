import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProfile } from '../../actions/profile';

const Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);
  return <h1>Dashboard</h1>;
};

export default Dashboard;
