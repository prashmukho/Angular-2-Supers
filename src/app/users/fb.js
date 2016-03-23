module.exports = function (loginConfig, action) {
  window.fbAsyncInit = function() {
    FB.init({
      appId      : process.env.FB_APP_ID,
      xfbml      : false,
      status     : true,
      cookie     : true,
      version    : 'v2.5'
    });
    
    FB.getLoginStatus(function (response) {
      if (action === 'login') 
        loginConfig.provider.wasLoggedIn = ( response.status === 'unknown' ? false : true );
      
      $(document).on('click', '#facebook-login', function () {
        $('#facebook-login')[0].disabled = true;

        FB.login(function(response) {
          if (response.authResponse) {
            // Get basic user info
            FB.api('/me?fields=name,email', function(response) {
              loginConfig.active = true;
              loginConfig.email = response.email;
              loginConfig.provider.name = 'facebook';
              
              console.log('Successful login for:', loginConfig.email);
              $('#post-login').click();
            });
          } else {
            console.error('User aborted');
            $('#facebook-login')[0].disabled = false;
          }
        }, {scope: 'public_profile,email'});
      });
    });

    $(document).on('click', '#fb-logout', function () {
      if (loginConfig.provider.wasLoggedIn === false) {
        FB.getLoginStatus(function(response) {
          if (response && response.status === 'connected') {
            FB.logout(function(response) {
              console.log('User signed out of Facebook.');
            });
          }
        });
      }
      $('#logout').click();
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
};
