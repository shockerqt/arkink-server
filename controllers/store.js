class Store {
  tokens = [];

  addToken(token) {
    this.tokens.push(token);
  }

  getToken(accessToken) {
    return this.tokens.find((token) => token.access_token === accessToken);
  }

}

export const store = new Store();
