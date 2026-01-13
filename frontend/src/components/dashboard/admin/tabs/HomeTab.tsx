import { useContext } from "react";
import { useAppSelector } from "../../../redux/app/hook";
import { BoardContext } from "../../../context/board/BoardContext";

export const HomeTab = () => {
    const user = useAppSelector(state => state.login.user);
    const boards = useAppSelector(state => state.board.boards);
    
    // Access the context
    const boardContext = useContext(BoardContext);
    if (!boardContext) return null;

    // 'task' here contains ALL tasks fetched by the provider
    const { task: allTasks } = boardContext;

    const calculateBoardProgress = (boardId: string) => {
        // Filter tasks belonging to this specific board
        // Note: Check your Task type to see if board is t.board._id or t.board
        const boardTasks = allTasks.filter(t => {
            const id = typeof t.board === 'object' ? (t.board as any)._id : t.board;
            return id === boardId;
        });

        if (boardTasks.length === 0) return 0;

        const totalSum = boardTasks.reduce((acc, t) => acc + (t.progress || 0), 0);
        return Math.round(totalSum / boardTasks.length);
    };

    return (
        <div className="flex h-screen w-full bg-gray-50"> 
            <div className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-3xl font-bold mb-8">Welcome 👋 {user?.name}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {boards.map((boardItem) => {
                        const progress = calculateBoardProgress(boardItem._id);
                        const boardTasksCount = allTasks.filter(t => {
                            const id = typeof t.board === 'object' ? (t.board as any)._id : t.board;
                            return id === boardItem._id;
                        }).length;

                        return (
                            <div key={boardItem._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="font-bold text-xl mb-2">{boardItem.name}</h3>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-500">{boardTasksCount} Tasks</span>
                                    <span className="font-bold text-blue-600">{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};