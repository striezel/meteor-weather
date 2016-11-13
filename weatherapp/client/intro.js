Template.intro.created = function() {
  this.subscribe('userData');
};

Template.intro.helpers({
  isAdmin: function() {
    let userDoc = Meteor.users.findOne({_id: Meteor.userId()});
    if (!userDoc)
      return false;
    return userDoc.admin;
  }
});
