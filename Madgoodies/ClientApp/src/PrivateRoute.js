import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} element={localStorage.getItem('token') ? <Component /> : <Navigate to='/login' />} />
);

export default PrivateRoute;
