import React, { useState, useEffect, useContext, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useParams, useHistory } from "react-router-dom";
import Modal from "react-modal";
import { UserContext, ProjectContext } from "../App";
import authenticatedFetch from "../utils/authenticatedFetch";
import { Fragment } from "react";
import { Menu, Transition, Combobox } from "@headlessui/react";
import {
  ChevronDownIcon,
  CheckIcon,
  SelectorIcon,
} from "@heroicons/react/solid";

const people = [
  { id: 1, name: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt" },
];
const cat = [
  { id: 1, name: "Bug" },
  { id: 2, name: "Task" },
  { id: 3, name: "Story" },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ------- for drag-n-drop ---------
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
// ---------------------------------

const TodoItem = ({
  todo,
  todoIndex,
  stageIndex,
  provided,
  deleteTask,
  board,
  setBoard,
}) => {
  const [selected, setSelected] = useState(people[0]);
  const [query, setQuery] = useState("");
  const [selectedcat, setSelectedcat] = useState(cat[0]);
  const [querycat, setQuerycat] = useState("");

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) =>
          person.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const filteredCat =
    querycat === ""
      ? cat
      : cat.filter((person) =>
          cat.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  const { projectId } = useParams();
  const { user, setUser } = useContext(UserContext);
  const nameRef = useRef();
  const descRef = useRef();
  const [editIsShowing, setEditIsShowing] = useState(false);

  const handleChanges = async (e) => {
    e.preventDefault();
    const newTodo = await authenticatedFetch(
      `http://localhost:8000/projects/${projectId}/todos/${todo.id}/`,
      "PUT",
      user,
      setUser,
      {
        id: todo.id,
        name: nameRef.current.value,
        description: descRef.current.value,
      }
    );

    const newState = [...board];

    newState[stageIndex][todoIndex] = newTodo;
    setBoard(newState);

    setEditIsShowing(false);
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="relative col-span-1 flex shadow-sm rounded-md max-w-full"
    >
      <div className="flex-shrink-0 flex items-center justify-center w-2 bg-blue-600 uppercase text-white text-sm leading-5 font-medium rounded-l-md"></div>
      <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md">
        <div
          className="flex-1 flex px-4 py-2 text-sm leading-5"
          onClick={() => setEditIsShowing(true)}
        >
          <h4 className="text-gray-900 break-normal max-w-full font-medium transition ease-in-out duration-150">
            {todo.name}
          </h4>
        </div>
        <div className="flex-shrink-0 pr-2">
          <button
            onClick={(e) => deleteTask(e, todo.id, todoIndex, stageIndex)}
            className="w-8 h-8 p-2 items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:text-gray-500 focus:bg-gray-100 transition ease-in-out duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-full h-full"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex">
        <Modal isOpen={editIsShowing}>
          <form
            onSubmit={(e) => handleChanges(e)}
            className="mt-16 relative mx-auto max-w-2xl"
          >
            <div>
              <label
                for="name"
                class="block text-sm font-medium leading-5 text-gray-700"
              >
                Name
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input
                  id="name"
                  ref={nameRef}
                  defaultValue={todo.name}
                  class="form-input block w-full sm:text-sm sm:leading-5"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div className="relative inline-block text-left my-4">
                  <label>Categories</label>
                  <br />
                  <Combobox value={selectedcat} onChange={setSelectedcat}>
                    <div className="relative mt-1">
                      <div className=" w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input
                          className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                          displayValue={(person) => person.name}
                          onChange={(event) => setQuerycat(event.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <SelectorIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </Combobox.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuerycat("")}
                      >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {filteredCat.length === 0 && querycat !== "" ? (
                            <div className="absolute cursor-default select-none py-2 px-4 text-gray-700">
                              Nothing found.
                            </div>
                          ) : (
                            filteredCat.map((person) => (
                              <Combobox.Option
                                key={person.id}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? "bg-teal-600 text-white"
                                      : "text-gray-900"
                                  }`
                                }
                                value={person}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {person.name}
                                    </span>
                                    {selected ? (
                                      <span
                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                          active
                                            ? "text-white"
                                            : "text-teal-600"
                                        }`}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Combobox.Option>
                            ))
                          )}
                        </Combobox.Options>
                      </Transition>
                    </div>
                  </Combobox>
                </div>
              </div>

              <div>
                <div className="relative inline-block text-left my-4">
                  <label>Assign To</label>
                  <Combobox value={selected} onChange={setSelected}>
                    <div className="relative mt-1">
                      <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input
                          className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                          displayValue={(person) => person.name}
                          onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <SelectorIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </Combobox.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                      >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {filteredPeople.length === 0 && query !== "" ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                              Nothing found.
                            </div>
                          ) : (
                            filteredPeople.map((person) => (
                              <Combobox.Option
                                key={person.id}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? "bg-teal-600 text-white"
                                      : "text-gray-900"
                                  }`
                                }
                                value={person}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {person.name}
                                    </span>
                                    {selected ? (
                                      <span
                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                          active
                                            ? "text-white"
                                            : "text-teal-600"
                                        }`}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Combobox.Option>
                            ))
                          )}
                        </Combobox.Options>
                      </Transition>
                    </div>
                  </Combobox>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <label
                for="description"
                class="block text-sm font-medium leading-5 text-gray-700"
              >
                Description
              </label>

              <div class="mt-1 rounded-md shadow-sm">
                <textarea
                  id="description"
                  ref={descRef}
                  class="form-input block w-full sm:text-sm sm:leading-5"
                  defaultValue={todo.description}
                  placeholder="Enter a description here"
                />
              </div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                for="file_input"
              >
                Upload file
              </label>
              <input
                class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="file_input"
                type="file"
              />
              <div>Created By</div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setEditIsShowing(false)}
                className="flex-grow-0 flex justify-center ml-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-gray-900 focus:shadow-outline-red active:bg-gray-700 transition duration-150 ease-in-out"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-grow-0 flex justify-center ml-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-red active:bg-blue-700 transition duration-150 ease-in-out"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

