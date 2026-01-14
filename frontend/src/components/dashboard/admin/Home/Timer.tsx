import { useState, useEffect } from "react";
import { useAppDispatch } from "../../../redux/app/hook";
import { toggleTimer } from "../../../redux/features/Task/taskSlice";
import { Play, Pause } from "@phosphor-icons/react";

interface TimerProps {
    taskId: string;
    timeData?: {
        isRunning: boolean;
        activeStartTime: string | null;
        totalLoggedTime: number;
    };
}

export const Timer = ({ taskId, timeData }: TimerProps) => {
    const dispatch = useAppDispatch();
    const [elapsedSinceStart, setElapsedSinceStart] = useState(0);

    useEffect(() => {
        // Using 'ReturnType<typeof setInterval>' is the safest cross-platform way 
        // to type an interval without triggering 'NodeJS' namespace errors.
        let interval: ReturnType<typeof setInterval> | undefined;

        if (timeData?.isRunning && timeData?.activeStartTime) {
            interval = setInterval(() => {
                const now = new Date().getTime();
                const start = new Date(timeData.activeStartTime!).getTime();
                setElapsedSinceStart(now - start);
            }, 1000);
        } else {
            setElapsedSinceStart(0);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timeData?.isRunning, timeData?.activeStartTime]);

    const formatDisplay = () => {
        const totalMs = (timeData?.totalLoggedTime || 0) + elapsedSinceStart;
        
        const h = Math.floor(totalMs / 3600000);
        const m = Math.floor((totalMs % 3600000) / 60000);
        const s = Math.floor((totalMs % 60000) / 1000);
        
        // Formats to 00h 00m 00s
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex flex-col items-end px-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">
                    Live Session
                </span>
                <span className="font-mono font-bold text-gray-700 text-sm tabular-nums">
                    {formatDisplay()}
                </span>
            </div>
            
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch(toggleTimer({ taskId }));
                }}
                className={`p-2.5 rounded-lg transition-all transform active:scale-95 ${
                    timeData?.isRunning 
                    ? "bg-red-500 text-white shadow-md shadow-red-200 hover:bg-red-600" 
                    : "bg-emerald-500 text-white shadow-md shadow-emerald-200 hover:bg-emerald-600"
                }`}
            >
                {timeData?.isRunning ? (
                    <Pause size={20} weight="fill" />
                ) : (
                    <Play size={20} weight="fill" />
                )}
            </button>
        </div>
    );
};