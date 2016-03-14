module.exports = function (loginConfig) {
  var googleUser = {};
  var startApp = function () {
    gapi.load('auth2', function () {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.getAuthInstance() || gapi.auth2.init({
        // DEFAULTS
        // cookiepolicy: 'single_host_origin',
        // scope: 'profile, email'
        client_id: process.env.GOOGLE_CLIENT_ID,
      });

      attachSignin(document.getElementById('google-login'));
    });
  };

  function attachSignin(element) {
    auth2.attachClickHandler(element, {},
      function(googleUser) {
        var user = googleUser.getBasicProfile();

        loginConfig.active = true;
        loginConfig.email = user.getEmail();
        loginConfig.provider = 'google';
        
        console.log('Successful login for:', user.getEmail());
        $('.post-login').click();
      }, function(error) {
        //TODO: resolve this later
        alert('Changing views too fast!');
      });
  }

  (function(d, s, id) {
    var js = d.createElement(s);
    // if (document.getElementById(id)) {startApp(); return;} 
    js.id = id;
    js.src = 'https://apis.google.com/js/api:client.js';
    js.onload = startApp;
    document.body.appendChild(js);
  }(document, 'script', 'google-jssdk'));
};