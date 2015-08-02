//var mention_extId = 'eclcnenlmadahojlpddeojhnfkdgcjck';
var mention_extId = 'feoidlchmngjbnomknnhmlobdgidgjek',
    count = 0;
    imClasses = ['im_editable', /*'fc_editable',*/ 'pad_msg_field'],
    imId = 'mail_box_editable';
ajax.__post = ajax.post;
ajax.post = function (url, query, options) {
  if (url == 'al_im.php' || url == 'al_mail.php') {
    var message = query.msg || query.message;
    if (message) {
      chrome.runtime.sendMessage(mention_extId, message,
        function(response) {
          query.msg = query.message = response;
          ajax.__post(url, query, options);
        });
      return;
    }
  }
  ajax.__post.apply(this, arguments);
}

findForms(document.body);

var observer = new MutationObserver (
  function(mutations) {
    for (var m = 0; m < mutations.length; m++) {
      var mut = mutations[m];
      if (mut.type == 'childList') {
        for (var j = 0; j < mut.addedNodes.length; j++) {
          addedNode = mut.addedNodes[j];
          if (addedNode.nodeType == 1) {
            findForms(addedNode);
          }
        }
      } else if (mut.attributeName == 'style' && mut.target.style.display != 'none') {
        findForms(mut.target);
      }
    }
  });
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['style']
})

function findForms(el) {
  for (var i = 0; i < imClasses.length; i++) {
    var elementList = el.getElementsByClassName(imClasses[i]),
        element = document.getElementById(imId);
    for (var j = 0; j < elementList.length; j++) {
      if (getSize(elementList[j])[0]) {
        addWdd(elementList[j]);
      }
    }
    if (getSize(element)[0]) {
      addWdd(element);
    }
  }
}

function addWdd(el) {
  if (!window.WideDropdown) {
  	stManager.add('wide_dd.js', function() {addWdd(el)});
  	return;
  }
  if (!el.composer) {
    el.composer = Composer.init(el,{
      lang: {
        introText: getLang('profile_mention_start_typing'),
        noResult: getLang('profile_mention_not_found')
      },
      width: getSize(el)[0]
    });
  }
}