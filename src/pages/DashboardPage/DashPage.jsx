import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BoardsContext } from "../../context/BoardsProvider";

const DashboardPage = () => {
  const { boards, addBoard, deleteBoard } = useContext(BoardsContext);
  const [boardTitle, setBoardTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  

  const handleCreateBoard = () => {
    if (boardTitle.trim() === "") return;
    addBoard(boardTitle);
    setBoardTitle("");
    setShowForm(false); 
  };

  return (
    <div className="dashboard">
      <h1>Мои доски</h1>
      <div className="board-list">
        {boards.map((board) => (
          <div key={board.id} className="board-card">
            <h3 onClick={() => navigate(`/board/${board.id}`)}>{board.title}</h3>
            <button onClick={() => deleteBoard(board.id, navigate)}>Удалить</button>
          </div>
        ))}
      </div>

      {!showForm ? (
        <div className="new-board">
        <button className= ''onClick={() => setShowForm(true)}>Создать доску</button>
        </div>
      ) : (
        <div className="new-board">
          <input
            type="text"
            placeholder="Название доски"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
          />
          <div className="buttons">
          <button onClick={() => setShowForm(false)}>Отмена</button>
            <button onClick={handleCreateBoard}>Создать</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
