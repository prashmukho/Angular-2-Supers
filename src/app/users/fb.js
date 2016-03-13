module.exports = function (id, loginConfig) {
  window.fbAsyncInit = function() {
    FB.init({
      appId      : id,
      xfbml      : true,
      status     : true,
      cookie     : true,
      version    : 'v2.5'
    });

    $(document).on('click', '#facebook-login', function () {
      var loginBtn = $('#facebook-login')[0];
      loginBtn.disabled = true;

      FB.login(function(response) {
        console.log(response.status);
        
        if (response.authResponse) {
          // Get basic user info
          FB.api('/me?fields=name,email', function(response) {

            loginConfig.active = true;
            loginConfig.email = response.email;
            loginConfig.provider = 'facebook';
            
            console.log('Successful login for:', response.email);
            loginBtn.disabled = false;

            $('.post-login').click();
          });
        } else {
          console.error('User aborted.');
          loginBtn.disabled = false;
        }

      }, {scope: 'public_profile,email'});
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
