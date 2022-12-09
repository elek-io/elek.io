import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { BaseLayout } from 'ui';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BaseLayout>
      <Component {...pageProps} />
    </BaseLayout>
  );
}

export default MyApp;
