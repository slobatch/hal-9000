var Slack = require('slack-client');

var token = 'xlkja-dalkjhlk-alskjd-alskdjg-asd';//replace with your slack token

var slack = new Slack(token, true, true);

slack.on('open', function () {
  var channels = Object.keys(slack.channels)
      .map(function (k) { return slack.channels[k]; })
      .filter(function (c) { return c.is_member; })
      .map(function (c) { return c.name; });

  var groups = Object.keys(slack.groups)
      .map(function (k) { return slack.groups[k]; })
      .filter(function (g) { return g.is_open && !g.is_archived; })
      .map(function (g) { return g.name; });

  console.log('Welcome to Slack. You are ' + slack.self.name + ' of ' + slack.team.name);

  if (channels.length > 0) {
    console.log('You are in: ' + channels.join(', '));
  } else {
    console.log('You are not in any channels.');
  }

  if (groups.length > 0) {
    console.log('As well as: ' + groups.join(', '));
  }
});

slack.login();

slack.on('message', function (message) {
  var channel = slack.getChannelGroupOrDMByID(message.channel);
  var user = slack.getUserByID(message.user);

  if (message.type === 'message') {
    try {
      console.log(channel.name + ' : ' + user.name + ' : ' + message.text);
    } catch(err) {
      console.log(channel.name + ' : ' + 'ANONYMOUS' + ' : ' + message.text);
    }
  }

  var helpregex = new RegExp('^can.*\?$', 'i');
  var message_text = message.getBody();

  try {
    if (((user.profile.first_name === 'Dave') || (user.profile.first_name === 'David')) && (user.name !== 'dbyrd')) {

      console.log('A Dave just spoke!');
      console.log('The message body: ' + message_text);

      if (message_text.match(helpregex)) {
        var speak_rand = Math.random();
        console.log('Dave is asking for help. The random number: ' + speak_rand);
        if (speak_rand < 1) {
          channel.send('I\'m sorry, ' + '<@' + user.id + '>, I\'m afraid I can\'t do that.');
        }
      }

    } else if ((message_text.indexOf('<@U09GZKREW>') > -1) || (message_text.indexOf('hal-9000') > -1)) {
      channel.send('_stares creepily..._ :hal:');
    }
  } catch(err) {
    console.log('Looks like something went wrong while checking to see if it was Dave who spoke.');
    if ((message_text.indexOf('<@U09GZKREW>') > -1) || (message_text.indexOf('hal-9000') > -1)) {
      channel.send('_stares creepily..._ :hal:');
    }
  }
});
