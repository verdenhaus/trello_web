import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import DashboardPage from './pages/DashboardPage/DashPage';
import Header from './components/Header/Header';
import BoardPage from './pages/BoardPage/BoardPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <div className="app-layout">
          <DashboardPage />
          <div className="main-content">
            <Routes>
              <Route path="/board/:id" element={<BoardPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;