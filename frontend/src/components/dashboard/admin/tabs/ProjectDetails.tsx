import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/app/hook'
import { addMember, fetchBoard } from '../../../redux/features/Board/boardSlice'
import type { Task } from '../../../types/allType';


import { addColumn, fetchColumn } from '../../../redux/features/Column/columnSlice';
import { DashBoardHeader } from './DashBoardHeader';
import { DashBoardBody } from './DashBoardBody';
import { addTask, fetchTasksForColumn } from '../../../redux/features/Task/taskSlice';
import { useParams } from 'react-router-dom';
import { slugify } from '../../../hooks/slugify';

export const ProjectDetails = () => {
    const { boardSlug } = useParams()
    const dispatch = useAppDispatch()
    const boards = useAppSelector(state => state.board.boards)

    const column = useAppSelector(state => state.column.columns)

    const task = useAppSelector(state => state.task.task)

    const handleAddMember = (boardId: string, memberId: string) => {
        dispatch(addMember({ boardId, memberId }))
    }
    const handaleAddColumn = (boardId: string, name: string) => {
        dispatch(addColumn({ boardId, name }))
    }
    const handaleAddTask = (boardId: string, columnId: string, taskData: Partial<Task>) => {
        dispatch(addTask({ boardId, columnId, taskData }))
    }
    const currentBoard = boards.find(b => slugify(b.name) === boardSlug)


    useEffect(() => {
        dispatch(fetchBoard())
    }, [dispatch])

    useEffect(() => {

        if (currentBoard?._id) {
            dispatch(fetchColumn(currentBoard._id))
        }

    }, [currentBoard, dispatch])
    useEffect(() => {
        if (currentBoard?._id) {
            const boardColumns = column[currentBoard._id] || [];
            boardColumns.forEach(col => {
                if (col._id) {
                    dispatch(fetchTasksForColumn({ boardId: currentBoard._id, columnId: col._id }))
                }
            })
        }
    }, [boards, column, dispatch]);
    if (!currentBoard) return <div>board not found...</div>

    return (
        <div>
            <div className='max-w-6xl mx-auto'>
                <DashBoardHeader
                    id={currentBoard._id}
                    members={currentBoard.members}
                    name={currentBoard.name}
                    onAddMember={handleAddMember}
                />
                <DashBoardBody
                    column={column[currentBoard._id] || []} id={currentBoard._id}
                    onAddColumn={handaleAddColumn}
                    onAddTask={handaleAddTask}
                    task={task}
                />
            </div>
        </div>
    )
}
