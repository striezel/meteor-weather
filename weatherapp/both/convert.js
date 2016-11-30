/* conversion functions */

Convert = {
  /* KelvinToCelsius: converts an absolute temperature value (in Kelvin) to
                      the corresponding value on the Celsius scale and rounds
                      the result to one digit
  */
  KelvinToCelsius: function(K)
  {
    return Math.round((K - 273.15) * 10) / 10;
  },


  /* MeterPerSecondToKilometerPerHour: converts a speed value in m/s to the
         corresponding value in km/h and rounds the result to one digit.
  */
  MeterPerSecondToKilometerPerHour: function (mps)
  {
    return Math.round((mps * 3.6) * 10) / 10;
  }
};
