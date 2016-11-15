/* Methods that deal with OpenWeatherMap API for current weather are defined here. */

Meteor.methods({
  /* owmCurrentWeather: method to get current weather for a city

     parameters:
       owmCityId - (number) id of the city as seen on OpenWeatherMap calls

     returns:
       Returns true, if some data was retrieved.
       Returns false or throws, if no data was retrieved.
  */
  owmCurrentWeather: function(owmCityId) {
    console.log('Info: Trying to get weather for city ' + JSON.stringify(owmCityId) + '.');
    if (typeof owmCityId !== "number")
    {
      throw new Meteor.Error('invalid-parameter-type',
       'Parameter "owmCityId" is not a string, it is ' + typeof owmCityId + '!');
    }
    owmCityId = Math.round(owmCityId);
    if (owmCityId <= 0)
    {
      throw new Meteor.Error('invalid-parameter-value', 'Parameter "owmCityId" must be a positive number!');
    }
    if (!Meteor.isServer)
      return false;
    //build request URL
    let confDoc = Configuration.findOne({});
    if (!confDoc)
    {
      throw new Meteor.Error('missing-configuration', 'No configuration is present.');
    }
    if (!confDoc.apikey || (typeof confDoc.apikey !== 'string'))
    {
      throw new Meteor.Error('missing-apikey', 'There is no API key!');
    }
    let url = 'http://api.openweathermap.org/data/2.5/weather?id=' + encodeURIComponent(owmCityId)
            + '&appid=' + encodeURIComponent(confDoc.apikey);
    HTTP.get(url, function(error, result) {
      if (error)
      {
        console.log('Error: ' + JSON.stringify(error));
        throw new Meteor.Error('http-request-failed',
                'Could not get current weather for city ' + owmCityId + '! ' + error.reason);
      }
      console.log('Status code: ' + result.statusCode);
      if (result.statusCode != 200)
      {
        if (result.statusCode === 401)
          throw new Meteor.Error('authorization-required', 'Authorization failed, the API key might be wrong or missing!');
        else
          throw new Meteor.Error('http-request-failed', 'Could not get current weather for city ' + owmCityId + '! Status: ' + result.StatusCode + '.');
      }
      if (result.data === null)
        throw new Meteor.Error('http-request-failed', 'No JSON data was found!');
      //build object
      let entry = {date: new Date(), "owmCityId": owmCityId, owmData: result.data};
      let insertCount = CurrentWeather.insert(entry);
      return (insertCount > 0);
    });
  }
});
