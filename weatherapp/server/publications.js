/* published MongoDB collections */
Meteor.publish('info', function(){
  return Info.find({});
});
