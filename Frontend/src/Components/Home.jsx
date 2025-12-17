import React from "react";

const Home = () => {
  return (
    <section
      className="h-[75vh] w-full bg-gradient-to-r from-[rgba(237,137,248,0.5)] to-[rgb(123,200,248)] flex flex-row justify-evenly shadow-2xl"
    >
      {/* Feature Text Section */}
      <div className="feature-text self-center">
        <div className="font-bold">
            <p className="font-bold font-sans text-[78px] mb-[-15px]">Find Your</p>
            <p className="font-bold font-sans text-[78px] mb-[-15px]">items With</p>
            <p className="font-bold font-sans text-[78px] mb-[-15px]">CUETFinders</p>
        </div>
        <p className="font-sans text-start mt-2">
          Experience effortless recovery with our dedicated lost and found service
        </p>
      </div>

      {/* Additional Contents Section */}
      <div className="additional-contents flex flex-col items-center self-start justify-evenly">
        {/* Lost Button */}
        <button
          className="lost-button h-[55px] w-[150px] mt-[80px] bg-[rgb(241,11,11)] flex flex-row justify-between items-center border-none rounded-[6px] cursor-pointer"
          onClick={() => (window.location.href = "/lost")}
        >
          <p className="text-white font-sans text-[24px] pl-[7px]">Lost</p>
          <img
            src="lost item icon.png"
            alt="Lost Icon"
            className="h-[50px] w-[50px] pr-[5px]"
          />
        </button>

        {/* Found Button */}
        <button
          className="found-button h-[55px] w-[150px] mt-[10px] bg-[rgb(3,194,23)] flex flex-row justify-between items-center border-none rounded-[6px] cursor-pointer"
          onClick={() => (window.location.href = "/found")}
        >
          <p className="text-white font-sans text-[24px] pl-[7px]">Found</p>
          <img
            src="found icon.png"
            alt="Found Icon"
            className="h-[50px] w-[50px] pr-[5px]"
          />
        </button>

        {/* Home Pictures */}
        <div id="home-pic" className="relative w-[300px] h-[400px]">
          <img
            src="home pic 3.png"
            alt="Home Pic 3"
            className="pic3 absolute top-0 left-1/2 mt-[20px] transform -translate-x-[82%] z-[3]"
          />
          <img
            src="home pic2.png"
            alt="Home Pic 2"
            className="pic2 absolute bottom-[37%] left-[70%] transform -translate-x-1/2 z-[2]"
          />
          <img
            src="home pic1.png"
            alt="Home Pic 1"
            className="pic1 absolute bottom-[25%] left-[120%] transform -translate-x-[60%] z-[1]"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;