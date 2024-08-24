import { useEffect } from 'react'
import './App.css'
import Login from './components/Login';
import BoardContainer from './components/BoardContainer';
import { useStores } from './stores';
import { observer } from 'mobx-react';
import Spinner from './components/Spinner';
import { Color, Size } from './types';

 const App = observer(() => {
  const {authStore} = useStores();
  const profile = authStore.profile;

  useEffect(() => {
    const checkMe = async () => await authStore.checkMe();
    if (!authStore.isAuthenticated)
      checkMe();
  }, []);

  return (
    <>
        {authStore.isLoading && 
          <div className='m-10'>
              <Spinner size={Size.md} color={Color.blue} text={''}/>
          </div>
        }
        {!authStore.isAuthenticated && <Login />}
        {authStore.isAuthenticated && 
          <>
            <div className='flex items-end place-content-end cursor-pointer'>
              <div className='flex items-center place-content-start border-gray-300 bg-gray-700 w-[150px] rounded-3xl m-1'>
                        <img 
                            src={profile?.picture} 
                            alt="user image" 
                            className='w-[40px] h-[40px] m-[5px] rounded-full' 
                            title={`${profile?.name} (${profile?.email})`}/>
                        <p>{profile?.name}</p>
              </div>
            </div>
            <BoardContainer/>
          </>
        }
    </>
  )
});

export default App
