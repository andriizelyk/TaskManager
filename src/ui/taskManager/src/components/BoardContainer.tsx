import { useEffect, useState } from 'react';
import Board from './Board';
import { observer } from 'mobx-react';
import { useStores } from '../stores';
import { v4 as uuidv4 } from 'uuid';
import { FaPlus } from 'react-icons/fa';
import { TabButton } from './TabButton';
import Spinner from './Spinner';
import { Color, Size } from '../types';

const BoardContainer = observer(() => {
  const [activeTab, setActiveTab] = useState(0);
  const {boardStore} = useStores();

  useEffect(()=> {
    boardStore.loadBoards();
}, []);

  return (
    <>
    <div className="w-full">
      <div className="flex max-w-screen">
        {boardStore.isLoading && <Spinner size={Size.md} color={Color.gray} text='' />}
        {boardStore.boards.map((board, index) => (
          <TabButton board={board} key={"tab" + board.id} index={index} isActive={activeTab === index} setActive={(index) => setActiveTab(index) }/>
        ))}
        <button
            key='new'
            className={`py-2 px-4 font-medium text-sm focus:outline-none hover:text-gray-700`}
            onClick={() => {
              boardStore.addBoard({ id: uuidv4(), title: `board #${boardStore.boards.length + 1}`})
            }}
            id={`tab-new`}
            title="Add board"
          >
            <FaPlus className="my-auto"/>
        </button>
      </div>
      <div className="py-4">
        {
          boardStore.boards.length == 0
          ? <span>No boards yet...</span>
          : <Board boardId={boardStore.boards[activeTab].id}/>
        }
      </div>
    </div>
    
    </>
  );
});

export default BoardContainer;