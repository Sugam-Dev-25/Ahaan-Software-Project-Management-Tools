import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/app/hook'
import { fetchBoard } from '../../../redux/features/Board/boardSlice'

export const ProjectDetails = () => {
    const [memberEmail, setMemberEmail] = useState("");
    const dispatch = useAppDispatch()
    const board = useAppSelector(state => state.board.boards)


    useEffect(() => {
        dispatch(fetchBoard())
    }, [])
    
    return (
        <div>
            {
                board?.map((b) => {
                    return (
                        <div key={b._id} className='max-w-6xl mx-auto'>
                            <div className='flex px-2 py-3 bg-gray-200 justify-between'>
                                <h2 className='font-bold text-[25px]'>{b.name}</h2>

                                <div className='flex spac-x-2'>
                                    {b.members.map((m: any) => (
                                        <div
                                            key={m._id}
                                            className='w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-sm font-bold'
                                            title={m.name}
                                        >
                                            {m.name[0].toUpperCase()}
                                        </div>

                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
