import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { Column, Task } from "../types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";

interface Props {
    column: Column;
    tasks: Task[];
    deleteColumn: (id : string) => void;
    updateColumnTitle: (id : string, title: string) => void;
    createTask: (columnId : string) => void;
    deleteTask: (taskId : string) => void;
    updateTaskContent: (taskId : string, content: string) => void;
};

function ColumnContainer(props: Props) {
    const { column, tasks, deleteColumn, updateColumnTitle, createTask, deleteTask, updateTaskContent } = props;
    const [editMode, setEditMode] = useState(false);
    const tasksIds = useMemo(() => {return tasks.map(t => t.id);}, [tasks])
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
        h-[500px]
        max-h-[500px]
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
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
    ">
        <div
            {...attributes} 
            {...listeners}
            onClick={() => setEditMode(true)}
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
                0           
                </div>
                {!editMode && column.title}
                {editMode && <input 
                    className="bg-black focus:border-gray-500 border rounded outline-none px-2"
                    value = {column.title}
                    onChange={e => {updateColumnTitle(column.id, e.target.value)}}
                    autoFocus 
                    onBlur = {() => setEditMode(false)}
                    onKeyDown={e => {
                        if (e.key !== "Enter") return;

                        setEditMode(false);
                    }}/>}
            </div>
            <button onClick={() => deleteColumn(column.id)}>
                <FaRegTrashAlt />
            </button>
        </div>
        <div className="flex flex-grow flex-col gap-4 p-2 overflow-auto">
            <SortableContext items={tasksIds}>
                {
                    tasks.map(t => (<TaskCard key={t.id} task={t} deleteTask={deleteTask} updateTaskContent={updateTaskContent}/>))
                }
            </SortableContext>
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
                onClick={() => {createTask(column.id)}}>
            <FaPlus className="my-auto"/>
            Add task
        </button>
    </div>
  )
}

export default ColumnContainer