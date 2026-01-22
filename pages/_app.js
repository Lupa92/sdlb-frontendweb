import '../styles/globals.css';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from '../reducers/user';
import feedback from '../reducers/feedback';
import Toast from '../components/Toast';

const store = configureStore({
  reducer: { user, feedback },
});

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Show dans la baie </title>
      </Head>
      <Toast></Toast>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
