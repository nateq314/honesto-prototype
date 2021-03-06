import Document, { Head, Main, NextDocumentContext, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

interface DocumentProps {
  styleTags: Array<React.ReactElement<{}>>;
}

export default class MyDocument extends Document<DocumentProps> {
  public static async getInitialProps({ renderPage }: NextDocumentContext) {
    const sheet = new ServerStyleSheet();

    const page = renderPage((App) => (props) => sheet.collectStyles(<App {...props} />));

    const styleTags = sheet.getStyleElement();

    return { ...page, styleTags };
  }

  public render() {
    return (
      <html>
        <Head>
          <link rel="icon" href="/static/th64.png" key="favicon" />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
