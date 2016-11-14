Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', {name: 'intro'});
Router.route('/info', {name: 'information'});
Router.route('/profile', {name: 'profile'});
Router.route('/config', {name: 'configuration'});

//route for removing cities
Router.route('/city/remove/:_id', {
	name: 'cityRemove',
	data: function(){
		var cityDoc = Cities.findOne({_id: this.params._id});
		return {cityData: cityDoc};
	}
});
