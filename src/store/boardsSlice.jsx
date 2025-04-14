import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async () => {
  const res = await fetch('http://localhost:8080/boards');
  return res.json();
});

export const addBoard = createAsyncThunk('boards/addBoard', async (title) => {
  const newBoard = { id: Date.now(), title, columns: [] };
  await fetch('http://localhost:8080/boards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBoard),
  });
  return newBoard;
});

export const deleteBoard = createAsyncThunk('boards/deleteBoard', async (id) => {
  await fetch(`http://localhost:8080/boards/${id}`, { method: 'DELETE' });
  return id;
});

export const addColumn = createAsyncThunk('boards/addColumn', async ({ boardId, columnTitle }) => {
  const res = await fetch(`http://localhost:8080/boards/${boardId}`);
  const board = await res.json();
  if (board.columns.length >= 6) throw new Error('Max columns reached');
  const newColumn = { id: Date.now(), title: columnTitle, tasks: [] };
  const updatedBoard = { ...board, columns: [...board.columns, newColumn] };
  await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, newColumn };
});

export const editColumn = createAsyncThunk('boards/editColumn', async ({ boardId, columnId, newTitle }) => {
  const res = await fetch(`http://localhost:8080/boards/${boardId}`);
  const board = await res.json();
  const updatedColumns = board.columns.map(col => (col.id === columnId ? { ...col, title: newTitle } : col));
  const updatedBoard = { ...board, columns: updatedColumns };
  await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, columnId, newTitle };
});

export const deleteColumn = createAsyncThunk('boards/deleteColumn', async ({ boardId, columnId }) => {
  const res = await fetch(`http://localhost:8080/boards/${boardId}`);
  const board = await res.json();
  const updatedColumns = board.columns.filter(col => col.id !== columnId);
  const updatedBoard = { ...board, columns: updatedColumns };
  await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, columnId };
});

export const addTask = createAsyncThunk('boards/addTask', async ({ boardId, columnId, taskTitle }) => {
  const res = await fetch(`http://localhost:8080/boards/${boardId}`);
  const board = await res.json();
  const updatedColumns = board.columns.map(col =>
    col.id === columnId
      ? { ...col, tasks: [...col.tasks, { id: Date.now(), title: taskTitle, completed: false }] }
      : col
  );
  const updatedBoard = { ...board, columns: updatedColumns };
  await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, columnId, task: { id: Date.now(), title: taskTitle, completed: false } };
});

export const editTask = createAsyncThunk('boards/editTask', async ({ boardId, columnId, taskId, newTitle }) => {
  const res = await fetch(`http://localhost:8080/boards/${boardId}`);
  const board = await res.json();
  const updatedColumns = board.columns.map(col =>
    col.id === columnId
      ? { ...col, tasks: col.tasks.map(task => (task.id === taskId ? { ...task, title: newTitle } : task)) }
      : col
  );
  const updatedBoard = { ...board, columns: updatedColumns };
  await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, columnId, taskId, newTitle };
});

export const deleteTask = createAsyncThunk('boards/deleteTask', async ({ boardId, columnId, taskId }) => {
  const res = await fetch(`http://localhost:8080/boards/${boardId}`);
  const board = await res.json();
  const updatedColumns = board.columns.map(col =>
    col.id === columnId ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) } : col
  );
  const updatedBoard = { ...board, columns: updatedColumns };
  await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, columnId, taskId };
});

export const moveTask = createAsyncThunk('boards/moveTask', async ({ boardId, taskId, sourceColumnId, newColumnId }) => {
  const res = await fetch(`http://localhost:8080/boards/${boardId}`);
  const board = await res.json();
  const sourceColumn = board.columns.find(col => col.id === sourceColumnId);
  const task = sourceColumn.tasks.find(t => t.id === taskId);
  const updatedColumns = board.columns.map(col => {
    if (col.id === sourceColumnId) return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
    if (col.id === newColumnId) return { ...col, tasks: [...col.tasks, task] };
    return col;
  });
  const updatedBoard = { ...board, columns: updatedColumns };
  await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, taskId, sourceColumnId, newColumnId };
});

export const editBoardTitle = createAsyncThunk('boards/editBoardTitle', async ({ boardId, newTitle }) => {
  const res = await fetch(`http://localhost:8080/boards/${boardId}`);
  const board = await res.json();
  const updatedBoard = { ...board, title: newTitle };
  await fetch(`http://localhost:8080/boards/${boardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, newTitle };
});

export const toggleTaskCompletion = createAsyncThunk('boards/toggleTaskCompletion', async ({ boardId, columnId, taskId }) => {
  const res = await fetch(`http://localhost:8080/boards/${boardId}`);
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBoard),
  });
  return { boardId, columnId, taskId };
});

const boardsSlice = createSlice({
  name: 'boards',
  initialState: {
    boards: [],
    theme: localStorage.getItem('theme') || 'light',
    status: 'idle',
    error: null,
  },
  reducers: {
    toggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      document.body.setAttribute('data-theme', state.theme);
    },
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

export const { toggleTheme } = boardsSlice.actions;
export default boardsSlice.reducer;