import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { BoardsContext } from "../../context/BoardsProvider";
import Column from "../../components/Column";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const BoardPage = () => {
  const { id } = useParams();
  const { boards, addColumn, moveTask, editBoardTitle} = useContext(BoardsContext);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const board = boards.find((b) => b.id === Number(id));

  if (!board) return <p>Загрузка...</p>;

  const startEditing = () => {
    setNewTitle(board.title);
    setIsEditing(true);
  };

  const handleEditBoardTitle = () => {
    if (newTitle.trim() && newTitle !== board.title) {
      editBoardTitle(board.id, newTitle);
    }
    setIsEditing(false);
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim() === "") return;
    addColumn(board.id, newColumnTitle);
    setNewColumnTitle("");
  };


  return (
    <DndProvider backend={HTML5Backend}>
        <div className="board-page">
          {isEditing ? (
           <div className="board-local">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
                <button onClick={handleEditBoardTitle}>Сохранить</button>
                </div>
          ) : (
            <div className="board-local">
              <h1>{board.title}</h1>
              <button onClick={startEditing}>Изменить</button>
              </div>
           
          )}
        </div>

        <div className="new-column">
          <input
            type="text"
            placeholder="Название колонки"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
          />
          <button onClick={handleAddColumn}>Добавить колонку</button>
        </div>
        <div className="columns-container">
          <div className="columns">
            {board.columns.map((column) => (
              <Column key={column.id} column={column} boardId={board.id} moveTask={moveTask}  />
            ))}
          </div>
        </div>
    </DndProvider>
  );
};

export default BoardPage;
