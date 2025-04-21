import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Task from './Task';
import { useDispatch } from 'react-redux';
import { addTask, editColumn, deleteColumn } from '../store/boardsSlice';
import { MdDeleteOutline } from 'react-icons/md';

const Column = ({ column, boardId, moveTask, index, onDropColumn }) => {
  const dispatch = useDispatch();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);

  const [{ isDragging }, drag] = useDrag({
    type: 'COLUMN',
    item: { id: column.id, index, boardId, type: 'COLUMN' },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ['TASK', 'COLUMN'],
    drop: item => {
      if (item.type === 'TASK' && item.columnId !== column.id) {
        dispatch(moveTask({ boardId, taskId: item.id, sourceColumnId: item.columnId, newColumnId: column.id }));
      } else if (item.type === 'COLUMN' && item.id !== column.id) {
        onDropColumn(item.index, index);
      }
    },
  });

  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') return;
    dispatch(addTask({ boardId, columnId: column.id, taskTitle: newTaskTitle }));
    setNewTaskTitle('');
  };

  const handleEdit = () => {
    if (newTitle.trim() && newTitle !== column.title) {
      dispatch(editColumn({ boardId, columnId: column.id, newTitle }));
    }
    setIsEditing(false);
  };

  return (
    <div ref={node => drag(drop(node))} className={`column ${isDragging ? 'column--dragging' : ''}`}>
      <div className="column-header">
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
          <h3 onDoubleClick={() => setIsEditing(true)}>{column.title}</h3>
        )}
        <div className="new-task">
          <button onClick={() => dispatch(deleteColumn({ boardId, columnId: column.id }))}>
            <MdDeleteOutline />
          </button>
        </div>
      </div>
      <div className="new-task">
        <input
          type="text"
          placeholder="Новая задача"
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
        />
        <button onClick={handleAddTask}>+</button>
      </div>
      <div className="tasks-container">
        {Array.isArray(column.tasks) && column.tasks.length > 0 ? (
          column.tasks
            .filter(task => task && task.id)
            .map(task => (
              <Task key={task.id} task={task} columnId={column.id} boardId={boardId} />
            ))
        ) : (
          <p>Нет задач</p>
        )}
      </div>
    </div>
  );
};

export default Column;