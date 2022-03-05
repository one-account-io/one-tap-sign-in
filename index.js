class OneAccountOneTapSignIn {
  static _codeVerifier = '';
  static isVisible = false;

  static show = async ({
    clientId = '',
    redirectURI = '',
    apiURL = 'https://api.one-account.io/v1',
    grantType = 'authorization_code',
    responseType = 'code',
    scope = 'openid 1a.fullname.view 1a.email.view 1a.profilepicture.view',
    state = '',
    includeGrantedScopes = true,
    codeVerifier,
    codeChallenge,
    codeChallengeMethod = 'S256',
    saveCodeVerifier = false,
  } = {}) => {
    if (this.isVisible || document.getElementById('one-account-one-tap-sign-in')) return;
    this.isVisible = true;

    if (!codeVerifier) {
      codeVerifier = this.generateCodeVerifier(128);
    }
    if (!codeChallenge) {
      codeChallenge = await this.generateCodeChallenge(codeVerifier);
    }

    document.body.innerHTML += `<iframe
    title="One Account"
    id="one-account-one-tap-sign-in"
    src="${apiURL}/iframe/one-tap-sign-in?grant_type=${grantType}&response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scope}&state=${state}&include_granted_scopes=${includeGrantedScopes}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}"
    style="width: 470px; height: 400px; position: fixed; top: 0px; right: 0px; z-index: 9999"
    frameborder="0"
    ></iframe>`;

    window.addEventListener('message', this.handleReceivedMessage, false);

    if (saveCodeVerifier) {
      this.saveCodeVerifier(codeVerifier);
    }

    return {
      redirectURI,
      state,
      codeVerifier,
    };
  };

  static hide = () => {
    this.isVisible = false;
    const element = document.getElementById('one-account-one-tap-sign-in');
    element.parentNode.removeChild(element);
  };

  static handleReceivedMessage = (event) => {
    if (event.data === 'removeOneAccountOneTapSignInIframe') {
      this.hide();
    }
  };

  static saveCodeVerifier = (codeVerifier) => {
    this._codeVerifier = this.codeVerifier;
    const expires = new Date();
    expires.setTime(expires.getTime() + 3 * 60 * 60 * 1000);
    document.cookie = `codeVerifier=${codeVerifier}; expires=${expires.toUTCString()};path=/`;
  };

  static get codeVerifier() {
    if (!this._codeVerifier) {
      const name = 'codeVerifier' + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i += 1) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          this._codeVerifier = c.substring(name.length, c.length);
          return this._codeVerifier;
        }
      }
      return '';
    }
    return this._codeVerifier;
  }

  static generateCodeVerifier = (length = 128) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    for (let i = 0; i < length; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  static generateCodeChallenge = async (codeVerifier) => {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
    const base64 = window.btoa(String.fromCharCode(...new Uint8Array(hash)));
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  };
}

export default OneAccountOneTapSignIn;
