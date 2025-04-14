import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import DashboardPage from './pages/DashboardPage/DashPage';
import Header from './components/Header/Header';
import BoardPage from './pages/BoardPage/BoardPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';

function MainApp() {
  const user = useSelector(state => state.boards.user);

  if (!user) {
    return (
      <>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      </>
    );
 
  }

  return (
    <>
      <Header />
      <div className="app-layout">
        <DashboardPage/>
        <div className="main-content">
          <Routes>
              <Route path="/board/:id" element={<BoardPage />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <MainApp />
      </Router>
    </Provider>
  );
}

export default App;