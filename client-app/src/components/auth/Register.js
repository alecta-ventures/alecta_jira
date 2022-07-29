import React, { useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../App";
import { useHistory } from "react-router-dom";

const Register = () => {
  const history = useHistory();
  const { setUser } = useContext(UserContext);
  const { register, handleSubmit, watch, errors } = useForm();
  const password = useRef({});
  password.current = watch("password", "");

  const passwordValidator = (value) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters.";
    }
    if (value === "password") {
      return "Password is too common.";
    }
    if (!isNaN(value)) {
      return "Password cannot be fully numeric.";
    }
  };

  const registerUser = (data) => {
    fetch("http://localhost:8000/auth/users/", {
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
        if (res.status !== 201) {
          throw new Error("Error creating your account");
        }

        res.json();
      })
      .then((userInfo) =>
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
          .then((res) => res.json())
          .then((userInfo) => {
            setUser({
              username: data.username,
              access: userInfo.access,
              refresh: userInfo.refresh,
            });
            history.push("/");
          })
          .catch((error) => alert("Invalid credentials"))
      )
      .catch((error) => {
        alert("An error occurred when creating your account");
      });
  };

  return (
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/3 sm:w-1/3">
        <div class="flex justify-center">
            <img src={require("../../assets/img/branding.png")} style={{height: "100px" , width:"100px"}}></img>
        </div>
        <h3 class="text-2xl font-bold text-center">Join us</h3>
        <form onSubmit={handleSubmit(registerUser)}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Username
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="username"
                  name="username"
                  type="text"
                  ref={register}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-red-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
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
                  ref={register({
                    validate: (value) => passwordValidator(value),
                  })}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-red-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 px-3">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="mt-6">
              <label
                htmlFor="password-confirm"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Password Confirmation
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="password-confirm"
                  name="passwordConfirm"
                  type="password"
                  ref={register({
                    validate: (value) =>
                      value === password.current ||
                      "The passwords do not match",
                  })}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-red-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
              {errors.passwordConfirm && (
                <p className="text-sm text-red-600 px-3">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </div>
            <div className="mt-6">
              <span className="block w-full rounded-md shadow-sm">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-b-700 transition duration-150 ease-in-out"
                >
                  Sign up
                </button>
              </span>
            </div>
          </form>
    </div>
</div>
    

  );
};

export default Register;