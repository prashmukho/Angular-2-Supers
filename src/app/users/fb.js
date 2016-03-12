module.exports = function (id, loginConfig) {
  window.fbAsyncInit = function() {
    FB.init({
      appId      : id,
      xfbml      : true,
      status     : true,
      cookie     : true,
      version    : 'v2.5'
    });

    // Inconsistent behaviour when routing back and forth with 
    // Angular if click event not bound on document as opposed
    // to $('#facebook-login').click(...)
    $(document).on('click', '#facebook-login', function () {
      var loginBtn = $('#facebook-login')[0];
      loginBtn.disabled = true;

      FB.login(function(response) {
        console.log(response.status);
        
        if (response.authResponse) {
          getUserBasic();
        } else {
          console.error('User aborted.');
        }

        loginBtn.disabled = false;
      }, {scope: 'public_profile,email'});
    });

    // FB.logout(function(response) {});
  };

  function getUserBasic() {
    FB.api('/me?fields=name,email', function(response) {
      console.log('Successful login for:', response.name);
      loginConfig.active = true;
      loginConfig.email = response.email;
      // console.log('called getUserBasic', JSON.stringify(response));
      $('.post-login').click();
    });
  }

  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
};