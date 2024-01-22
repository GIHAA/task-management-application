import React from "react";

const Header = () => {

  const getuser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = getuser ? JSON.parse(getuser) : null;



  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <nav
        data-testid="header"
        className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50"
      >
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex justify-start items-center">
            <a href="/home" className="flex items-center justify-between mr-4">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Task Manager
              </span>
            </a>
          </div>

          <div className="flex items-center lg:order-2">
            <div className="flex items-center">
              <div className="flex-1 min-w-0 ms-4">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  {user?.user.firstName + " " + user?.user.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                 Role : {user?.user.role}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={handleLogout}
            >

              logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
