import { FaRegTrashAlt } from "react-icons/fa";
import { Column } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    column: Column;
    deleteColumn: (id : string) => void;
};

function ColumnContainer(props: Props) {
    const { column, deleteColumn } = props;
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
        }});

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
                {column.title}
            </div>
            <button onClick={() => deleteColumn(column.id)}>
                <FaRegTrashAlt />
            </button>
        </div>
        <div className="flex flex-grow">Content</div>
        
        <div>footer</div>
    </div>
  )
}

export default ColumnContainer