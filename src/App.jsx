import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/GlobalHeader/Header';
import HomePage from './pages/Home/HomePage.jsx';
import GlobalFooter from './components/GlobalFooter/GlobalFooter';
import BackToTop from './components/BackToTop/BackToTop';
import Login from './pages/Login/Login.jsx';
import Signup from './pages/Signup/Signup.jsx';
import ServiceProviderDetails from './pages/ServiceProviderDetails/ServiceProviderDetails.jsx';
import ServiceDetails from './pages/ServiceDetails/ServiceDetails.jsx';
import Cart from './pages/Cart/Cart.jsx';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Box component="main" sx={{ minHeight: 'calc(100vh - 160px)' }}>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/service-providers/:id' element={<ServiceProviderDetails />} />
        <Route path='/service-details/:id' element={<ServiceDetails />} />
        <Route path="/cart" element={<Cart />} />
        </Routes>
      </Box>
      <GlobalFooter />
      <BackToTop />
    </BrowserRouter>
  );
}

export default App;
