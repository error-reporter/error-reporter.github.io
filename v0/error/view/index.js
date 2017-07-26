'use strict';
// This code is very old, I'm sorry you have to deal with it.

/* global Raven:false, hljs:false */
+function() {

  const params = new URL(window.location.href).searchParams;

  const clientInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    version: params.get('version') || 'not-provided',
  };

  const output = document.getElementById('output');

  let parcel;
  let err;
  let title = params.get('title') || '';

  let jsonParcel = params.get('json');
  if (jsonParcel) {
    try {
      parcel = JSON.parse(jsonParcel);
    } catch(e) {
      parcel = {
        raw: jsonParcel,
        parseError: e.message,
      };
    }
    parcel = Object.assign(clientInfo, parcel);
    err = parcel.error || parcel;
    title = title || err && err.message || err || 'Untitled';

    output.innerHTML = hljs.highlight(
      'json',
      JSON.stringify(parcel, null, 2)
    ).value;
    document.querySelectorAll('.if-no-error').forEach( (ner) => ner.style.display = 'none' );
  } else {
    document.querySelectorAll('.if-error').forEach( (er) => er.style.display = 'none' );
  }

  //const btnCssText = window.getComputedStyle( document.querySelector('button') ).cssText;
  //document.querySelectorAll('.btn').forEach( (btn) => btn.style.cssText = btnCssText );

  document.body.style.display = '';

  const ta = document.querySelector('main');
  document.documentElement.style.background =
      'linear-gradient(to bottom, black ' +
      (ta.offsetTop + parseInt(getComputedStyle(ta).height)*0.6) +
      'px, transparent), black url("./err.jpg") bottom';

}();
