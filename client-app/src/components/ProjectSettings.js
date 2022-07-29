import React, { useContext, useRef, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import authenticatedFetch from "../utils/authenticatedFetch";
import { UserContext } from "../App";

const ProjectName = ({ project, setProject, user, setUser, projectId }) => {
  const ref = useRef();
  const [isEditable, setIsEditable] = useState(false);
  const [projectName, setProjectName] = useState(" ");
  useEffect(() => {
    const getProjects = async () => {
      const project = await authenticatedFetch(
        `http://localhost:8000/projects/${projectId}/`,
        "GET",
        user,
        setUser
      );
      setProject(await project);
      setProjectName(await project.name);
    };
    getProjects();
  }, [user, setUser, setProject, setProjectName, projectId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditable(false);
    const updateName = async () => {
      const changedProject = await authenticatedFetch(
        `http://localhost:8000/projects/${projectId}/`,
        "PUT",
        user,
        setUser,
        {
          id: projectId,
          name: ref.current.value,
        }
      );

      setProject(await changedProject);
      setProjectName(await changedProject.name);
    };
    updateName();
  };

  if (isEditable) {
    return (
      <>
      <form
        onSubmit={handleSubmit}
        style={{margin: "20px"}}
      >
        <div class="mb-6">
        <label  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Project Name</label>
        <input
          type="text"
          ref={ref}
          defaultValue={projectName}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
        </div>
        <button
          name="save"
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          save
        </button>
      </form>

      </>
    );
  }

  return (
    <div style={{margin: "20px"}}>
        <label  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Project Name</label>
        <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={projectName} required disabled readonly/>
      <br/>
      <button
        onClick={() => setIsEditable((prev) => !prev)}
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Edit
      </button>
    </div>
  );
};

const AddUserForm = () => {
  const nameRef = useRef();

  return (
    <form onSubmit={(e) => null}>
      <label htmlFor="newMember" className="sr-only">
        Add new member
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex-grow focus-within:z-10">
          <input
            id="newMember"
            name="newMember"
            ref={nameRef}
            className="form-input block w-full rounded-none rounded-l-md transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            placeholder="Username"
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

const ProjectSettings = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();

  const deleteProject = async () => {
    await authenticatedFetch(
      `http://localhost:8000/projects/${projectId}/`,
      "DELETE",
      user,
      setUser
    );

    history.push("/");
  };
  return (
    <>
      <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Project Settings</h1>
          </div>
          <br/>
          <ProjectName {...{ project, setProject, user, setUser, projectId }} />
          <div >
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-6">
    
          <div   style={{margin: "20px"}}>
            <h2 className="text-xl font-bold">Add a Member</h2>
            <AddUserForm />
          </div>

          Member list - can delete
          {project?.members &&
            Array.isArray(project.members) &&
            project.members.map((member) => <p>{member?.username}</p>)}
        </div>
        <div style={{margin: "20px"}}>
        <button
            onClick={deleteProject}
            class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Delete Project
          </button>
          <br/>
          <div className="h-10"/>
          </div>
      </div>
        </header>
      

    </>
  );
};

export default ProjectSettings;
