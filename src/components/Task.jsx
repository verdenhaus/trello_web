import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { editTask, deleteTask, toggleTaskCompletion } from '../store/boardsSlice';
import { MdDeleteOutline } from 'react-icons/md';

const Task = ({ task, columnId, boardId }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, columnId, boardId, type: 'TASK' },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleEdit = () => {
    if (!newTitle.trim()) {
      setNewTitle(task.title);
    } else if (newTitle !== task.title) {
      dispatch(editTask({ boardId, columnId, taskId: task.id, newTitle }));
    }
    setIsEditing(false);
  };

  return (
    <div ref={drag} className={`task ${isDragging ? 'task--dragging' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => dispatch(toggleTaskCompletion({ boardId, columnId, taskId: task.id }))}
      />
      {isEditing ? (
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={e => e.key === 'Enter' && handleEdit()}
          autoFocus
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          className={`task__text ${task.completed ? 'task__text--completed' : ''}`}
        >
          {task.title}
        </span>
      )}
      <div className="new-task">
        <button className="task__delete" onClick={() => dispatch(deleteTask({ boardId, columnId, taskId: task.id }))}>
          <MdDeleteOutline />
        </button>
      </div>
    </div>
  );
};

export default Task;