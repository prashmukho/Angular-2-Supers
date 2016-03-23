module.exports = function (loginConfig, action) {
  var js = document.createElement('script');
  js.id = 'google-jssdk';
  js.src = 'https://apis.google.com/js/api:client.js';
  js.onload = postLoad;
  if (!document.getElementById('google-jssdk')) document.head.appendChild(js);

  var startApp = function() {
    gapi.load('auth2', function(){
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init({
        client_id: process.env.GOOGLE_CLIENT_ID,
        cookiepolicy: 'single_host_origin',
        //scope: 'additional_scope'
      });

      $(document).on('click', '#google-login', function () {
        $('#google-login')[0].disabled = true;

        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signIn().then(function (googleUser) {
          var profile = googleUser.getBasicProfile();
          loginConfig.active = true;
          loginConfig.email = profile.getEmail();
          loginConfig.provider.name = 'google';
          
          console.log('Successful login for:', loginConfig.email);
          $('#post-login').click();
        }, function () {
          console.log('User aborted');
          $('#google-login')[0].disabled = false;
        });
      });

      $(document).on('click', '#google-logout', function () {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          console.log('User signed out of Google (application).');
          $('#logout').click();
        });
      });
    });
  };

  function postLoad() {
    if (action !== 'login' || document.getElementById('google-login')) {
      startApp();
      return;
    } else {
      setTimeout(function () {
        postLoad();
      }, 200);
    }
  }
};