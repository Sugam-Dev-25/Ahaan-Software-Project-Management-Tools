import { type ReactNode, useEffect, useMemo } from "react"
import { BoardContext } from "./BoardContext"
import { useAppDispatch, useAppSelector } from "../redux/app/hook"
import {  useParams, useSearchParams } from "react-router-dom"
import { slugify } from "../hooks/slugify"
import { addMember, fetchBoard } from "../redux/features/Board/boardSlice"
import type { Board, Task } from "../types/allType"
import { addColumn, deleteColumn, fetchColumn } from "../redux/features/Column/columnSlice"
import { addComment, getTasks, clearTasks, deleteTask,  moveTask,  updateTask } from "../redux/features/Task/taskSlice"

interface BoardProviderProps {
  board: Board | null
  loading: boolean
  task:Task[]
  getTaskByColumn: (columnId: string) => Task[]
  addMember: (memberId: string) => void
  addColumn: (name: string) => void
  deleteColumn: (columnId: string) => void
  deleteTask: (taskId: string) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  moveTask: (taskId: string, toColumnId: string, toPosition: number) => void
  addComment: (taskId: string, text: string) => void
  
}


export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch()

  const boards = useAppSelector(state => state.board.boards)
  const tasks = useAppSelector(state => state.task.task)
  const columns = useAppSelector(state => state.column.columns)
const [searchParams]=useSearchParams()
  const isBoardIsLoading = useAppSelector(state => state.board.loading === "pending")
  const isTaskIsLoading = useAppSelector(state => state.task.loading === "pending")
  const globalLoading = isBoardIsLoading || isTaskIsLoading

  const { boardSlug } = useParams<{ boardSlug: string }>()
const currentBoard = useMemo(() => {
    if (boardSlug) {
      // Find the board matching the slug in the URL query
      return boards.find((board) => slugify(board.name) === boardSlug) || null;
    }
    // Remove the default boards[0] if you want a clean state when no board is selected
    return null; 
  }, [boards, boardSlug]);

  // This useEffect will now trigger correctly when the ?name= change
  useEffect(() => {
    if (currentBoard?._id) {
      dispatch(getTasks({ boardId: currentBoard._id }));
      dispatch(fetchColumn(currentBoard._id));
    }
  }, [currentBoard?._id, dispatch]);

useEffect(() => {
  if (boardSlug) {
    dispatch(fetchBoard())
  }
}, [boardSlug, dispatch]);
useEffect(() => {
  // If we are on HomeTab (no boardSlug), fetch tasks for ALL boards
  if (!boardSlug && boards.length > 0) {
    boards.forEach(b => {
      dispatch(fetchColumn(b._id)); // You need the columns to get the tasks
    });
  }
}, [boardSlug, boards, dispatch]);



useEffect(() => {
  if (currentBoard?._id) {
    // Fetch all tasks for the current board (kanban view)
    dispatch(getTasks({ boardId: currentBoard._id }));
  } else {
    // Optional: Fetch all tasks for all boards when no boardSlug is selected (Home view)
    dispatch(getTasks());
  }
}, [currentBoard?._id, dispatch]);

 // Inside BoardProvider.tsx
const getTaskByColumn = (columnId: string) => {
  return tasks.filter(t => {
    const tColId = typeof t.column === 'object' ? (t.column as any)._id : t.column;
    const isRightColumn = tColId?.toString() === columnId.toString();
    const tBoardId = typeof t.board === 'object' ? (t.board as any)._id : t.board;
    const isRightBoard = tBoardId?.toString() === currentBoard?._id?.toString();

    return isRightColumn && isRightBoard;
  });
};
useEffect(() => {
  dispatch(clearTasks());
}, [boardSlug, dispatch]);

  const contextValue: BoardProviderProps = useMemo(() => ({
    board: currentBoard,
    loading: globalLoading,
    task:tasks,
    getTaskByColumn,
    addMember: (memberId: string) => currentBoard && dispatch(addMember({ boardId: currentBoard._id, memberId })),
    addColumn: (name: string) => currentBoard && dispatch(addColumn({ boardId: currentBoard._id, name })),
    deleteColumn: (columnId: string) => currentBoard && dispatch(deleteColumn({ boardId: currentBoard._id, columnId })),
    deleteTask: (taskId: string) => dispatch(deleteTask({ taskId })),
    updateTask: (taskId: string, updates: Partial<Task>) => dispatch(updateTask({ taskId, update: updates })),
    moveTask: (taskId: string, toColumnId: string, toPosition: number) => dispatch(moveTask({ taskId, newColumnId: toColumnId, newPosition: toPosition })),
    addComment: (taskId: string, text: string) => dispatch(addComment({ taskId, text })),
   

  }), [currentBoard, tasks, columns, dispatch, globalLoading])

  return (
    <BoardContext.Provider value={contextValue}>{children}</BoardContext.Provider>
  )
}
