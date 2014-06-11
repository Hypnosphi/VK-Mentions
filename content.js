var wdd = document.createElement('script');
wdd.src = '/js/al/wide_dd.js?27';
document.head.appendChild(wdd);
var inj = document.createElement('script');
inj.src = chrome.extension.getURL('inject.js');
document.body.appendChild(inj);
