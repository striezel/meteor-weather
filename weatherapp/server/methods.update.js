/* Methods that deal with weather data updates are defined here. */

Meteor.methods({
  /* updateCurrentWeather: method to update current weather of all active cities

     parameters:
       none

     returns:
       Number of triggered updates.
  */
  updateCurrentWeather: function() {
    console.log('Info: Update of current weather data ...');
    //Not on server? Then this is not for you.
    if (!Meteor.isServer)
      return -1;
    //find active cities
    let citiesCursor = Cities.find({active: true});
    if (!citiesCursor)
    {
    	console.info('No active cities were found, exiting update routine.');
      return 0;
    }
    let cities = citiesCursor.fetch();
    for (let city of cities)
    {
      Meteor.call('owmCurrentWeather', city.id, function(err, result){
        //The callback is just here to make the call asynchronous.
      });
    }
    console.info('Weather update for ' + cities.length + ' active cities was triggered.');
    return cities.length;
  },


  /* updateForecast: method to update weather forcast of all active cities

     parameters:
       none

     returns:
       Number of triggered updates.
  */
  updateForecast: function() {
    console.log('Info: Update of weather forecast data ...');
    //Not on server? Then this is not for you.
    if (!Meteor.isServer)
      return -1;
    //find active cities
    let citiesCursor = Cities.find({active: true});
    if (!citiesCursor)
    {
    	console.info('No active cities were found, exiting update routine.');
      return 0;
    }
    let cities = citiesCursor.fetch();
    for (let city of cities)
    {
      Meteor.call('owmForecast', city.id, function(err, result){
        //The callback is just here to make the call asynchronous.
      });
    }
    console.info('Forecast update for ' + cities.length + ' active cities was triggered.');
    return cities.length;
  }
});
