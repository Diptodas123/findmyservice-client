import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/GlobalHeader/Header';
import HomePage from './pages/Home/HomePage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import GlobalFooter from './components/GlobalFooter/GlobalFooter';
import BackToTop from './components/BackToTop/BackToTop';
import Login from './pages/Login/Login.jsx';
import Signup from './pages/Signup/Signup.jsx';
import ServiceProviderDetails from './pages/ServiceProviderDetails/ServiceProviderDetails.jsx';
import ServiceDetails from './pages/ServiceDetails/ServiceDetails.jsx';
import Cart from './pages/Cart/Cart.jsx';
import Search from './pages/Search/Search.jsx';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Box component="main" sx={{ minHeight: 'calc(100vh - 160px)' }}>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path='/service-providers/:providerId' element={<ServiceProviderDetails />} />
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
