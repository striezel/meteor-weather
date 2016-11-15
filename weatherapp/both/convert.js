/* conversion functions */

Convert = {
  /* KelvinToCelsius: converts an absolute temperature value (in Kelvin) to
                      the corresponding value on the Celsius scale and rounds
                      the result to one digit
  */
  KelvinToCelsius: function(K)
  {
    return Math.round((K - 273.15) * 10) / 10;
  }
};
