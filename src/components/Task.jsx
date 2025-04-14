import React, { useState, useContext } from "react";
import { useDrag } from "react-dnd";
import { BoardsContext } from "../context/BoardsProvider";
import { MdDeleteOutline } from "react-icons/md";

const Task = ({ task, columnId, boardId }) => {
  const { editTask, deleteTask, toggleTaskCompletion } = useContext(BoardsContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, columnId, boardId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleEdit = () => {
    if (!newTitle.trim()) {
      setNewTitle(task.title);
    } else if (newTitle !== task.title) {
      editTask(boardId, columnId, task.id, newTitle);
    }
    setIsEditing(false);
  };

  return (
    <div ref={drag} className={`task ${isDragging ? "task--dragging" : ""}`}>
      <input 
        type="checkbox" 
        checked={task.completed} 
        onChange={() => toggleTaskCompletion(boardId, columnId, task.id)} 
      />
      
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
        <span 
          onDoubleClick={() => setIsEditing(true)} 
          className={`task__text ${task.completed ? "task__text--completed" : ""}`}
        >
          {task.title}
        </span>
      )}
      <div className="new-task">
      <button className="task__delete" onClick={() => deleteTask(boardId, columnId, task.id)}><MdDeleteOutline /></button>
      </div>
    </div>
  );
};

export default Task;
