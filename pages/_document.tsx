import { Head, Html, Main, NextScript } from "next/document";


export default function CustomDocument(){
  return (
    <Html>
      <Head />
      <body className="dark-theme">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}