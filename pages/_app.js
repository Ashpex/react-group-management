import Head from "next/head";
import Navbar from "../src/components/navbar";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="keywords" content="titla, meta, nextjs" />
        <meta name="author" content="Syamlal CM" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="google-signin-client_id"
          content="YOUR_CLIENT_ID.apps.googleusercontent.com"
        ></meta>
        <title>Classroom</title>
      </Head>

      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
