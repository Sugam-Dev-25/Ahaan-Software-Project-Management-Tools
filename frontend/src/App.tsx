
import { useCurrentUser } from './components/api/useCurrentUser'
import { IndexPage } from './components/pages/IndexPage'

function App() {
  
    const { isFetched } = useCurrentUser(); 
    if (!isFetched) {
        return (
            <div className="flex items-center justify-center min-h-screen text-xl text-gray-700">
                Loading Application Session...
            </div>
        );
    }

    return <IndexPage/>
}

export default App