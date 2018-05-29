import React from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';

import HeaderContainer from './shared/HeaderContainer';
import HomePage from './home/HomePageContainer';
import InventoryPage from './inventory/InventoryPageContainer';
import LoginPage from './account/LoginPageContainer';
import MessagesBox from './shared/MessagesBoxContainer';
import ProfilePage from './account/ProfilePage';
import RegisterPage from './account/RegisterPageContainer';
import RegistrationSuccessPage from './account/RegistrationSuccessPageContainer';
import ResetPasswordPage from './account/ResetPasswordPageContainer';
import ResetPasswordConfirmPage from './account/ResetPassword2PageContainer';

export default function Template(props) {
  const { authentication, progress } = props;
  return (
    <Router>
      <div className="wrapper">
        <HeaderContainer authentication={authentication} />
        <section className="page-content container-fluid">
          <MessagesBox />
          <Redirect from="/" to="/inventory" />
          <Route exact path="/" component={HomePage} />
          <Route
            path="/account/password-reset-confirm/:hash"
            component={ResetPasswordConfirmPage}
          />
          <Route exact path="/account/login" component={LoginPage} />
          <Route path="/account/profile/:id" component={ProfilePage} />
          <Route exact path="/account/register" component={RegisterPage} />
          <Route exact path="/account/registration-success" component={RegistrationSuccessPage} />
          <Route exact path="/account/password-reset" component={ResetPasswordPage} />
          <Route exact path="/inventory/" component={InventoryPage} />
        </section>
        <div className="loader-wrapper" style={progress > 0 ? { display: 'block' } : { display: 'none '}}>
          <div className="loader-box">
            <div className="loader">Loading ...</div>
          </div>
        </div>
      </div>
    </Router>
  );
}
