import { BrowserRouter } from 'react-router-dom';
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
import ProviderDashboard from './pages/ProviderDashboard/ProviderDashboard.jsx';
import { Routes, Route, useLocation } from 'react-router-dom';
import Search from './pages/Search/Search.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';

function InnerApp({ userRole }) {
  const location = useLocation();
  const authPaths = ['/login', '/signup'];
  const isAuthRoute = authPaths.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      {userRole !== 'PROVIDER' && !isAuthRoute ? (
        <>
          <Header />
          <Box component="main" sx={{ minHeight: 'calc(100vh - 160px)' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path='/service-providers/:id' element={<ServiceProviderDetails />} />
              <Route path='/service-details/:id' element={<ServiceDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
          <GlobalFooter />
        </>
      ) : (
        <Routes>
        <Route path='/service-provider-dashboard/*' element={<ProviderDashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path='/service-providers/:providerId' element={<ServiceProviderDetails />} />
        <Route path='/service-details/:id' element={<ServiceDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='*' element={<NotFound />} />
        </Routes>
      )}

      <BackToTop />
    </>
  );
}

function App() {
  const userRole = 'PROVIDER';

  return (
    <BrowserRouter>
      <InnerApp userRole={userRole} />
    </BrowserRouter>
  );
}

export default App;
