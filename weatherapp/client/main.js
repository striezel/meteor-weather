import { Accounts } from 'meteor/accounts-base';

/* Tell the accounts-ui to use username instead of e-mail for login. */
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL',
});
