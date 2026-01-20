import React, { useState, useEffect } from "react";
import houseLogo from "../assets/images/house-logo.png";

function BannerFooter() {
  const [isXL, setIsXL] = useState(false);

  // Function to check screen size
  const checkScreenSize = () => {
    setIsXL(window.innerWidth >= 1280);
  };

  useEffect(() => {
    // Set initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div className="pl-4 pr-4 pt-8 relative bg-[#336DF2] h-96 w-full flex flex-col xl:justify-center items-center text-center overflow-hidden">
      {isXL ? (
        <div className="xl:w-[850px] xl:justify-center xl:items-center">
          <p className="text-[16px] xl:text-[20px] xl:leading-10 text-white">
            เพราะเราคือช่าง ผู้ให้บริการเรื่องบ้านอันดับ 1 แบบครบวงจร
            โดยทีมช่างมืออาชีพ มากกว่า 100 ทีม
            <br />
            สามารถตอบโจทย์ด้านการบริการเรื่องบ้านของคุณ และสร้าง
            <br />
            ความสะดวกสบายในการติดต่อกับทีมช่าง ได้ทุกที่ ทุกเวลา ตลอด 24 ชม.
            <br />
            มั่นใจ ช่างไม่ทิ้งงาน พร้อมรับประกันคุณภาพงาน
          </p>
        </div>
      ) : (
        <div className="xl:w-[600px] xl:justify-center xl:items-center">
          <p className="text-[16px] xl:text-[20px] xl:leading-10 text-white">
            เพราะเราคือช่าง ผู้ให้บริการเรื่องบ้านอันดับ 1 <br />
            แบบครบวงจร โดยทีมช่างมืออาชีพ <br />
            มากกว่า 100 ทีมสามารถตอบโจทย์ด้านการบริการเรื่องบ้านของคุณ และสร้าง{" "}
            <br />
            ความสะดวกสบายในการติดต่อกับทีมช่าง
            <br />
            ได้ทุกที่ ทุกเวลา ตลอด 24 ชม. <br />
            มั่นใจ ช่างไม่ทิ้งงาน <br />
            พร้อมรับประกันคุณภาพงาน
          </p>
        </div>
      )}
      <img
        src={houseLogo}
        alt="House Logo"
        className="absolute bottom-0 max-xl:left-1/2 transform -translate-x-1/2 z-10 xl:translate-x-0 xl:right-[-12%] xl:h-[calc(80%+96px)]"
      />
    </div>
  );
}

export default BannerFooter;
