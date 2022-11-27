function getGoogleUrl(from) {
  console.log(from);
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
  from = from || "/";
  const options = {
    redirect_uri: "http://localhost:8000/api/sessions/oauth/google",
    client_id:
      "867977518358-r3djdpq4h8mlpiedsrikl0f7v6sk0idi.apps.googleusercontent.com",
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    state: from,
  };
  console.log(options);

  const qs = new URLSearchParams(options);
  console.log(qs);
  return `${rootUrl}?${qs.toString()}`;
}

export default getGoogleUrl;
