import React from "react";
import SearchModule from "./SearchModule";

function HomePageModule() {
  return (
    <div className="container my-[103px] w-full h-auto flex flex-col items-center justify-center gap-y-8">
      <div className="main-content__title flex flex-col items-center justify-center gap-y-2.5">
        <h1 className="text-darkBlue-1 dark:text-blue-700 font-black text-5xl text-center">
          The Quick Blog
        </h1>
        <span className="text-xl text-gray-500 dark:text-gray-400">
          Lorem ipsum dolor sit amet
        </span>
      </div>
      <SearchModule />
    </div>
  );
}

export default HomePageModule;
