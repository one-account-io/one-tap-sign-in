function showOneAccountOneTapSignIn({
  clientId = '',
  redirectURI = '',
  apiURL = 'https://api.one-account.io/v1',
  grantType = 'authorization_code',
  responseType = 'code',
  scope = 'openid 1a.fullname.view 1a.email.view 1a.profilepicture.view',
  includeGrantedScopes = true,
}) {
  document.body.innerHTML += `<iframe
                                title="One Account"
                                id="one-account-one-tap-sign-in"
                                src="${apiURL}/iframe/one-tap-sign-in?grant_type=${grantType}&response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scope}&include_granted_scopes=${includeGrantedScopes}"
                                style="width: 470px; height: 400px; position: fixed; top: 0px; right: 0px; z-index: 9999"
                                frameborder="0"
                              ></iframe>`;
}

function oneAccountHandleReceivedMessage(event) {
  if (event.data === 'removeOneAccountOneTapSignInIframe') {
    const element = document.getElementById('one-account-one-tap-sign-in');
    element.parentNode.removeChild(element);
  }
}

window.addEventListener('message', oneAccountHandleReceivedMessage, false);
