import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardsProvider from "./context/BoardsProvider";

import DashboardPage from "./pages/DashboardPage/DashPage";

import Header from "./components/Header/Header";
import BoardPage from "./pages/BoardPage/BoardPage";

function App() {
  return (
    <Router> 
        <BoardsProvider>
          <Header/>
          <div className="app-layout">
            <DashboardPage /> 
            <div className="main-content">
              <Routes>
                <Route path="/board/:id" element={<BoardPage />} />
              </Routes>
            </div>
        </div>
        </BoardsProvider>
    </Router>
  );
}

export default App;
