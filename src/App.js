import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Offer from './pages/Offer';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from './components/PrivateRoute';
import CreateList from './pages/CreateList';
import EditListing from './pages/EditListing';
import CategoryListing from './pages/CategoryListing';

function App() {
  return (
    <div className='mt-10'>
      <BrowserRouter>

        <Header />

        <Routes>
          <Route index path="/" element={<Home />} />

          <Route
            path="/profile"
            element={<PrivateRoute />}
          >
            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>

          <Route path="/offer" element={<Offer />} />

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/forgotpassword" element={<ForgotPassword />} />


          <Route
            path="/createlist"
            element={<PrivateRoute />}
          >

            <Route path="/createlist" element={<CreateList />} />


          </Route>

          <Route
            path="/editlisting/:id"
            element={<PrivateRoute />}
          >

            <Route path="/editlisting/:id" element={<EditListing />} />


          </Route>


          <Route path="/category/:categoryName/:id" element={<CategoryListing />} />









        </Routes>
      </BrowserRouter>
      <ToastContainer theme='colored' position='bottom-center' />
    </div>
  );
}

export default App;
