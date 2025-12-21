import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'
import store from './store/index.js'
import { setupAxiosInterceptors } from './services/authService.js'
import { initializeI18n } from './i18n/config.js';
import './index.css'

setupAxiosInterceptors();
initializeI18n().then((i18n) => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </I18nextProvider>
      </Provider>
    </React.StrictMode>,
  )
});