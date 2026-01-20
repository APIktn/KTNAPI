import React, { useState } from "react";
import { checkUpdatePasswordErrors } from "../../utils/errors";
import axios from "axios";

const PasswordChangePopup = ({ onClose }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const validationErrors = checkUpdatePasswordErrors(passwordData);
    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }
    setPasswordErrors({});
    try {
      const response = await axios.put(
        "http://localhost:4000/user/change-password",
        passwordData
      );
      if (
        response.status === 200 &&
        response.data.message === "เปลี่ยนรหัสผ่านสำเร็จ"
      ) {
        alert("เปลี่ยนรหัสผ่านสำเร็จ");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        onClose();
      } else {
        setPasswordErrors({ general: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" });
      }
    } catch (error) {
      console.error("API Error:", error.response?.data?.error || error.message);
      setPasswordErrors({
        general:
          error.response?.data?.error || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน",
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-5">
        <h3 className="text-xl font-medium text-gray-900 mb-4">
          เปลี่ยนรหัสผ่าน
        </h3>
        <form onSubmit={handleChangePassword}>
          {passwordErrors.general && (
            <p className="text-red-500 text-xs mb-4">
              {passwordErrors.general}
            </p>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              รหัสผ่านปัจจุบัน
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="กรุณากรอกรหัสผ่านปัจจุบัน"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {passwordErrors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">
                {passwordErrors.currentPassword}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              รหัสผ่านใหม่
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="กรุณากรอกรหัสผ่านใหม่"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {passwordErrors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {passwordErrors.newPassword}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              ยืนยันรหัสผ่านใหม่
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="กรุณายืนยันรหัสผ่านใหม่"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {passwordErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {passwordErrors.confirmPassword}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              เปลี่ยนรหัสผ่าน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangePopup;
