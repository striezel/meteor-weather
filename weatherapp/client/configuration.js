Template.configuration.created = function() {
  this.subscribe('userData');
  this.subscribe('configuration');
  this.subscribe('cities');
};

Template.configuration.helpers({
  config: function() {
    let cDoc = Configuration.findOne({});
    if (!cDoc)
      return 'No data!';
    return cDoc;
  },
  cities: function() {
    let cl = Cities.find({}, {sort: {name: 1, "sys.country": 1}});
    if (!cl)
      return null;
    cl = cl.fetch();
    if (cl.length === 0)
      return null;
    for (let city of cl)
    {
      if ((city.sys.country) && codesISO3166[city.sys.country])
      {
        city.sys.country = city.sys.country + ' (' + codesISO3166[city.sys.country].en + ')';
      }
    } //for
    return cl;
  }
});

Template.configuration.events({
  'click [id="setapikey"], touchend [id="setapikey"]': function(event) {
    var newKey = $('#apikey').val();
    newKey = newKey.trim();
    if (newKey === '')
    {
      alert('The API key is empty!');
      return;
    }
    //let server handle the update
    Meteor.call('setApiKey', newKey, function (error, result) {
      if (error)
      {
        alert('API key could not be set. ' + error.reason);
      }
      else
      {
        alert('New API key has been set.');
      }
    });
  },
  'click [id="findcitybtn"], touchend [id="findcitybtn"]': function(event) {
    var city = $('#findcitytxt').val();
    city = city.trim();
    if (city === '')
    {
      alert('The entered value is empty!');
      return;
    }
    //let server handle the rest
    Meteor.call('findCity', city, function (error, result) {
      if (error)
      {
        alert('City was not found. ' + error.reason);
      }
    });
  },
  'click button': function(event) {
    console.log('data: ' + event.currentTarget.getAttribute('data'));
    let data = event.currentTarget.getAttribute('data');
    if (!data)
      return true;
    if (data.startsWith('remove_'))
    {
      let id = data.substring(7);
      Meteor.call('removeCity', id, function(error, result) {
        if (error)
          alert("City was not removed! " + error.reason);
        else if (result==1)
        {
          console.log('City was removed.');
        }
      });
    } //if 'remove_...'
  }
});