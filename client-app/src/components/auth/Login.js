import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import { UserContext } from "../../App";

const Login = () => {
  const history = useHistory();
  const { setUser } = useContext(UserContext);
  const { register, handleSubmit } = useForm();
  const login = async (data) => {
    console.log(data.username, data.password);
    fetch("http://localhost:8000/auth/jwt/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }), // body data type must match "Content-Type" header
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Invalid Credentials");
        }

        return res.json();
      })
      .then((userInfo) => {
        setUser({
          username: data.username,
          access: userInfo.access,
          refresh: userInfo.refresh,
        });

        history.push("/");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <section class="h-screen">
        <div class="px-6 h-full text-gray-800">
          <img
            src="https://i.ibb.co/LRDxw9q/download.png"
            class="w-full"
            alt="Sample image"
          />
          <div
            id="signIn"
            class="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6"
          >
            <div class="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                class="w-full"
                alt="Sample image"
              />
            </div>
            <div class="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
              <p className="text-lg mb-0 mr-4">Sign In</p>
              <form onSubmit={handleSubmit(login)}>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-5 text-gray-700"
                  >
                    Username
                  </label>
                  <div className="mt-1 rounded-md shadow-sm">
                    <input
                      id="usrname"
                      name="username"
                      type="text"
                      ref={register}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-red focus:border-red-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-5 text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 rounded-md shadow-sm">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      ref={register}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-red focus:border-red-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <span className="block w-full rounded-md shadow-sm">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:border-gray-600 focus:shadow-outline-red active:bg-gray-600 transition duration-150 ease-in-out"
                    >
                      Sign in
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
