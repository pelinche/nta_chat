import './App.css';
import Login from './components/Login';
import Chat from './components/Chat';

import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';
import Admin from './components/Admin';

function App() {
  let location = useLocation();

  return (

          <BrowserRouter>
            <div>
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: location },
                }}
              />
              <Switch>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/admin">
                  <Admin />
                </Route>
                <SecureRoute path="/chat">
                  <Chat />
                </SecureRoute>
              </Switch>
            </div>
          </BrowserRouter>
  );
}

export default App;


function SecureRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        localStorage.getItem('username') ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}