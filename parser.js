chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    sendResponse(parseMentions(request));
  });

parseMentions = function(text) {
  //reformat from (@|*)id (Name) to [id|Name]
  fastMention = /\s[\*@]([\w.]+)(?:\s*\(([^\)]*)\))*/g;
  rfText = text.replace(fastMention,' [$1|$2]');
  //find all mentions
  mention = /\[(?:(id|club)(\d+)|([\w.]+))\|([^\]]*)\]/g;
  console.log('ololo')
  return rfText.replace(mention,
    function (match, type, id, domain, name){
      console.log(match, domain);
      if (!domain && name) return match;
      if (domain) {
        console.log(domain);
        var object = vkapi('utils.resolveScreenName', {screen_name: domain});
        console.log(object);
        if (!object || object == [] || object.type == 'application') return match;
        id = object.object_id;
        type = (object.type == 'user')? 'id' : 'club';
        if (name) return '[' + type + id + '|' + name + ']';
      }
      name = getName (id, type);
      return '[' + type + id + '|' + name + ']';
    });
}

function getName (id, type) {
  if (type == 'id') {
    var user = vkapi('users.get', {user_ids: id})[0];
    return user.first_name + ' ' + user.last_name;
  } else {
    var group = vkapi('groups.getById', {group_id: id})[0];
    return group.name;
  }
}

function vkapi(method, params) {
  var url = 'https://api.vk.com/method/' + method + '?';
  var pars = [];
  for (var key in params) {
    pars.push(key + '=' + params[key]);
  }
  url += pars.join('&');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.send();
  var resp = JSON.parse(xhr.response);
  if (resp.response) {
    return resp.response;
  } else {
    console.log (resp);
  }
}