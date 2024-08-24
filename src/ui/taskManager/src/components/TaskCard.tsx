import { useState } from 'react'
import { Task } from '../types'
import { FaRegTrashAlt } from 'react-icons/fa';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";
import { useStores } from '../stores';
import TaskEdit from './TaskEdit';

interface Props {
    task: Task
}

function TaskCard({task}: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const {taskStore} = useStores();

    const {
        setNodeRef, 
        attributes, 
        listeners, 
        transition, 
        transform,
        isDragging
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        disabled: editMode
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    const toggleEditMode = () => {
        setEditMode(p => !p);
        setMouseIsOver(false);
    }

    if (isDragging) {
        return <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="
        bg-gray-700
        p-2.5
        h-[200px]
        min-h-[200px]
        items-center
        flex
        text-left
        rounded-xl
        border-gray-300
        border-2
        cursor-grab
        relative
        opacity-30"
        />
    }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="
        bg-gray-700
        h-[200px]
        min-h-[200px]
        items-center
        flex
        flex-wrap
        text-left
        rounded-lg
        ring-1
        ring-insert
        ring-gray-500
        hover:ring-2
        hover:ring-insert
        hover:ring-gray-500
        cursor-grab
        relative"
        onMouseEnter={()=>setMouseIsOver(true)}
        onMouseLeave={()=>setMouseIsOver(false)}
        >
            <p className={`
                p-2.5
                rounded-t-lg
                ${task.titleColor}
                mt-0
                mb-auto
                h-auto
                w-full
                overflow-y-auto
                overflow-x-hidden
                whitespace-pre-wrap
                font-bold`}>
                {task.title}
            </p>
            <p className="
                p-1
                my-auto
                h-[80%]
                w-full
                overflow-y-auto
                overflow-x-hidden
                whitespace-pre-wrap
                cursor-pointer
            " onClick={toggleEditMode}>
                {task.content}
            </p>
            { mouseIsOver && (<button className="
            stroke-white
            absolute
            right-[5px]
            top-[20px]
            -translate-y-1/2
            p-2
            rounded-lg
            bg-gray-600
            opacity-60
            hover:opacity-100" 
            onClick={async () => await taskStore.deleteTask(task.id, task.columnId)}
            >
                <FaRegTrashAlt />
            </button>) }
            <p className="text-right w-full">{task.assignee}</p>
            {editMode && <TaskEdit task={task} onClose={toggleEditMode}/>}
    </div>
  )
}

export default TaskCard