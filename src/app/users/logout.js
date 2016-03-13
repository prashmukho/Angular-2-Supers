module.exports = (function () {
  var gapiLoaded = function () {
    gapi.load('auth2', function () {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.getAuthInstance() || gapi.auth2.init({
        // DEFAULTS
        // cookiepolicy: 'single_host_origin',
        // scope: 'profile, email'
        client_id: '664391605767-2s39e9gu9f7n8jt4999glfv64fqcnjef.apps.googleusercontent.com'
      });

      $(document).on('click', '#logout', function () {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          console.log('User signed out.');
        });
      });
    });
  };

  (function(d, s, id) {
    var js = d.createElement(s);
    js.id = id;
    js.src = 'https://apis.google.com/js/api:client.js';
    js.onload = gapiLoaded;
    document.body.appendChild(js);
  }(document, 'script', 'google-jssdk'));

  window.fbAsyncInit = function() {
    FB.init({
      appId      : id,
      xfbml      : true,
      status     : true,
      cookie     : true,
      version    : 'v2.5'
    });

    $(document).on('click', '#facebook-login', function () {
      
    });
  };

  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); 
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
})();

