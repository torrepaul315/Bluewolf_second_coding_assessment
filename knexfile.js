// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: process.env.DATABASE_URL || 'dark-sky',
    }

  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'dark-sky',

    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
    useNUllAsDefault:true
  }

};


// var dailyHigh = histWbyDay.daily.data[0].apparentTemperatureMax;
// var dailylow = histWbyDay.daily.data[0].apparentTemperatureMin;
// var dailyHumidity = histWbyDay.daily.data[0].humidity;
//
//
// console.log(
//   dailyHigh, dailyLow, dailyHumidity
// );
//
//
// HighTempArray.push(dailyHigh);
// LowTempArray .push(dailyLow);
// HumidityArray.push(dailyHumidity);
//
// var HighTempArray = [];
// var LowTempArray = [];
// var HumidityArray= [];
// histWeatherDataArray.push(HighTempArray,LowTempArray,HumidityArray);
