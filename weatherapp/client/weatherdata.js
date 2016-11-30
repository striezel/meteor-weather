Template.weatherdata.created = function() {
  this.subscribe('currentweather');
  this.subscribe('cities');
};

Template.weatherdata.helpers({
  cities: function() {
    let cityCursor = Cities.find({active: true}, {sort: {name: 1, "sys.country": 1}});
    if (!cityCursor)
      return null;
    let list = cityCursor.fetch();
    for (let city of list)
    {
    	city.country = city.sys.country;
    	if ((city.sys.country) && codesISO3166[city.sys.country])
      {
        city.country = codesISO3166[city.sys.country].en;
      }
      let wDoc = CurrentWeather.findOne({owmCityId: city.id}, {sort: {date: -1}});
      if (!wDoc)
      {
        console.log("No data found for id " + city.id + ".");
        continue;      
      }
      city.temp = Convert.KelvinToCelsius(wDoc.owmData.main.temp);
      city.pressure = wDoc.owmData.main.pressure;
      city.humidity = wDoc.owmData.main.humidity;
      city.windspeed = wDoc.owmData.wind.speed;
      city.windspeed_kmh = Convert.MeterPerSecondToKilometerPerHour(wDoc.owmData.wind.speed);
      city.date = moment(wDoc.owmData.dt*1000).format("DD.MM.YYYY HH:mm");
      city.sunrise = moment(wDoc.owmData.sys.sunrise*1000).format("DD.MM.YYYY HH:mm");
      city.sunset = moment(wDoc.owmData.sys.sunset*1000).format("DD.MM.YYYY HH:mm");
    } //for
    return list;
  }
});
