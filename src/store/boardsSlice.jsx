import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async (_, { getState }) => {
  const { user } = getState().boards;
  if (!user) throw new Error('User not authenticated');
  const res = await fetch(`http://localhost:8080/boards?userId=${user.id}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch boards');
  const boards = await res.json();
  return boards.map(board => ({
    ...board,
    columns: Array.isArray(board.columns)
      ? board.columns.map(column => ({
          ...column,
          tasks: Array.isArray(column.tasks) ? column.tasks.filter(task => task && task.id) : []
        }))
      : []
  }));
});

export const addBoard = createAsyncThunk('boards/addBoard', async (title, { getState }) => {
  const { user } = getState().boards;
  const newBoard = {
    id: Date.now(),
    title,
    columns: [],
    userId: user.id
  };
  const res = await fetch('http://localhost:8080/boards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newBoard),
  });
  if (!res.ok) throw new Error('Failed to create board');
  const createdBoard = await res.json();
  return {
    ...createdBoard,
    columns: Array.isArray(createdBoard.columns) ? createdBoard.columns : []
  };
});
export const deleteBoard = createAsyncThunk('boards/deleteBoard', async (id, { getState }) => {
  const { user } = getState().boards;
  await fetch(`http://localhost:8080/boards/${id}`, { 
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${user.accessToken}`
    }
  });
  return id;
});

export const addColumn = createAsyncThunk('boards/addColumn', async ({ boardId, columnTitle }, { getState }) => {
  const { user } = getState().boards;
  const res = await fetch(`http://localhost:8080/boards/${boardId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch board');
  const board = await res.json();
  if ((board.columns || []).length >= 6) throw new Error('Max columns reached');
  const newColumn = { id: Date.now(), title: columnTitle, tasks: [] };
  const updatedBoard = { ...board, columns: [...(board.columns || []), newColumn] };
  const updateRes = await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedBoard),
  });
  if (!updateRes.ok) throw new Error('Failed to update board');
  return { boardId, newColumn };
});

export const editColumn = createAsyncThunk('boards/editColumn', async ({ boardId, columnId, newTitle }, { getState }) => {
  const { user } = getState().boards;
  const res = await fetch(`http://localhost:8080/boards/${boardId}`, {
    headers: {
      'Authorization': `Bearer ${user.accessToken}`
    }
  });
  const board = await res.json();
  const updatedColumns = board.columns.map(col => (col.id === columnId ? { ...col, title: newTitle } : col));
  const updatedBoard = { ...board, columns: updatedColumns };
  await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.accessToken}`
    },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, columnId, newTitle };
});

export const deleteColumn = createAsyncThunk('boards/deleteColumn', async ({ boardId, columnId }, { getState }) => {
  const { user } = getState().boards;
  const res = await fetch(`http://localhost:8080/boards/${boardId}`, {
    headers: {
      'Authorization': `Bearer ${user.accessToken}`
    }
  });
  const board = await res.json();
  const updatedColumns = board.columns.filter(col => col.id !== columnId);
  const updatedBoard = { ...board, columns: updatedColumns };
  await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.accessToken}`
    },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, columnId };
});

export const addTask = createAsyncThunk('boards/addTask', async ({ boardId, columnId, taskTitle }, { getState }) => {
  const { user } = getState().boards;
  const res = await fetch(`http://localhost:8080/boards/${boardId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch board');
  const board = await res.json();
  const updatedColumns = (board.columns || []).map(col =>
    col.id === columnId
      ? { ...col, tasks: [...(Array.isArray(col.tasks) ? col.tasks : []), { id: Date.now(), title: taskTitle, completed: false }] }
      : col
  );
  const updatedBoard = { ...board, columns: updatedColumns };
  const updateRes = await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedBoard),
  });
  if (!updateRes.ok) throw new Error('Failed to update board');
  return { boardId, columnId, task: { id: Date.now(), title: taskTitle, completed: false } };
});

export const editTask = createAsyncThunk('boards/editTask', async ({ boardId, columnId, taskId, newTitle }, { getState }) => {
  const { user } = getState().boards;
  const res = await fetch(`http://localhost:8080/boards/${boardId}`, {
    headers: {
      'Authorization': `Bearer ${user.accessToken}`
    }
  });
  const board = await res.json();
  const updatedColumns = board.columns.map(col =>
    col.id === columnId
      ? { ...col, tasks: col.tasks.map(task => (task.id === taskId ? { ...task, title: newTitle } : task)) }
      : col
  );
  const updatedBoard = { ...board, columns: updatedColumns };
  await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.accessToken}`
    },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, columnId, taskId, newTitle };
});

export const deleteTask = createAsyncThunk('boards/deleteTask', async ({ boardId, columnId, taskId }, { getState }) => {
  const { user } = getState().boards;
  const res = await fetch(`http://localhost:8080/boards/${boardId}`, {
    headers: {
      'Authorization': `Bearer ${user.accessToken}`
    }
  });
  const board = await res.json();
  const updatedColumns = board.columns.map(col =>
    col.id === columnId ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) } : col
  );
  const updatedBoard = { ...board, columns: updatedColumns };
  await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.accessToken}`
    },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, columnId, taskId };
});

export const moveTask = createAsyncThunk('boards/moveTask', async ({ boardId, taskId, sourceColumnId, newColumnId }, { getState }) => {
  const { user } = getState().boards;
  const res = await fetch(`http://localhost:8080/boards/${boardId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch board');
  const board = await res.json();
  const sourceColumn = (board.columns || []).find(col => col.id === sourceColumnId);
  const task = (sourceColumn.tasks || []).find(t => t.id === taskId);
  if (!task) throw new Error('Task not found');
  const updatedColumns = (board.columns || []).map(col => {
    if (col.id === sourceColumnId) return { ...col, tasks: (col.tasks || []).filter(t => t.id !== taskId) };
    if (col.id === newColumnId) return { ...col, tasks: [...(Array.isArray(col.tasks) ? col.tasks : []), task] };
    return col;
  });
  const updatedBoard = { ...board, columns: updatedColumns };
  const updateRes = await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedBoard),
  });
  if (!updateRes.ok) throw new Error('Failed to update board');
  return { boardId, taskId, sourceColumnId, newColumnId };
})

