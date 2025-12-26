import { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import Header from './components/GlobalHeader/Header';
import GlobalFooter from './components/GlobalFooter/GlobalFooter';
import BackToTop from './components/BackToTop/BackToTop';
import { Routes, Route, useLocation } from 'react-router-dom';

// Lazy load page components for code splitting
const HomePage = lazy(() => import('./pages/Home/HomePage.jsx'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage.jsx'));
const Login = lazy(() => import('./pages/Login/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup/Signup.jsx'));
const ServiceProviderDetails = lazy(() => import('./pages/ServiceProviderDetails/ServiceProviderDetails.jsx'));
const ServiceDetails = lazy(() => import('./pages/ServiceDetails/ServiceDetails.jsx'));
const Cart = lazy(() => import('./pages/Cart/Cart.jsx'));
const ProviderDashboard = lazy(() => import('./pages/ProviderDashboard/ProviderDashboard.jsx'));
const Search = lazy(() => import('./pages/Search/Search.jsx'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound.jsx'));
const Contact = lazy(() => import('./pages/Contact/Contact.jsx'));

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
    <CircularProgress />
  </Box>
);

function InnerApp({ userRole }) {
  const location = useLocation();
  const authPaths = ['/login', '/signup'];
  const isAuthRoute = authPaths.includes(location.pathname);

  return (
    <>
      {!isAuthRoute && (
        <>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Suspense>

          {userRole !== 'PROVIDER' ? (
            <>
              <Header />
              <Box component="main" sx={{ minHeight: 'calc(100vh - 160px)' }}>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path='/service-providers/:id' element={<ServiceProviderDetails />} />
                    <Route path="/search" element={<Search />} />
                    <Route path='/service-details/:id' element={<ServiceDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Box>
              <GlobalFooter />
            </>
          ) : (
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path='/service-provider-dashboard/*' element={<ProviderDashboard />} />
                <Route path="/search" element={<Search />} />
                <Route path='/service-providers/:providerId' element={<ServiceProviderDetails />} />
                <Route path='/service-details/:id' element={<ServiceDetails />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Suspense>
          )}
        </>
      )}

      {isAuthRoute && (
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Suspense>
      )}

      <BackToTop />
    </>
  );
}

function App() {
  const userProfile = useSelector((state) => state.user?.profile);
  const providerProfile = useSelector((state) => state.provider?.profile);

  const userRole = providerProfile?.providerId
    ? 'PROVIDER'
    : userProfile?.role || 'USER';

  return (
    <BrowserRouter>
      <InnerApp userRole={userRole} />
    </BrowserRouter>
  );
}

export default App;
