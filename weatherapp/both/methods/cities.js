/* Methods that deal with available cities are defined here. */

Meteor.methods({
  /* findCity: method to find a new city for the list of available cities

     parameters:
       city - (string) name of the city

     returns:
       TODO
  */
  findCity: function(city) {
    console.log('Info: Trying to find new city ' + JSON.stringify(city) + '.');
    if (typeof city !== "string")
    {
      throw new Meteor.Error('invalid-parameter-type',
       'Parameter "city" is not a string, it is ' + typeof city + '!');
    }
    city = city.trim();
    if (city === '')
    {
      throw new Meteor.Error('invalid-parameter-value', 'Parameter "city" is empty!');
    }
    //only logged in user might do that
    if (!Meteor.userId())
    {
      throw new Meteor.Error('not-authorized', 'Only a signed-in user is allowed to do that!');
    }
    let adminDoc = Meteor.users.findOne({_id: Meteor.userId(), admin: true});
    if (!adminDoc)
    {
      throw new Meteor.Error('not-authorized', 'Only an admin user is allowed to do that!');
    }
    if (!Meteor.isServer)
      return;
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
    let url = 'https://api.openweathermap.org/data/2.5/find?q=' + encodeURIComponent(city)
            + '&appid=' + encodeURIComponent(confDoc.apikey);
    HTTP.get(url, function(error, result) {
      if (error)
      {
        console.log('Error: ' + JSON.stringify(error));
        throw new Meteor.Error('http-request-failed', 'Could not get cities! ' + error.reason);
      }
      console.log('Status code: ' + result.statusCode);
      if (result.statusCode != 200)
        throw new Meteor.Error('http-request-failed', 'Could not get cities! Status: ' + result.StatusCode + '.');
      if (result.data === null)
        throw new Meteor.Error('http-request-failed', 'No JSON data was found!');
      //insert count
      let insertCount = 0;      
      //get list
      let list = result.data.list;
      for (let item of list)
      {
        console.log(JSON.stringify(item));
        let data = {id: item.id, name: item.name, coord: item.coord, sys: {country: item.sys.country}};
        let cityDoc = Cities.findOne(data);
        if (!cityDoc && (item.id != 0))
        {
          data.active = false;
          Cities.insert(data);
          ++insertCount;
        } //if
      } //for
      return insertCount;
    });
  },


  /* removeCity: method to remove a city from the list of available cities

     parameters:
       cityId - (string) database ID of the city

     returns:
       Returns the number of removed cities, i.e. usually one.
  */
  removeCity: function(cityId) {
    if (typeof cityId !== "string")
    {
      throw new Meteor.Error('invalid-parameter-type',
       'Parameter "cityId" is not a string, it is ' + typeof cityId + '!');
    }
    //only logged in user might do that
    if (!Meteor.userId())
    {
      throw new Meteor.Error('not-authorized', 'Only a signed-in user is allowed to do that!');
    }
    let adminDoc = Meteor.users.findOne({_id: Meteor.userId(), admin: true});
    if (!adminDoc)
    {
      throw new Meteor.Error('not-authorized', 'Only an admin user is allowed to do that!');
    }
    let cityDoc = Cities.findOne({_id: cityId});
    if (!cityDoc)
    {
      throw new Meteor.Error('entity-not-found', 'There is no city with the ID ' + cityId + '!');
    }
    let affected = Cities.remove({_id: cityId});
    if (affected > 0)
    {
      let uname = Meteor.users.findOne({_id: Meteor.userId()});
      if (!uname)
        uname = 'unknown user';
      else
        uname = uname.username || uname.emails[0];
      console.log('Info: City with _id ' + cityId + ' was removed by ' + uname + '.');
    }
    return affected;
  },


  /* activeCity: method to activate or deactivate a city in the list of available cities

     parameters:
       cityId - (string) database ID of the city
       activeState - (bool) new activation state of the city

     returns:
       Returns the number of updated cities, i.e. usually one.
  */
  activeCity: function(cityId, activeState) {
    if (typeof cityId !== "string")
    {
      throw new Meteor.Error('invalid-parameter-type',
       'Parameter "cityId" is not a string, it is ' + typeof cityId + '!');
    }
    if (typeof activeState !== "boolean")
    {
      throw new Meteor.Error('invalid-parameter-type',
       'Parameter "activeState" is not a boolean, it is ' + typeof activeState + '!');
    }
    //only logged in user might do that
    if (!Meteor.userId())
    {
      throw new Meteor.Error('not-authorized', 'Only a signed-in user is allowed to do that!');
    }
    let adminDoc = Meteor.users.findOne({_id: Meteor.userId(), admin: true});
    if (!adminDoc)
    {
      throw new Meteor.Error('not-authorized', 'Only an admin user is allowed to do that!');
    }
    let cityDoc = Cities.findOne({_id: cityId});
    if (!cityDoc)
    {
      throw new Meteor.Error('entity-not-found', 'There is no city with the ID ' + cityId + '!');
    }
    let affected = Cities.update({_id: cityId}, {$set: {active: activeState}});
    if (affected > 0)
    {
      let uname = Meteor.users.findOne({_id: Meteor.userId()});
      if (!uname)
        uname = 'unknown user';
      else
        uname = uname.username || uname.emails[0];
      let verb = activeState ? 'activated' : 'deactivated';
      console.log('Info: City with _id ' + cityId + ' was ' + verb + ' by ' + uname + '.');
      if (activeState)
      {
        //make sure we have weather data for the city
        Meteor.call('owmCurrentWeather', cityDoc.id, function(err, result){
          //The callback is just here to make the call asynchronous.
        });
      } //if
    } //if affected > 0
    return affected;
  }
});
