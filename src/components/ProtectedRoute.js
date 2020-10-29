import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

export default function ProtectedRoute({ component: Component, ...rest }) {

  const { user } = useAuth();

  return (
    <Route {...rest} render={(props) => {
      return user ? <Component {...props} />
        : <Redirect to='/login' />
    }}>
    </Route>
  )
}
