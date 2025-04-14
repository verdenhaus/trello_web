import React, { useContext, useState } from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";
import { BoardsContext } from "../context/BoardsProvider";
import { MdDeleteOutline } from "react-icons/md";

const Column = ({ column, boardId, moveTask }) => {
  const { addTask, editColumn, deleteColumn } = useContext(BoardsContext);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);

  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      if (item.columnId !== column.id) {
        moveTask(boardId, item.id, item.columnId, column.id);
      }
    },
  });

  const handleAddTask = () => {
    if (newTaskTitle.trim() === "") return;
    addTask(boardId, column.id, newTaskTitle);
    setNewTaskTitle("");
  };

  const handleEdit = () => {
    if (newTitle.trim() && newTitle !== column.title) {
      editColumn(boardId, column.id, newTitle);
    }
    setIsEditing(false);
  };

  return (
    <div ref={drop} className="column">
      <div className="column-header">
        {isEditing ? (
          <input 
            type="text" 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            onBlur={handleEdit} 
            onKeyDown={(e) => e.key === "Enter" && handleEdit()} 
            autoFocus
          />
        ) : (
          <h3 onDoubleClick={() => setIsEditing(true)}>{column.title}</h3>
        )}
        <div className="new-task">

        <button onClick={() => deleteColumn(boardId, column.id)}> <MdDeleteOutline />
        </button>
        </div>
      </div>
      <div className="new-task">
        <input 
          type="text" 
          placeholder="Новая задача" 
          value={newTaskTitle} 
          onChange={(e) => setNewTaskTitle(e.target.value)} 
        />
        <button onClick={handleAddTask}>+</button>
      </div>
      <div className="tasks-container">
        {column.tasks.map((task) => (
          <Task key={task.id} task={task} columnId={column.id} boardId={boardId} />
        ))}
      </div>
    </div>
  );
};

export default Column;
