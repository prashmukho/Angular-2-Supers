module.exports = function (id) {
  // if (document.getElementById('google-meta')) return;
  // m = document.createElement('meta'); 
  // m.id = 'google-meta';
  // m.setAttribute('name', 'google-signin-client_id');
  // m.setAttribute('content', id);
  // document.head.appendChild(m);

  var googleUser = {};
  var startApp = function () {
    gapi.load('auth2', function () {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.getAuthInstance() || gapi.auth2.init({
        client_id: id,
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
      attachSignin(document.getElementById('google-login'));
    });
  };

  function attachSignin(element) {
    auth2.attachClickHandler(element, {},
      function(googleUser) {
        console.log("Signed in: " + googleUser.getBasicProfile().getName());
      }, function(error) {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

  js = document.createElement('script'); 
  js.id = 'google-jssdk';
  js.src = 'https://apis.google.com/js/api:client.js';
  js.onload = startApp;
  document.body.appendChild(js);
};