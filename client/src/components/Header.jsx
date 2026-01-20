import React, { useState, useEffect } from "react";
import PointGuy from "../assets/images/PointGuy.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [subIndex, setSubIndex] = useState(1); // Start after the fixed prefix
  const [typing, setTyping] = useState(true);
  const [typingDelay, setTypingDelay] = useState(150); // Adjust typing speed here

  const textArray = ["ให้เราช่วยดูแลคุณ"];
  const prefix = "เรื่องบ้าน..."; // The fixed part that shouldn't be deleted

  useEffect(() => {
    if (subIndex > textArray[0].length) {
      setTyping(false); // Stop typing when the full text is displayed
      return;
    }

    if (typing) {
      const timeout = setTimeout(() => {
        setText(textArray[0].substring(0, subIndex + 1));
        setSubIndex((prev) => prev + 1);
      }, typingDelay);

      return () => clearTimeout(timeout);
    }
  }, [subIndex, typing]);

  const handleMenuItemClick = (path) => {
    navigate(path);
  };

  return (
    <header className="bg-blue-100 overflow-hidden">
      <div className="container mx-auto px-4 md:px-20 grid lg:grid-cols-2 justify-items-stretch items-stretch">
        <div className="relative">
          <h1 className="text-[40px] sm:text-4xl lg:text-5xl lg:pt-20 pt-[56px] font-semibold text-blue-700">
            เรื่องบ้าน...{text}
            <span
              className={`inline-block h-8 w-1  ${
                typing ? "animate-pulse bg-black" : ""
              }`}
            ></span>
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl mt-[16px] lg:mt-4 font-medium">
            "สะดวก ราคาคุ้มค่า เชื่อถือได้"
          </p>
          <div className="text-[#646C80] mt-[32px] lg:mt-[39px] text-lg sm:text-lg lg:text-lg font-medium">
            <p>ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์</p>
            <p>ทำความสะอาดบ้าน</p>
            <p>โดยพนักงานแม่บ้าน และช่างมืออาชีพ</p>
          </div>
          <button
            onClick={() => handleMenuItemClick("/servicelist")}
            className="mt-[32px] lg:mt-[39px] px-4 sm:px-6 py-2 lg:mb-[90px] text-[20px] bg-blue-600 text-white rounded"
          >
            เช็คราคาบริการ
          </button>
        </div>
        <div className="justify-self-end self-end">
          <img
            src={PointGuy}
            alt="Point Guy"
            className="hidden md:block h-120"
          />
          <img
            src={PointGuy}
            alt="Point Guy2"
            className="block sm:hidden h-120 ml-10"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
