/* published MongoDB collections */

//collection with data for information template
Meteor.publish('info', function(){
  return Info.find({});
});

//additional user data
Meteor.publish('userData', function() {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'createdAt': 1, 'admin': 1}});
  } else {
    this.ready();
  }
});

//configuration data
Meteor.publish('configuration', function(){
  if (this.userId) {
    let userDoc = Meteor.users.findOne({_id: this.userId, admin: true});
    if (!userDoc)
    {
      this.ready();
    }
    else
    {
      return Configuration.find({});
    }
  } else {
    this.ready();
  }
});

//collection of available/known cities
Meteor.publish('cities', function(){
  return Cities.find({});
});

//collection for current weather data
Meteor.publish('currentweather', function(){
  return CurrentWeather.find({});
});

//collection for weather forecasts
Meteor.publish('forecast', function(){
  return Forecast.find({});
});
