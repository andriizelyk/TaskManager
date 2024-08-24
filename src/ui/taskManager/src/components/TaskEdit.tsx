import { FaRegSave } from 'react-icons/fa';
import { Task } from '../types';
import { IoMdClose } from 'react-icons/io';
import { useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../stores';

interface Props {
    task: Task,
    onClose: any
}

const TaskEdit = observer(({task, onClose} : Props) => {

    const rootDiv = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState<string>(task.title);
    const [description, setDescription] = useState<string>(task.content);
    const { taskStore } = useStores();

    const handleClose = () => {
        const root = rootDiv.current; 
        
        if (root) {
            root.className="hidden";
            onClose();
        }
    }

return (<div id="crud-modal" ref={rootDiv} className="overflow-y-auto overflow-x-hidden fixed top-[50%] right-[50%] z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full min-w-[800px] bg-gray-300 bg-opacity-50 cursor-default">
    <div className="relative pt-[10%] left-[25%] w-full max-w-[50%] max-h-full">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Task Details
                </h3>
                <button type="button" onClick={(e) => handleClose()} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <IoMdClose />
                    <span className="sr-only">Close</span>
                </button>
            </div>
            {/* <!-- Modal body --> */}
            <form className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                        <input 
                            type="text" 
                            name="title" 
                            id="title" 
                            defaultValue={title}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                            placeholder='Enter title'
                            onChange={(e)=> { setTitle(e.target.value); }}/>
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                        <textarea 
                            id="description" 
                            defaultValue={task.content}
                            rows={20}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Write product description here"
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}>
                        </textarea>                    
                    </div>
                </div>
                <div className="flex items-stretch">
                <button className="
                    text-white 
                    inline-flex 
                    items-center
                    bg-blue-700
                     hover:bg-blue-800 
                     focus:ring-4 
                     focus:outline-none
                      focus:ring-blue-300 
                      font-medium 
                      rounded-lg 
                      text-sm 
                      px-5 
                      py-2.5 
                      text-center
                      gap-2
                    dark:bg-blue-600
                    dark:hover:bg-blue-700
                    dark:focus:ring-blue-800"
                    onClick={async (e)=> {

                        const editedTask: Task = {
                            ...task,
                            content : description,
                            title: title
                        };

                        taskStore.updateTask(editedTask);
                        handleClose();
                    }}>
                <FaRegSave />
                    Save
                </button>
                </div>
            </form>
        </div>
    </div>
</div> 
  );
});

export default TaskEdit;