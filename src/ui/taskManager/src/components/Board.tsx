import { useMemo, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { Column } from "../types";
import ColumnContainer from "./ColumnContainer";
import { v4 as uuid } from "uuid";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function Board() {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map(c => c.id), [columns]);
    const [activeColumn, setActiveColumn] = useState<Column|null>(null);
    //const sensors = useSensors()

    function addNewColumn() {
        const newColumn : Column = {
            id: uuid(),
            title: `Stage #${columns.length + 1}`
        }

        setColumns([...columns, newColumn]);
    }

    function deleteColumn(id: string) {
        const allColumnsExceptWithId = columns.filter(c => c.id !== id);
        setColumns(allColumnsExceptWithId);
    }

    function onDragStart(e: DragStartEvent) {
        if (e.active.data.current?.type === "Column") {
            setActiveColumn(e.active.data.current.column);
            return;
        }
    }

    function onDragEnd(e: DragEndEvent){
        const { active, over } = e;
        
        if(!over) return;
        const activeColumnId = active.id;
        const overColumnId = over.id;
        
        if (activeColumnId === overColumnId)
            return;

        setColumns(columns => {
            const activeIndex = columns.findIndex(c => c.id === activeColumnId);
            const overIndex = columns.findIndex(c => c.id === overColumnId);

            return arrayMove(columns, activeIndex, overIndex);
        })

    }

  return (
    <div className="
    m-auto
    flex
    min-h-screen
    w-full
    items-center
    overflow-x-auto
    overflow-y-hidden
    px-[40px]
    ">
        <DndContext onDragStart={e => onDragStart(e)} onDragEnd={e => onDragEnd(e)}>
            <div className="m-auto flex gap-4">
                <div className="flex gap-4">
                    <SortableContext items={columnsId}>
                        {columns.map((c) => (
                            <ColumnContainer 
                                key = {c.id} 
                                column= {c} 
                                deleteColumn={deleteColumn}/>))}
                    </SortableContext>
                </div>
                <button className="
                h-[60px]
                w-[350px]
                min-w-[350px]
                cursor-pointer
                rounded-lg
                bg-gray-700
                border-columnBackgroundColor
                p-4
                ring-gray-500
                hover:ring-2
                flex
                gap-2"
                onClick={_ => addNewColumn()}
                >
                    <FaPlus className="my-auto"/>
                    Add column
                    </button>
            </div>
            {createPortal(
                <DragOverlay>
                    {activeColumn && <ColumnContainer column={activeColumn} deleteColumn={deleteColumn}/>}
                </DragOverlay>
                , document.body)}
            
        </DndContext>
    </div>

  )
}

export default Board