/* Methods that deal with repeating tasks are defined here. */

function cjWrapper()
{
  Meteor.call('cronjobs');    
}

Meteor.methods({
  /* cronjobs: method to repeat "cronjobs"

     parameters:
       none

     returns:
       Number of triggered updates.
  */
  cronjobs: function() {
    console.log('Info: Repeated tasks starting ...');
    Meteor.call('updateCurrentWeather', function(err, result){
        //The callback is just here to make the call asynchronous.
    });
    Meteor.call('updateForecast', function(err, result){
        //The callback is just here to make the call asynchronous.
    });
    //determine delay
    let delay = 600 * 1000;
    let confDoc = Configuration.findOne({});
    if (confDoc && confDoc.updateInterval)
    {
      delay = confDoc.updateInterval * 1000;    
    }
    //set timeout for next iteration
    Meteor.setTimeout(cjWrapper, delay);
    return true;
  }
});
