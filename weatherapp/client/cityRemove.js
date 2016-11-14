Template.cityRemove.created = function() {
  this.subscribe('cities');
};

Template.cityRemove.events({
  'click .deleteConfirm': function(event){
    event.preventDefault();

    Meteor.call('removeCity', this.cityData._id, function(error, result) {
      if (error)
        alert("City was not removed! " + error.reason);
      else if (result==1)
      {
        console.log('City was removed.');
      }
    });
    /* Assume that everthing goes well and we can go back to the configuration template.
       If an error occurred, then the callback will kick in a few milliseconds
       later and show an alert. If everything went fine, we are at the
       configuration template just a moment earlier.
    */
    Router.go('configuration');
  }
});