const AddTaskForm = ({ stage, stageIndex, board, setBoard }) => {
  const nameRef = useRef();
  const { projectId } = useParams();
  const { user, setUser } = useContext(UserContext);

  const addNewTask = async (e, stageIndex) => {
    e.preventDefault();
    if(nameRef.current.value !== null && nameRef.current.value !== undefined && nameRef.current.value !== ""){
      const task = await authenticatedFetch(
        `http://localhost:8000/projects/${projectId}/todos/`,
        "POST",
        user,
        setUser,
        {
          name: nameRef.current.value,
          stage: stage,
        }
      );
      const newState = [...board];
      newState[stageIndex].push(task);
      setBoard(newState);
    }
    else {
      alert("Cannot be empty")
    }
    nameRef.current.value = "";
  };

  return (
    <form onSubmit={(e) => addNewTask(e, stageIndex)}>
      <label htmlFor="newTask" className="sr-only">
        Add new task
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex-grow focus-within:z-10">
          <input
            id="newTask"
            name="newTask"
            ref={nameRef}
            className="form-input block w-full rounded-none rounded-l-md transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            placeholder="User can..."
          />
        </div>
        <button
          type="submit"
          className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-yellow-300 hover:text-gray-500 hover:bg-yellow-200 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-gray-700 w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

const stageNames = ["Todo", "Progress", "Review", "Complete"];

const stageValues = ["Todo", "Progress", "Review", "Complete"];

const DeskopView = () => {
  const { projectId } = useParams();
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
  const [board, setBoard] = useState([]);
  const { setProject } = useContext(ProjectContext);

  useEffect(() => setProject(projectId), [projectId, setProject]);

  useEffect(() => {
    const getProjects = async () => {
      const todos = await authenticatedFetch(
        `http://localhost:8000/projects/${projectId}/todos/`,
        "GET",
        user,
        setUser
      );

      if (todos === null) {
        history.push("/login");
      } else if (Array.isArray(todos)) {
        const newBoard = stageValues.map((stage) =>
          todos.filter((todo) => todo.stage === stage)
        );

        setBoard(newBoard);
      }
    };
    getProjects();
  }, [projectId, setUser, user, history]);

  if (user === null) {
    history.push("/login");
  }

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(board[sInd], source.index, destination.index);
      const newState = [...board];
      newState[sInd] = items;
      setBoard(newState);
    } else {
      const result = move(board[sInd], board[dInd], source, destination);
      const newState = [...board];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      newState[dInd][destination.index].stage = stageValues[dInd];
      updateTask(newState[dInd][destination.index]);
      setBoard(newState);
    }
  };

  const updateTask = (task) => {
    authenticatedFetch(
      `http://localhost:8000/projects/${projectId}/todos/${task.id}/`,
      "PUT",
      user,
      setUser,
      {
        id: task.id,
        stage: task.stage,
        name: task.name,
      }
    );
  };

  const deleteTask = (e, taskId, taskIndex, stageIndex) => {
    e.preventDefault();
    authenticatedFetch(
      `http://localhost:8000/projects/${projectId}/todos/${taskId}/`,
      "DELETE",
      user,
      setUser
    );

    const newState = [...board];

    newState[stageIndex].splice(taskIndex, 1);
    setBoard(newState);
  };

  return (
    <div className="flex space-x-1 overflow-x-scroll h-full w-full">
      <DragDropContext onDragEnd={onDragEnd}>
        {board.map((stage, stageIndex) => (
          <Droppable key={stageIndex} droppableId={`${stageIndex}`}>
            {(provided, snapshot) => (
              <section
                ref={provided.innerRef}
                className="max-w-xs w-full h-full flex-shrink-0 flex-col space-y-2 rounded-md hover:bg-gray-100 hover:shadow-xl transition-all duration-200 p-2"
                {...provided.droppableProps}
              >
                <h2 className="text-center text-lg font-bold uppercase">
                  {stageNames[stageIndex]}
                </h2>
                {/* <Container> */}
                {stage.map((todo, todoIndex) => (
                  <Draggable
                    key={`${todo.id}`}
                    draggableId={`${todo.id}`}
                    index={todoIndex}
                  >
                    {(provided, snapshot) => (
                      <TodoItem
                        todo={todo}
                        todoIndex={todoIndex}
                        stageIndex={stageIndex}
                        provided={provided}
                        deleteTask={deleteTask}
                        board={board}
                        setBoard={setBoard}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {stageIndex === 0 ? (
                  <AddTaskForm
                    stageIndex={stageIndex}
                    user={user}
                    setUser={setUser}
                    projectId={projectId}
                    board={board}
                    setBoard={setBoard}
                    stage={stageValues[stageIndex]}
                  />
                ) : (
                  ""
                )}
              </section>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

export default DeskopView;
