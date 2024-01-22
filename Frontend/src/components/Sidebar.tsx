import React from "react";

const Sidebar = () => {
  const getUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = getUser ? JSON.parse(getUser) : null;

  return (
    <>
      <div
        data-testid="side-bar"
        className="antialiased bg-gray-50 dark:bg-gray-900"
      >
        <aside
          className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-[180px] bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
          aria-label="Sidenav"
          id="drawer-navigation"
        >
          <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
            <ul className="space-y-2">
              <li>
                <a
                  href="/home"
                  className="flex  items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <img
                    src="https://img.icons8.com/ios-filled/50/conference-call.png"
                    alt="People Icon"
                    className="w-8 order-last md:order-first bg-white rounded-[10px] p-1"
                  />

                  <span className="md:visible invisible ml-3">My Tasks</span>
                </a>
              </li>

              {user &&
                (user.user.role === "OWNER" || user.user.role === "ADMIN") && (
                  <li>
                    <a
                      href="/home/task-management"
                      className="flex  items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      <img
                        src="https://img.icons8.com/ios-filled/50/conference-call.png"
                        alt="People Icon"
                        className="w-8 order-last md:order-first bg-white rounded-[10px] p-1"
                      />

                      <span className="md:visible invisible ml-3">
                        Task Management
                      </span>
                    </a>
                  </li>
                )}

              {user && user.user.role === "OWNER" && (
                <li>
                  <a
                    href="/home/user-management"
                    className="flex  items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <img
                      src="https://img.icons8.com/ios-filled/50/conference-call.png"
                      alt="People Icon"
                      className="w-8 order-last md:order-first bg-white rounded-[10px] p-1"
                    />

                    <span className="md:visible invisible ml-3">
                      User Management
                    </span>
                  </a>
                </li>
              )}
            </ul>
            <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700"></ul>
          </div>
          <div className="hidden absolute bottom-0 left-0 justify-center p-4 space-x-4 w-full lg:flex bg-white dark:bg-gray-800 z-20"></div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
