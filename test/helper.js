module.exports = {
  setCookie: (context, events, done) => {
    if (context.vars.access_token) {
      context.vars.session_cookie = `__session=${context.vars.access_token}`;
    }
    return done();
  },
};
