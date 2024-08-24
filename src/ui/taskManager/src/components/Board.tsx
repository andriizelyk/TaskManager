import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { Color, Column, Size, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import { v4 as uuid } from "uuid";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { observer } from "mobx-react";
import { useStores } from "../stores";
import Spinner from "./Spinner";

interface BoardCardProp {
    boardId: string;
}

const Board = observer((props: BoardCardProp) => {

    const { columnStore, taskStore } = useStores();
    const columnsId = columnStore.columns.map(c => c.id);
    const [activeColumn, setActiveColumn] = useState<Column|null>(null);
    const [activeTask, setActiveTask] = useState<Task|null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint : {
                distance: 3,
            }
        })
    );

    useEffect(() => {
        columnStore.loadColumns(props.boardId);
    }, []);

    function onDragStart(e: DragStartEvent) {
        if (e.active.data.current?.type === "Column") {
            setActiveColumn(e.active.data.current.column);
            return;
        }

        if (e.active.data.current?.type === "Task") {
            setActiveTask(e.active.data.current.task);
            return;
        }
    }

    function onDragOver(e: DragOverEvent) {
        const { active, over } = e;
        
        if (!over) return;
        const activeId = active.id;
        const overId = over.id;
        
        if (activeId === overId)
            return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return;

        if (isActiveATask && isOverATask) {
            taskStore.moveOverTask(activeId.toString(), overId.toString());
        }

        const isOverAColumn = over.data.current?.type === "Column";

        if (isActiveATask && isOverAColumn) {
            taskStore.moveToColumn(activeId.toString(), overId.toString());
        }
    }

    function onDragEnd(e: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = e;
        
        if (!over || active.data.current?.type === "Task") return;
        const activeColumnId = active.id;
        const overColumnId = over.id;
        
        if (activeColumnId === overColumnId)
            return;

        columnStore.updateColumnsOrder(activeColumnId, overColumnId);
    }

  return (
    <div 
        key = {props.boardId}
        className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
        ">
        {columnStore.isLoading && <Spinner size={Size.md} color={Color.blue} text={""}></Spinner>}
        <DndContext 
            sensors={sensors}
            onDragStart={e => onDragStart(e)} 
            onDragEnd={e => onDragEnd(e)}
            onDragOver={e => onDragOver(e)}>
            <div className="m-auto flex gap-4 p-5">
                <div className="flex gap-4">
                    <SortableContext items={columnsId}>
                        {columnStore.columns
                            .filter(c => c.boardId === props.boardId)
                            .map((c) => (
                                <ColumnContainer 
                                    key = {c.id} 
                                    column = {c} 
                                />))}
                    </SortableContext>
                </div>
                <button className="
                h-[60px]
                w-[130px]
                cursor-pointer
                rounded-lg
                bg-gray-700
                border-columnBackgroundColor
                p-4
                ring-gray-500
                hover:ring-2
                flex
                gap-2"
                onClick={_ => {
                    const newColumn : Column = {
                        id: uuid(),
                        title: `Stage #${columnStore.columns.length + 1}`,
                        order: `${columnStore.columns.length + 1}`,
                        boardId: props.boardId
                    };

                    columnStore.addColumn(newColumn);
                }}>
                    <FaPlus className="my-auto"/>
                    Add state
                    </button>
            </div>
            {createPortal(
                <DragOverlay>
                    { activeColumn && <ColumnContainer column={activeColumn}/> }
                    { activeTask && <TaskCard task={activeTask} /> }
                </DragOverlay>
                , document.body)}
            
        </DndContext>
    </div>

  )
});

export default Board;