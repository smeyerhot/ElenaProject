import React from 'react'


import Document, { Head, Main, NextScript } from 'next/document'

import Nav from '@/components/nav'

export default class MyDocument extends Document {
  render(): React.ReactElement {
    return (
      <html lang="en">
        
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""/>
          <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
          integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
          crossOrigin=""></script>
          </Head>
          
          
        <body >
          <Nav />
          <div className = "bodyPadding">
          
            <Main />
            <NextScript />
          </div>
        </body>
      </html>
    )
  }
}
