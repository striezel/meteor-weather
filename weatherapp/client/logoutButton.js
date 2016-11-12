Template.logoutButton.events({
  'click #logout, touchend #logout': function(event) {
    //logout the current user out
    Meteor.logout(function(error){
     if (error)
     {
       alert('Logout failed: ' + error.reason);
     }
     Router.go('intro');
    });
  }
});