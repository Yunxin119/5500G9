import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ThemeToggle from './components/ThemeToggle';
import Profile from './pages/Profile';
import CoverLetter from './pages/CoverLetter';

function App() {
  const { userInfo } = useSelector((state) => state.authReducer)
  const isLoggedIn = userInfo !== null;
  return (
    
      <div className='w-screen h-screen overflow-y-scroll overflow-x-hidden'>
        <ThemeToggle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={isLoggedIn ? <Home /> : <Login />} />
        <Route path='/register' element={isLoggedIn ? <Home /> : <Register />} />
        <Route path='/dashboard' element={isLoggedIn ? <Dashboard /> : <Login />} />
        <Route path='/profile' element={isLoggedIn ? <Profile /> : <Login />} />
        <Route path='/cover-letter' element={isLoggedIn ? <CoverLetter currentUser={userInfo} /> : <Login />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;