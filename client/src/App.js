import React from 'react';
import './app.css';
import Login from './components/Login';
import { AuthProvider } from 'AuthContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from 'components/Home';
import { AdminRoute, PrivateRoute } from 'components/PrivateRoute';
import AdminDashboard from 'pages/AdminDashboard';
import FormPage from 'pages/FormPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/authentication" component={Login} />
          <PrivateRoute exact path="/" component={AdminDashboard} />
          <PrivateRoute exact path="/form/:id" component={FormPage} />
          {/* <PrivateRoute path="/admin/dashboard" component={AdminDashboard} /> */}
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
