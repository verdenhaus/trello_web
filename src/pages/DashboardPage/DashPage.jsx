import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBoards, addBoard, deleteBoard } from '../../store/boardsSlice';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { boards, status, user } = useSelector(state => state.boards);
  const [boardTitle, setBoardTitle] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(fetchBoards());
    } else {
      navigate('/login');
    }
  }, [user, dispatch, navigate]);

  const handleCreateBoard = () => {
    if (boardTitle.trim() === '') return;
    dispatch(addBoard(boardTitle));
    setBoardTitle('');
    setShowForm(false);
  };

  if (status === 'loading') {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Мои доски</h1>
      <div className="board-list">
        {boards.map(board => (
          <div key={board.id} className="board-card">
            <h3 onClick={() => navigate(`/board/${board.id}`)}>{board.title}</h3>
            <button onClick={() => dispatch(deleteBoard(board.id))}>Удалить</button>
          </div>
        ))}
      </div>

      {!showForm ? (
        <div className="new-board">
          <button onClick={() => setShowForm(true)}>Создать доску</button>
        </div>
      ) : (
        <div className="new-board">
          <input
            type="text"
            placeholder="Название доски"
            value={boardTitle}
            onChange={e => setBoardTitle(e.target.value)}
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