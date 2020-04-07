import { Meteor } from 'meteor/meteor';

//startup function that fills Info collection
Meteor.startup(function() {
  //clear info collection
  Info.remove({});
  //fill status with NPM mongo module version
  Info.insert({name: 'npmMongoModuleVersion',
               value: MongoInternals.NpmModules.mongodb.version});
  //get git-info.json, if it exists
  Assets.getText('git-info.json', function(err, result) {
    if (!err)
    {
      var gitInfo = JSON.parse(result);
      Info.insert({name: 'gitInfo', value: gitInfo});
    } //if
    else
    {
      console.error('Server startup: Could not get asset git-info.json');
      Info.insert({name: 'gitInfo',
                   value: {branch:      'Git information was not found.',
                           commitDate:  'Git information was not found.',
                           description: 'Git information was not found.',
                           hashShort:   'Git information was not found.',
                           hashLong:    'Git information was not found.'}
                   });
    } //else
  });
  //try to get MongoDB server status via raw database
  var rawDB = Info.rawDatabase();
  rawDB.command({serverStatus: 1}, Meteor.bindEnvironment(function(err, result){
    if (!err)
    {
      Info.insert({name: 'mongoHost', value: result.host});
      Info.insert({name: 'mongoVersion', value: result.version});
      Info.insert({name: 'mongoEngine', value: result.storageEngine.name});
    }
    else
    {
      console.error('serverStatus command call failed!');
      console.error(err);
    }
  }));

  //add server startup time
  Info.insert({name: 'startupTime', value: new Date()});
});

//startup function to create user
Meteor.startup(function() {
  let uDoc = Meteor.users.findOne({admin: true});
  if (!uDoc)
  {
    //create missing admin account
    let admin = {username: 'admin',
                 email: 'admin@localhost',
                 password: 'adminpassw0rd!',
                 admin: true};
    Accounts.createUser(admin);
    console.log('Info: admin account with default credentials was created.');
    Meteor.users.update({username: 'admin'}, {$set: {admin: true}});
  }
});

//startup function to set configuration values
Meteor.startup(function() {
  let confDoc = Configuration.findOne({});
  if (!confDoc)
  {
    Configuration.insert({apikey: null, updateInterval: 600, lastUpdate: null});
    console.log('Info: Basic configuration data was created.');
  }
});

//startup function to trigger updates
Meteor.startup(function() {
  Meteor.call('cronjobs', function() {
    //async
  });
});
