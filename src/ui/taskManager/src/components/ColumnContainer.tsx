import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { Color, Column, Size, Task } from "../types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { observer } from "mobx-react";
import { useStores } from "../stores";
import { v4 as uuid } from "uuid";
import Spinner from "./Spinner";

interface Props {
    column: Column;
};

const ColumnContainer = observer((props: Props) => {
    const { column } = props;
    const [ editMode, setEditMode ] = useState(false);
    const [ mouseIsOver, setMouseIsOver]  = useState(false);
    const { columnStore, taskStore } = useStores();

    const tasksIds = taskStore.tasks[column.id]?.map(t => t.id) || [];

    useEffect(()=> {
        taskStore.loadTasks(column.id);
    }, [column.id]);

    const {
        setNodeRef, 
        attributes, 
        listeners, 
        transition, 
        transform,
        isDragging
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return <div ref={setNodeRef} style={style} className="
        bg-gray-700
        w-[350px]
        h-[calc(100vh-150px)]
        min-h-[500px]
        rounded-md
        flex
        flex-col
        opacity-60
        border-2
        border-gray-300
        ">
        </div>
    }

  return (
    <div
        ref={setNodeRef} 
        style={style}
        className="
    bg-gray-700
    w-[350px]
    h-[calc(100vh-150px)]
    min-h-[500px]
    rounded-md
    flex
    flex-col
    ">
        <div
            {...attributes} 
            {...listeners}
            onClick={() => setEditMode(true)}
            onMouseEnter={()=>setMouseIsOver(true)} 
            onMouseLeave={()=>setMouseIsOver(false)}
            className="
        bg-gray-800
        text-md
        h-[60px]
        cursor-grab
        rounded-md
        rounded-b-none
        p-3
        font-bold
        border-gray-700
        border-4
        flex
        items-center
        justify-between
        ">
            <div className="flex gap-2 cursor-grab">
                <div className="
                flex
                justify-center
                items-center
                bg-gray-700
                px-2
                py-1
                text-sm
                rounded-full">
                {taskStore.tasks[column.id]?.length}    
                </div>
                {!editMode && column.title}
                {editMode && <input 
                    className="bg-black focus:border-gray-500 border rounded outline-none px-2"
                    value = {column.title}
                    onChange={e => {
                        column.title = e.target.value;
                        if (e.target.value !== '')
                            columnStore.updateColumn(column);
                    }}
                    autoFocus 
                    onBlur = {() => setEditMode(false)}
                    onKeyDown={e => {
                        if (e.key !== "Enter") return;

                        setEditMode(false);
                    }}/>}
            </div>
            { mouseIsOver && (<button onClick={() => columnStore.deleteColumn(column.id)}>
                <FaRegTrashAlt />
            </button>)}
        </div>

        <button className="
                flex 
                gap-2 
                items-center 
                bg-gray-700
                border-gray-700 
                border-2 
                rounded-md 
                p-4 
                hover:border-gray-500"
                onClick={async () => {
                    const task : Task = {
                        id: uuid(),
                        columnId: column.id,
                        title: `new task ${taskStore.tasks[column.id]?.length+1}`,
                        content: 'TBD',
                        assignee:'',
                        order: `${taskStore.tasks[column.id]?.length+1}`,
                        titleColor: 'bg-blue-800'
                    };

                    await taskStore.addTask(task);
                }}
                >
            <FaPlus className="my-auto"/>
            Add task
        </button>

        <div className="flex flex-grow flex-col gap-4 p-2 overflow-auto">
            {taskStore.isLoading && <Spinner size={Size.md} color={Color.blue} text={""}></Spinner>}
            <SortableContext items={tasksIds}>
                {
                    !taskStore.isLoading && taskStore.tasks[column.id]?.map(t => (<TaskCard key={t.id} task={t} /> ))
                }
            </SortableContext>
        </div>
    </div>
  )
});

export default ColumnContainer;