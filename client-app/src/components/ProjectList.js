import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext, ProjectContext } from "../App";
import authenticatedFetch from "../utils/authenticatedFetch.js";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const AddProjectForm = ({ projects, setProjects }) => {
  const nameRef = useRef();
  const { user, setUser } = useContext(UserContext);
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const addNewProject = async (e) => {
    e.preventDefault();
    if (
      nameRef.current.value !== "" &&
      nameRef.current.value !== undefined &&
      nameRef.current.value !== null
    ) {
      const newProject = await authenticatedFetch(
        `http://localhost:8000/projects/`,
        "POST",
        user,
        setUser,
        {
          name: nameRef.current.value,
        }
      );
      setProjects([...projects, newProject]);
    } else {
      setIsOpen(true);

      // alert("Project Title Cannot be Empty");
      // alert("Please Provide a Title");
    }
    nameRef.current.value = "";
  };

  return (
    <>
      <form onSubmit={(e) => addNewProject(e)}>
        <label htmlFor="newProject" className="sr-only">
          Add new project
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <div className="relative flex-grow focus-within:z-10">
            <input
              id="newProject"
              name="newProject"
              ref={nameRef}
              className="form-input block w-full rounded-none rounded-l-md transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              placeholder="Create a New Project."
            />
          </div>
          <button
            type="submit"
            className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-cyan-300 hover:text-gray-500 hover:bg-cyan-200 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
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
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Project Creation Error
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Project Title can't be Empty
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const ProjectCard = ({ project }) => {
  return (
    <div
      to={`/${project.id}`}
      className="relative  flex shadow-sm rounded-md border-t border-r border-b border-gray-200 bg-white rounded-md"
    >
      <div className="flex-shrink-0 flex items-center justify-center w-4 bg-blue-600 border-blue-600 border uppercase text-white text-sm leading-5 font-medium rounded-l-md"></div>
      <Link
        to={`/${project.id}`}
        className="flex-1 flex items-center justify-between"
      >
        <div className="flex-1 px-4 py-2 text-md leading-5-truncate">
          <h3 className="text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150">
            {project.name}
          </h3>
          <p className="text-gray-500 text-sm">
            {project.members.length} Members
          </p>
        </div>
      </Link>
    </div>
  );
};

const ProjectList = () => {
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);
  const { setProject } = useContext(ProjectContext);

  useEffect(() => setProject(null), [setProject]);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      const proj = await authenticatedFetch(
        "http://localhost:8000/projects/",
        "GET",
        user,
        setUser
      );
      setProjects(proj);
    };
    getProjects();
  }, [user, setUser, setProjects, setProject]);

  if (user === null) {
    history.push("/login");
  }

  return (
    user && (
      <>
        <h1 className="text-3xl font-bold mb-4">Projects</h1>
        <div className="grid gap-4  md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <AddProjectForm projects={projects} setProjects={setProjects} />
        </div>
        <div className="grid mt-8 gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(projects) &&
            projects.map((project) => (
              <div>
                <ProjectCard project={project} key={project.id} />
              </div>
            ))}
        </div>
      </>
    )
  );
};

export default ProjectList;
