import Head from "next/head";
import Navbar from "../src/components/NavbarComponent";
import { SessionProvider } from "next-auth/react";

import "../styles/globals.css";
import MenuProvider from "../src/provider/MenuProvider";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="keywords" content="titla, meta, nextjs" />
        <meta name="author" content="Syamlal CM" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Classroom</title>
      </Head>

      <SessionProvider session={pageProps.session}>
        {pageProps.session && <Navbar />}
        <MenuProvider>
          <Component {...pageProps} />
        </MenuProvider>
      </SessionProvider>
    </div>
  );
}

export default MyApp;
