import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthProvider from './contexts/AuthProvider';
import Feed from './components/Feed';
import ProtectedRoute from './components/ProtectedRoute';
import UpdateProfile from './components/UpdateProfile';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <ProtectedRoute exact path='/' component={Feed} />
            <ProtectedRoute exact path='/update-profile' component={UpdateProfile} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
