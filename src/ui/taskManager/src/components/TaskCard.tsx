import { useState } from 'react'
import { Task } from '../types'
import { FaRegTrashAlt } from 'react-icons/fa';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";

interface Props {
    task: Task,
    deleteTask: (taskId: string) => void;
    updateTaskContent: (taskId: string, content: string) => void;
}

function TaskCard({task, deleteTask, updateTaskContent}: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

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
        h-[100px]
        min-h-[100px]
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

    if (editMode) {
        return <div ref={setNodeRef} style={style} {...attributes} {...listeners}
                    className="
                    bg-gray-700
                    p-2.5
                    h-[100px]
                    min-h-[100px]
                    items-center
                    flex
                    text-left
                    rounded-xl
                    hover:ring-2
                    hover:ring-insert
                    hover:ring-gray-500
                    cursor-grab
                    relative">
                        <textarea className="
                            h-[90%]
                            w-full
                            resize-none
                            border-none
                            rounded
                            bg-transparent
                            text-white
                            focus:outline-none"
                            value={task.content}
                            autoFocus
                            placeholder="Please describe task..."
                            onBlur={toggleEditMode}
                            onKeyDown={(e)=> {
                                if (e.key === 'Enter' && e.shiftKey) toggleEditMode();
                            }}
                            onChange={e => { updateTaskContent(task.id, e.target.value); }}
                        >
                            {task.content}
                        </textarea>
                    </div>
    }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="
        bg-gray-700
        p-2.5
        h-[100px]
        min-h-[100px]
        items-center
        flex
        text-left
        rounded-xl
        hover:ring-2
        hover:ring-insert
        hover:ring-gray-500
        cursor-grab
        relative"
        onMouseEnter={()=>setMouseIsOver(true)}
        onMouseLeave={()=>setMouseIsOver(false)}
        onClick={toggleEditMode}>
            <p className="
                my-auto
                h-[90%]
                w-full
                overflow-y-auto
                overflow-x-hidden
                whitespace-pre-wrap
            ">
                {task.content}
            </p>
            {mouseIsOver && (<button className="
            stroke-white
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            p-2
            rounded
            bg-gray-600
            opacity-60
            hover:opacity-100" 
            onClick={() => deleteTask(task.id)}
            >
                <FaRegTrashAlt />
            </button>)}
    </div>
  )
}

export default TaskCard