export const editBoardTitle = createAsyncThunk('boards/editBoardTitle', async ({ boardId, newTitle }, { getState }) => {
  const { user } = getState().boards;
  const res = await fetch(`http://localhost:8080/boards/${boardId}`, {
    headers: {
      'Authorization': `Bearer ${user.accessToken}`
    }
  });
  const board = await res.json();
  const updatedBoard = { ...board, title: newTitle };
  await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.accessToken}`
    },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, newTitle };
});

export const toggleTaskCompletion = createAsyncThunk('boards/toggleTaskCompletion', async ({ boardId, columnId, taskId }, { getState }) => {
  const { user } = getState().boards;
  const res = await fetch(`http://localhost:8080/boards/${boardId}`, {
    headers: {
      'Authorization': `Bearer ${user.accessToken}`
    }
  });
  const board = await res.json();
  const updatedColumns = board.columns.map(col =>
    col.id === columnId
      ? {
          ...col,
          tasks: col.tasks.map(task => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
        }
      : col
  );
  const updatedBoard = { ...board, columns: updatedColumns };
  await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.accessToken}`
    },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, columnId, taskId };
});

export const reorderColumn = createAsyncThunk('boards/reorderColumn', async ({ boardId, sourceIndex, destinationIndex }, { getState }) => {
  const { user } = getState().boards;
  const res = await fetch(`http://localhost:8080/boards/${boardId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch board');
  const board = await res.json();
  const columns = [...(Array.isArray(board.columns) ? board.columns : [])];
  const [movedColumn] = columns.splice(sourceIndex, 1);
  columns.splice(destinationIndex, 0, movedColumn);
  const updatedBoard = { ...board, columns };
  const updateRes = await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedBoard),
  });
  if (!updateRes.ok) throw new Error('Failed to update board');
  return { boardId, columns };
});

const boardsSlice = createSlice({
  name: 'boards',
  initialState: {
    boards: [],
    theme: localStorage.getItem('theme') || 'light',
    status: 'idle',
    error: null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  },
  reducers: {
    toggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      document.body.setAttribute('data-theme', state.theme);
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearBoards: (state) => {
      state.boards = [];
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBoards.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload);
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter(board => board.id !== action.payload);
      })
      .addCase(addColumn.fulfilled, (state, action) => {
        const { boardId, newColumn } = action.payload;
        const board = state.boards.find(b => b.id === boardId);
        if (board) board.columns.push(newColumn);
      })
      .addCase(editColumn.fulfilled, (state, action) => {
        const { boardId, columnId, newTitle } = action.payload;
        const board = state.boards.find(b => b.id === boardId);
        if (board) {
          const column = board.columns.find(col => col.id === columnId);
          if (column) column.title = newTitle;
        }
      })
      .addCase(deleteColumn.fulfilled, (state, action) => {
        const { boardId, columnId } = action.payload;
        const board = state.boards.find(b => b.id === boardId);
        if (board) {
          board.columns = board.columns.filter(col => col.id !== columnId);
        }
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const { boardId, columnId, task } = action.payload;
        const board = state.boards.find(b => b.id === boardId);
        if (board) {
          const column = board.columns.find(col => col.id === columnId);
          if (column) column.tasks.push(task);
        }
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const { boardId, columnId, taskId, newTitle } = action.payload;
        const board = state.boards.find(b => b.id === boardId);
        if (board) {
          const column = board.columns.find(col => col.id === columnId);
          if (column) {
            const task = column.tasks.find(task => task.id === taskId);
            if (task) task.title = newTitle;
          }
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const { boardId, columnId, taskId } = action.payload;
        const board = state.boards.find(b => b.id === boardId);
        if (board) {
          const column = board.columns.find(col => col.id === columnId);
          if (column) {
            column.tasks = column.tasks.filter(task => task.id !== taskId);
          }
        }
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        const { boardId, taskId, sourceColumnId, newColumnId } = action.payload;
        const board = state.boards.find(b => b.id === boardId);
        if (board) {
          const sourceColumn = board.columns.find(col => col.id === sourceColumnId);
          const targetColumn = board.columns.find(col => col.id === newColumnId);
          const task = sourceColumn.tasks.find(t => t.id === taskId);
          sourceColumn.tasks = sourceColumn.tasks.filter(t => t.id !== taskId);
          targetColumn.tasks.push(task);
        }
      })
      .addCase(editBoardTitle.fulfilled, (state, action) => {
        const { boardId, newTitle } = action.payload;
        const board = state.boards.find(b => b.id === boardId);
        if (board) board.title = newTitle;
      })
      .addCase(reorderColumn.fulfilled, (state, action) => {
        const { boardId, columns } = action.payload;
        const board = state.boards.find(b => b.id === boardId);
        if (board) {
          board.columns = columns;
        }
      })
      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        const { boardId, columnId, taskId } = action.payload;
        const board = state.boards.find(b => b.id === boardId);
        if (board) {
          const column = board.columns.find(col => col.id === columnId);
          if (column) {
            const task = column.tasks.find(task => task.id === taskId);
            if (task) task.completed = !task.completed;
          }
        }
      });
  },
});

export const { toggleTheme, setUser, clearBoards } = boardsSlice.actions;
export default boardsSlice.reducer;