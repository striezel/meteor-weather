Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', {name: 'intro'});
Router.route('/info', {name: 'information'});
