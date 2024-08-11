import { useMemo, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { Column, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import { v4 as uuid } from "uuid";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function Board() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map(c => c.id), [columns]);
    const [activeColumn, setActiveColumn] = useState<Column|null>(null);
    const [activeTask, setActiveTask] = useState<Task|null>(null);
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint : {
                distance: 3, //px
            }
        })
    )

    function createTask(columnId: string) {
        const newTask : Task = {
            id: uuid(),
            columnId,
            content: "Please describe",
            title: `Task ${tasks.length + 1}`
        };

        setTasks([...tasks, newTask]);

    }

    function deleteTask(taskId: string) {
        const allTasksExceptWithId = tasks.filter(t => t.id !== taskId);
        setTasks(allTasksExceptWithId);
    }

    function updateTaskContent(taskId: string, content: string) {
        const updTasks = tasks.map(t => {
            if (t.id !== taskId) return t;
            return {...t, content};
        });
        setTasks(updTasks);
    }

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

        const allTasksExceptThisColumn = tasks.filter(t => t.columnId !== id);
        setTasks(allTasksExceptThisColumn);
    }

    function updateColumnTitle(id: string, title: string) {
        const newColumns = columns.map((c) => {
            if (c.id !== id) return c;
            return { ...c, title};
        });
        setColumns(newColumns);
    }

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
        
        if(!over) return;
        const activeId = active.id;
        const overId = over.id;
        
        if (activeId === overId)
            return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return;

        if (isActiveATask && isOverATask) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(t => t.id === activeId);
                const overIndex = tasks.findIndex(t => t.id === overId);
                tasks[activeIndex].columnId = tasks[overIndex].columnId
            
                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === "Column";

        if (isActiveATask && isOverAColumn) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(t => t.id === activeId);
                tasks[activeIndex].columnId = overId.toString();
            
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }

    function onDragEnd(e: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

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
        <DndContext 
            sensors={sensors}
            onDragStart={e => onDragStart(e)} 
            onDragEnd={e => onDragEnd(e)}
            onDragOver={e => onDragOver(e)}>
            <div className="m-auto flex gap-4">
                <div className="flex gap-4">
                    <SortableContext items={columnsId}>
                        {columns.map((c) => (
                            <ColumnContainer 
                                key = {c.id} 
                                column = {c} 
                                createTask={createTask}
                                updateColumnTitle = {updateColumnTitle}
                                deleteColumn = {deleteColumn}
                                tasks = {tasks.filter(t => t.columnId === c.id)}
                                deleteTask = {deleteTask}
                                updateTaskContent = {updateTaskContent}
                            />))}
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
                    Add state
                    </button>
            </div>
            {createPortal(
                <DragOverlay>
                    {activeColumn && <ColumnContainer 
                                        column={activeColumn} 
                                        createTask={createTask}
                                        deleteColumn = {deleteColumn} 
                                        updateColumnTitle = {updateColumnTitle}
                                        tasks={tasks.filter(t => t.columnId === activeColumn.id)}
                                        deleteTask={deleteTask}
                                        updateTaskContent={updateTaskContent}
                                    />}
                    {activeTask && <TaskCard 
                                        task={activeTask} 
                                        deleteTask={deleteTask} 
                                        updateTaskContent={updateTaskContent}/>}
                </DragOverlay>
                , document.body)}
            
        </DndContext>
    </div>

  )
}

export default Board