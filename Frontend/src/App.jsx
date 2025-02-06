import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Add_User from './components/User/Add_User';
import Dashboard from './components/Dashboards/Dashboard';
import UserDashboard from './components/Dashboards/UserDashboard';
import Edit_User from './components/User/Edit_User';
import Profile from './components/User/Profile';
import AddPost from './components/Post/AddPost';
import EditPost from './components/Post/EditPost';
import ViewPost from './components/Post/ViewPost';
import Products from './components/Product/Products';
import AddProduct from './components/Product/AddProduct';
import Posts from './components/Post/Posts';
import Login from './components/Form/Login';
import Register from './components/Form/Register';
import ProductView from './components/Product/ProductView';
import EditProduct from './components/Product/EditProduct';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }


  const renderDashboard = () => {
    if (role === 'SuperAdmin' || role === 'Admin') {
      return <Dashboard />;
    } else if (role === 'User') {
      return <UserDashboard />;
    }
    return <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? renderDashboard() : <Navigate to="/User/login" />} />
        
        {/* Public Routes */}
        <Route path="/User/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />}/>
        <Route path="/User/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />}/>

        {/* Protected Routes */}
        <Route path="/Adduser" element={isAuthenticated && (role === 'Admin' || role === 'SuperAdmin') ? <Add_User /> : <Navigate to="/User/login" />} />
        <Route path="/view_user/:id" element={isAuthenticated ? <Profile /> : <Navigate to="/User/login" />} />
        <Route path="/Edituser/:id" element={isAuthenticated && (role === 'Admin' || role === 'SuperAdmin') ? <Edit_User /> : <Navigate to="/User/login" />}/>

        {/* Role-based Dashboard */}
        <Route path="/dashboard" element={isAuthenticated && (role === 'Admin' || role === 'SuperAdmin')? <Dashboard /> : <Navigate to="/User/login" />}/>

        {/* User Dashboard */}
        <Route path="/UserDashboard" element={isAuthenticated && role === 'User' ? <UserDashboard /> : <Navigate to="/User/login" />}/>
        {/*  */}
        <Route path="/Posts" element={isAuthenticated && (role === 'Admin' || role === 'SuperAdmin')? <Posts /> : <Navigate to="/User/login" />}/>

        {/* Protected Routes */}
        <Route path="/AddPost" element={isAuthenticated && role === 'User' ? <AddPost /> : <Navigate to="/User/login" />} />
        <Route path="/ViewPost/:id" element={isAuthenticated && (role === 'Admin' || role === 'SuperAdmin' || role === 'User') ? <ViewPost /> : <Navigate to="/User/login" />} />
        <Route path="/EditPost/:id" element={isAuthenticated && role === 'User' ? <EditPost /> : <Navigate to="/User/login" />}/>
        
        {/* Protected Routes of Product */}
        <Route path="/Products" element={isAuthenticated && (role === 'User' || role === 'Admin' || role === 'SuperAdmin')? <Products /> : <Navigate to="/User/login" />}/>
        <Route path="/AddProduct" element={isAuthenticated && role === 'User' ? <AddProduct /> : <Navigate to="/User/login" />} />
        <Route path="/ProductView/:id" element={isAuthenticated && (role === 'Admin' || role === 'SuperAdmin' || role === 'User') ? <ProductView /> : <Navigate to="/User/login" />} />
        <Route path="/EditProduct/:id" element={isAuthenticated && role === 'User' ? <EditProduct /> : <Navigate to="/User/login" />}/>
        
        {/* Catch-All Route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/User/login'} />}/>

      </Routes>
    </Router>
  );
};

export default App;
