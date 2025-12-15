import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/app/hook'
import { addMember, fetchBoard } from '../../../redux/features/Board/boardSlice'



import { addColumn, fetchColumn } from '../../../redux/features/Column/columnSlice';
import { DashBoardHeader } from './DashBoardHeader';
import { DasBoardBody } from './DashBoardBody';

export const ProjectDetails = () => {

    const dispatch = useAppDispatch()
    const boards = useAppSelector(state => state.board.boards)

    const column = useAppSelector(state => state.column.columns)

    const handleAddMember = (boardId: string, memberId: string) => {
        dispatch(addMember({ boardId, memberId }))

    }
    const handaleAddColumn = (boardId: string, name: string) => {
        dispatch(addColumn({ boardId, name }))
    }

    useEffect(() => {
        dispatch(fetchBoard())
    }, [dispatch])

    useEffect(() => {
        if (boards?.length) {
            boards.forEach(board => {
                if (board._id) {
                    dispatch(fetchColumn(board._id))
                }
            })
        }
    }, [boards, dispatch])
    return (
        <div>
            {
                boards?.map((b) => {
                    return (
                        <div key={b._id} className='max-w-6xl mx-auto'>

                            <DashBoardHeader
                                id={b._id}
                                members={b.members}
                                name={b.name}
                                onAddMember={handleAddMember}
                            />
                            <DasBoardBody 
                            column={column[b._id] || []} id={b._id} 
                            onAddColumn={handaleAddColumn} 
                            />

                        </div>
                    )
                })
            }
        </div>
    )
}
