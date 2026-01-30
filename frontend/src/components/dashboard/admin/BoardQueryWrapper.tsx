

import { useSearchParams } from 'react-router-dom';

import { GlobalSpinner } from '../../context/board/GlobalSpinner';
import { HomeTab } from './tabs/HomeTab';
import { BoardProvider } from '../../context/board/BoardProvider';
import { DashBoardHeader } from './tabs/DashBoardHeader';
import { DashBoardBody } from './tabs/DashBoardBody';

export const BoardQueryWrapper = () => {
    const [searchParams] = useSearchParams();
    const boardSlug = searchParams.get("name");

    if (!boardSlug) {
        return <HomeTab />;
    }

    return (
        <BoardProvider key={boardSlug}>
            <GlobalSpinner />
            <DashBoardHeader />
            <DashBoardBody />
        </BoardProvider>
    );
};
