import React, { useEffect, useState } from 'react';
import TodoCard from './component/Todo-card';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [todoItem, setTodoItem] = useState({
    task: "",
    priority: ""
  });

  const [todoList, setTodoList] = useState(() => {
    return JSON.parse(localStorage.getItem("todoList")) || [];
  });

  const [selectedTab, setSelectedTab] = useState("All");

  useEffect(() => {
    if (todoList.length === 0) return;
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  const onDelete = (index) => {
    const listAfterDeletion = todoList.filter((_, i) => i !== index);
    setTodoList(listAfterDeletion);
  };

  const filteredTodoList = selectedTab === "All" 
    ? todoList 
    : todoList.filter(taskItem => taskItem.priority === selectedTab);

  return (
    <div className='bg-amber-50 min-h-screen'>
      <div className='flex justify-around border border-b-2 bg-[#2C3930] pt-4'>
        {["All", "High", "Medium", "Low"].map((tab, i) => {
          return (
            <span 
              className={`py-1 text-lg md:text-xl text-center w-[100px] md:w-[250px] rounded-tl-lg rounded-tr-lg block cursor-pointer ${tab === selectedTab ? "bg-yellow-500 text-white" : "bg-white"}`} 
              key={i}  
              onClick={() => setSelectedTab(tab)}  
            >
              {tab}
            </span>
          );
        })}
      </div>

      <div className='h-[60vh] md:h-[80vh] overflow-y-scroll'>
        {filteredTodoList.map((taskItem, index) => {
          const { task, priority } = taskItem;

          return (
            <TodoCard
              task={task}
              priority={priority}
              key={index}
              index={index}
              onDelete={onDelete}
            />
          );
        })}
      </div>

      <div className='fixed bottom-0 left-0 w-full bg-[#2C3930] p-10 flex md:flex-row flex-col items-center justify-center gap-y-4'>
        <input
          type="text"
          onChange={(e) => {
            setTodoItem({
              ...todoItem,
              task: e.target.value
            });
          }}
          value={todoItem.task}
          className='bg-white text-xl md:w-[400px] rounded-md p-2 focus:outline-none w-[300px]'
          placeholder='Enter Task'
        />

        <select
          className='text-xl bg-white px-5 py-2 rounded-md ml-0 md:ml-5 md:w-[200px]'
          onChange={(e) => {
            setTodoItem({
              ...todoItem,
              priority: e.target.value
            });
          }}
          value={todoItem.priority}
        >
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button
          className='text-xl bg-yellow-500 md:px-10 px-5 py-2 rounded-md md:ml-5 mt-5 md:mt-0 w-[150px] cursor-pointer'
          onClick={() => {
            if (!todoItem.task) {
              toast.error('Please enter task');
              return;
            }
            if (!todoItem.priority) {
              toast.error('Please select priority');
              return;
            }

            setSelectedTab(todoItem.priority);
            setTodoList([todoItem, ...todoList]);
            setTodoItem({
              task: "",
              priority: "",
            });
            toast.success('Task Added Successfully');
          }}
        >
          Add
        </button>
      </div>
      <Toaster />
    </div>
  );
}

export default App;