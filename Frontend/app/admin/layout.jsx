import "@styles/globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const RootLayout = ({ children }) => (
  <html lang='en'>
    <body>
        <main className='app'>
          {children}
        </main>
        <ToastContainer />
    </body>
  </html>
);

export default RootLayout;