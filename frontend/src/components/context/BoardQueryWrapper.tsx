

import { Navigate, useParams, useSearchParams } from 'react-router-dom';

import { GlobalSpinner } from './GlobalSpinner';
import { HomeTab } from '../dashboard/tabs/HomeTab';
import { BoardProvider } from './BoardProvider';
import { DashBoardHeader } from '../dashboard/tabs/DashBoardHeader';
import { DashBoardBody } from '../dashboard/tabs/DashBoardBody';

export const BoardQueryWrapper = () => {
  const { boardSlug } = useParams();

  if (!boardSlug || boardSlug === "undefined") {
    return <Navigate to=".." />; // Go back one level
  }

  return (
    <BoardProvider key={boardSlug}>
      {/* Only show spinner if data is actually loading inside the provider */}
      <DashBoardHeader />
      <DashBoardBody />
    </BoardProvider>
  );
};