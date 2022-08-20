import reducer, {initialState} from "../contexts/reducer";
import {StateProvider} from "../contexts/StateProvider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <Component {...pageProps} />
    </StateProvider>
  );
}

export default MyApp;
