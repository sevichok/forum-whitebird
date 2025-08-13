import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminRoute, PrivateRoute } from './components/common';
import { Admin, Home, PostDetail, Profile, SignIn, SignUp } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/posts/:id" element={<PrivateRoute element={<PostDetail />} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/admin"
          element={<AdminRoute element={<Admin />} />}
        />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
