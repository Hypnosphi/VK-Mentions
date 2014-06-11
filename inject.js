//var extId = 'eclcnenlmadahojlpddeojhnfkdgcjck';
var extId = 'ckdhlldfibgcpcnpmbcbgoakbcmjhaim';
ajax.__post = ajax.post;
ajax.post = function (url, query, options) {
  if (url == 'al_im.php' || url == 'al_mail.php') {
    var message = query.msg || query.message;
    if (message) {
      chrome.runtime.sendMessage(extId, message,
        function(response) {
          query.msg = query.message = response;
          ajax.__post(url, query, options);
        });
      return;
    }
  }
  ajax.__post.apply(this, arguments);
}

function replaceComposer() {
  if (!window.Composer) {
  	stManager.add('page.js', replaceComposer);
  	return;
  }
  Composer.__updateAutoComplete = Composer.updateAutoComplete;
  Composer.updateAutoComplete = function(composer, event) {
    var el = composer.input;
    if (!el.id) {
      el.id = 'untitled' + count++;
    }
    if (el.contentEditable == "true") {
      var sel =  window.getSelection();
      var node = sel.baseNode || el;
      if (node.nodeType == 3) {
        node.getValue = function() {
          return this.data;
        }
      }
      node.selectionStart = sel.baseOffset;
      composer.input = node;
    }
    Composer.__updateAutoComplete.apply(this, arguments);
    composer.input = el;
  }
}

var count = 0;
replaceComposer();
var imClasses = ['im_editable', 'fc_editable', 'pad_msg_field'];
findForms(document.body, imClasses);

var observer = new MutationObserver (
  function(mutations) {
    for (var m = 0; m < mutations.length; m++) {
      var mut = mutations[m];
      if (mut.type == 'childList') {
        for (var j = 0; j < mut.addedNodes.length; j++) {
          addedNode = mut.addedNodes[j];
          if (addedNode.nodeType == 1) {
            findForms(addedNode, imClasses);
          }
        }
      } else if (mut.attributeName == 'style' && mut.target.style.display != 'none') {
        findForms(mut.target, imClasses);
      }
    }
  });
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['style']
})

function findForms(el, classList) {
  for (var i = 0; i < classList.length; i++) {
    var elementList = el.getElementsByClassName(classList[i]);
    for (var j = 0; j < elementList.length; j++) {
      if (getSize(elementList[j])[0]) {
        addWdd(elementList[j]);
      }
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

/*function setSelectionStart(el) {
  var sel =  window.getSelection();
  var cont = sel.baseNode;
  var selectionStart = sel.baseOffset;
  console.log(selectionStart);
  var node = el.firstChild;
  if (node && node != cont) {
    var prevHTML = document.createElement('div');
    do {
      prevHTML.appendChild(node.cloneNode());
      node = node.nextSibling;
    } while(node && node != cont && node != node.parentNode);
    selectionStart += prevHTML.innerHTML.length;
  }
    el.selectionStart = selectionStart;
}*/