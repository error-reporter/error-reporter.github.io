'use strict';
// This code is very old, I'm sorry you have to deal with it.

/* global hljs:false */
(function() {

  const params = new URL(window.location.href).searchParams;
  let title = params.get('title');

  let toEmail;
  const locHash = window.location.hash.substr(1);
  if (locHash) {
    const hashParams = new URLSearchParams(locHash);
    toEmail = hashParams.get('toEmail');
    if (toEmail) {
      const calcHash = (str) => {

        let hash = 0, i, chr;
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
          chr   = str.charCodeAt(i);
          hash  = ((hash << 5) - hash) + chr;
          hash |= 0; // Convert to 32bit integer
        }
        return hash;

      };
      const hash = calcHash(toEmail);
      window.localStorage[hash] = toEmail;
      window.location.hash = `emailHash=${hash}`;
    } else {
      const emailHash = hashParams.get('emailHash');
      toEmail = window.localStorage[emailHash];
      if (!toEmail) {
        window.location.href = window.location.href.replace(/#.*$/g, '');
        return;
      }
    }
  }

  const jsonParcel = params.get('json');

  let report;

  if (!jsonParcel) {
    window.location.href = 'https://github.com/error-reporter/weer';
    return;
  } else {
    try {
      report = JSON.parse(jsonParcel);
    } catch(e) {
      report = {
        raw: jsonParcel,
        parseError: e.message,
        payload: e,
      };
      title = e.message;
    }
    if (!title) {
      const payload = report.payload;
      const err = payload ? (payload.error || payload) : report;
      title = err && err.message || err || 'Untitled';
    }

    const code = document.getElementById('code');
    code.innerHTML = hljs.highlight(
      'json',
      JSON.stringify(report, null, 2)
    ).value;
    document.getElementById('error-description').innerHTML = `
      Error "<em class="erry bold">${title}</em>" occurred in extension <em class="bold">"${report.extName}" v${report.version}</em>.
    `;
  }

  document.title = title;

  const getMessage = () => {

    const comment = document.getElementById('comment').value;
    const body = `I want to report this error:\n\n${window.location.href}\n\n${comment}`;
    return body;

  };

  if (toEmail) {
    document.documentElement.classList.add('email-mode');
    const subject = `REPORT:${title}`;
    const link = document.getElementById('to-email');
    link.innerText = toEmail;
    link.href =
      `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(getMessage())}`;

    const form = document.getElementById('report-form');
    form.action = `https://formspree.io/${toEmail}`;
    form.onsubmit = () => {

      document.getElementById('comment').value = getMessage();
      return true;

    };
  }

  const button = document.createElement('button');
  document.body.appendChild(button);
  const btnCssText = window.getComputedStyle( button  ).cssText;
  document.body.removeChild(button);
  document.querySelectorAll('.btn').forEach( (btn) => btn.style.cssText = btnCssText );

  document.body.style.display = '';

})();
