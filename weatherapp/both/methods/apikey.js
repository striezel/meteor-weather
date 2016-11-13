/* Methods that deal with the API key are defined here. */

Meteor.methods({
  /* setApiKey: method to set a new API key

     parameters:
       newKey - (string) new API key

     returns:
       Returns true, if the new API key was set successfully.
  */
  setApiKey: function(newKey) {
    console.log('Info: Change of API key was requested.');
    if (typeof newKey !== "string")
    {
      throw new Meteor.Error('invalid-parameter-type',
       'Parameter "newKey" is not a string, it is ' + typeof newKey + '!');
    }
    //only logged in admin user might set new key
    if (!Meteor.userId())
    {
      throw new Meteor.Error('not-authorized', 'Only an admin user can change the API key!');
    }
    let adminDoc = Meteor.users.findOne({_id: Meteor.userId(), admin: true});
    if (!adminDoc)
    {
      throw new Meteor.Error('not-authorized', 'Only an admin user can change the API key!');
    }
    //change it
    let numDocs = Configuration.update({}, {$set: {apikey: newKey}});
    //log info about user that performed the change
    if (numDocs > 0)
      console.log('Info: API key was changed by user ' + adminDoc.username + '.');
    return (numDocs > 0);
  }
});
