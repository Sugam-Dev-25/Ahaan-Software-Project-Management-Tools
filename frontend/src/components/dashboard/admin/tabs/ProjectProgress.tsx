import { Hourglass } from '@phosphor-icons/react'
import React, { useContext, useEffect, useRef, useState, type MouseEvent } from 'react'
import { BoardContext } from '../../../context/board/BoardContext'
import type { Task } from '../../../types/allType'

interface taskProps{
    task: Task
}
export const ProjectProgress = ({task}:taskProps) => {
    const [percentage, setPercentage] = useState<number>(0)
    const barRef = useRef<HTMLDivElement>(null)

    const taskDetails=useContext(BoardContext)
    if(!taskDetails) return null

    const {updateProgress}=taskDetails
    useEffect(()=>{
        setPercentage(task.progress)
    }, [task.progress])

    const syncWithProgress=(value: number)=>{
        updateProgress(task._id, value)
    }

    const handaleUpdate = (e: MouseEvent<HTMLDivElement>) => {
        if (!barRef.current) return

        const rect = barRef.current.getBoundingClientRect()
        const offSetX = e.clientX - rect.left
        const ttoalWidth = rect.width

        let newPercentage = Math.round((offSetX / ttoalWidth) * 100)
        newPercentage = Math.max(0, Math.min(100, newPercentage))
        setPercentage(newPercentage)
        syncWithProgress(newPercentage)

    }
    return (
        <div className='flex flex-col gap-4 border-t border-gray-200'>
            <div className="flex items-center   text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Hourglass />
                <p className="ml-2">Task Progress :</p>
            </div>
            <div className='flex items-center gap-4'>
                <input type="number" value={percentage} className='p-2 border border-gray-200 max-w-20'
                    onChange={(e) => {
                        const value = Math.min(100, Math.max(0, Number(e.target.value)))
                        setPercentage(value)
                    }}
                     onBlur={()=>syncWithProgress(percentage)}
                    />
                <div className='relative w-64 h-4 bg-gray-200 rounded-full cursor-pointer overflow-hidden shadow-inner'
                    ref={barRef}
                    onClick={handaleUpdate}
                   
                >
                    <div className='h-full bg-blue-300 trastion-all duration-150 ease-out'
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div>
                    Completed: {percentage}
                </div>
            </div>
        </div>
    )
}
