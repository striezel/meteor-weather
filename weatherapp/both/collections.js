//collection for server-side information
Info = new Mongo.Collection('info');

//collection for configuration data
Configuration = new Mongo.Collection('configuration');

//collection for known cities
Cities = new Mongo.Collection('cities');

//collection for current weather data
CurrentWeather = new Mongo.Collection('currentweather');

//collection for weather forecasts
Forecast = new Mongo.Collection('forecasts');
