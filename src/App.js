import './App.css';
import {BrowserRouter } from 'react-router-dom'
import NavBar from './components/Reusable/Navbar/Navbar';
import Footer from './components/Reusable/Footer/Footer';
import { AuthProvider } from './utils/AuthService/AuthContext';
import AnimatedRoutes from './utils/animations/AnimatedRoutes';
import history from './utils/Routes/History';
import "./utils/animations/globalAnimate.css"
import { Container } from 'react-bootstrap';


function App() {
  
  return (
    <BrowserRouter history={history}>
      <AuthProvider>
          <AnimatedRoutes/>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
