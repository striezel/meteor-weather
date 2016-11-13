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
    let url = 'http://api.openweathermap.org/data/2.5/find?q=' + encodeURIComponent(city)
            + '&appid=' + encodeURIComponent(confDoc.apikey);
    console.log('Debug: URL is ' + url + '.');
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
          Cities.insert(data);
          ++insertCount;
        } //if
      } //for
      return insertCount;
    });
  }
});
