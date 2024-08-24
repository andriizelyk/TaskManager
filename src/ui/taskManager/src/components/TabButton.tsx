import { useState } from "react";
import { Board } from "../types";
import { useStores } from "../stores";

export const TabButton = (props: { 
    board: Board, 
    index: number, 
    isActive: boolean, 
    setActive:(index: number) => void }) => {

        const [ editMode, setEditMode ] = useState(false);
        const {boardStore} = useStores();

    return (
        <button
            key={props.board.title}
            className={`py-2 px-4 font-medium focus:outline-none border-t-2 border-l-2 border-r-2 rounded-t-lg ${
                props.isActive
                ? 'border-t-3 border-gray-500'
                : 'text-gray-500 hover:text-white border-b-2 border-gray-700'
            }`}
            onClick={() => props.setActive(props.index)}
            onDoubleClick={() => setEditMode(true)}
            role="tab"
            id={`tab-${props.index}`}
            title={`${props.board.title} - double click to edit`}
          >
            {!editMode && props.board.title}
            {editMode && <input 
                    key = 'edit-tab-title'
                    className="bg-black focus:border-gray-500 border rounded outline-none px-2"
                    value = {props.board.title}
                    onChange={e => { props.board.title = e.target.value; boardStore.updateBoard(props.board);}}
                    autoFocus 
                    onBlur = {() => setEditMode(false)}
                    onKeyDown={e => {
                        if (e.key !== "Enter") return;

                        setEditMode(false);
                    }}/>}
          </button>
    );
}