import { useState, useEffect } from "react";
import { useAppDispatch } from "../../redux/app/hook";
import { toggleTimer } from "../../redux/features/Task/taskSlice";
import { Play, Pause, Timer as TimerIcon } from "@phosphor-icons/react";

interface TimerProps {
    taskId: string;
    dueDate?: string;
    estimatedTime?: number;
    timeData?: {
        isRunning: boolean;
        activeStartTime: string | null;
        totalLoggedTime: number;
        delay: number;
    };
} 

export const Timer = ({ taskId, timeData, dueDate, estimatedTime = 0 }: TimerProps) => {
    const dispatch = useAppDispatch();
    const [elapsedSinceStart, setElapsedSinceStart] = useState(0);

   useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (timeData?.isRunning && timeData?.activeStartTime) {
        interval = setInterval(() => {
            const now = Date.now();
            const start = new Date(timeData.activeStartTime!).getTime();
            setElapsedSinceStart(now - start);
        }, 1000);
    } else {
        setElapsedSinceStart(0);
    }

    return () => {
        if (interval !== null) {
            clearInterval(interval);
        }
    };
}, [timeData?.isRunning, timeData?.activeStartTime]);


    const formatTime = (ms: number) => {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${h}h ${m}m ${s}s`;
    };

    const totalMs = (timeData?.totalLoggedTime || 0) + elapsedSinceStart;
    const goalMs = estimatedTime * 3600000;
    const cappedLoggedTime = goalMs > 0 ? Math.min(totalMs, goalMs) : totalMs;

    let liveDelay = timeData?.delay || 0;

    if (goalMs > 0 && totalMs > goalMs) {
        liveDelay += totalMs - goalMs;
    }

    if (timeData?.isRunning && dueDate && timeData.activeStartTime) {
        const deadline = new Date(dueDate).getTime();
        const now = Date.now();
        if (now > deadline && totalMs <= goalMs) {
            liveDelay += now - Math.max(deadline, new Date(timeData.activeStartTime).getTime());
        }
    }

    const goalReached = goalMs > 0 && totalMs >= goalMs;

    return (
        <div className="w-fit">
            {/* Main Card */}
            <div className="relative flex items-center gap-4 px-4 py-3 rounded-2xl
                bg-white/80 backdrop-blur-md ">

                {/* Left Icon */}
                <div className={`p-2 rounded-full ${
                    timeData?.isRunning ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-black"
                }`}>
                    <TimerIcon size={22} weight="fill" />
                </div>

                {/* Time Info */}
                <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-black">
                        {goalReached ? "Goal Reached" : timeData?.isRunning ? "Time Running" : "Time Logged"}
                    </span>
                    <span className="font-mono text-lg font-extrabold tracking-tight text-gray-900">
                        {formatTime(cappedLoggedTime)}
                    </span>
                </div>

                {/* Action Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatch(toggleTimer({ taskId }));
                    }}
                    className={`ml-3 p-2 rounded-full transition-all shadow-md hover:scale-105
                        ${timeData?.isRunning
                            ? "bg-rose-500 hover:bg-rose-600 text-white"
                            : "bg-emerald-500 hover:bg-emerald-600 text-white"
                        }`}
                >
                    {timeData?.isRunning
                        ? <Pause size={18} weight="fill" />
                        : <Play size={18} weight="fill" />}
                </button>

                {/* Status Badge */}
                <span className={`absolute -top-2 right-3 text-[9px] px-2 py-0.5 rounded-full font-bold
                    ${timeData?.isRunning
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-yellow-200 text-yellow-500"
                    }`}>
                    {timeData?.isRunning ? "RUNNING" : "PAUSED"}
                </span>
            </div>

            {/* Delay Indicator */}
            {/* {liveDelay > 0 && (
                <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-rose-100">
                    <WarningCircle size={14} weight="fill" className="text-rose-600" />
                    <span className="text-[11px] font-semibold text-rose-700">
                        OVERTIME • {formatTime(liveDelay)}
                    </span>
                </div>
            )} */}
        </div>
    );
};
