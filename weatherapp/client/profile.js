Template.profile.created = function() {
  this.subscribe('userData');
};

Template.profile.helpers({
  'userdata': function() {
    let userDoc = Meteor.users.findOne({_id: Meteor.userId()});
    if (!userDoc)
      return null;
    userDoc.createdAt = moment(userDoc.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss (Z)');
    return userDoc;
  }
});