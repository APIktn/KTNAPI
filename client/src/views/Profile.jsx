import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar_user from "../components/Navbar_user";
import editIcon from "../assets/icons/edit-icon.png";
import { ClipLoader } from "react-spinners";
import PasswordChangePopup from "../components/popup/PasswordChangePopup";

function UserProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    tel_num: "",
    select_image: "profile_image",
    ad_detail: "",
    ad_subdistrict: "",
    ad_district: "",
    ad_province: "",
    ad_moredetail: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/user/profile");
      if (response.data.user) {
        setUserData(response.data.user);
        setFormData({
          firstname: response.data.user.firstname,
          lastname: response.data.user.lastname,
          email: response.data.user.email,
          tel_num: response.data.user.tel_num,
          select_image: response.data.user.select_image || "profile_image",
          ad_detail: response.data.user.ad_detail || "",
          ad_subdistrict: response.data.user.ad_subdistrict || "",
          ad_district: response.data.user.ad_district || "",
          ad_province: response.data.user.ad_province || "",
          ad_moredetail: response.data.user.ad_moredetail || "",
        });
        setLoading(false);
      } else {
        setError("ไม่พบข้อมูลผู้ใช้งาน");
        setLoading(false);
      }
    } catch (error) {
      console.error("API Error:", error.response?.data?.error || error.message);
      setError(
        error.response?.data?.error || "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน"
      );
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSave = async () => {
    setSubmitLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:4000/user/profile",
        formData
      );
      console.log("Response from server:", response.data);
      if (
        response.status === 200 &&
        response.data.message === "อัปเดตข้อมูลผู้ใช้สำเร็จ"
      ) {
        setUserData(response.data.data);

        if (profileImage) {
          const formData = new FormData();
          formData.append("profile_image", profileImage);

          const uploadResponse = await axios.post(
            "http://localhost:4000/user/upload-profile-image",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Upload Response from server:", uploadResponse.data);
        }

        setIsEditing(false);
        setSubmitLoading(false);
        window.location.reload();
      } else {
        setError("เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้งาน");
        setSubmitLoading(false);
      }
    } catch (error) {
      console.error("API Error:", error.response?.data?.error || error.message);
      setError(
        error.response?.data?.error ||
          "เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้งาน"
      );
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <Navbar_user />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {loading ? (
          <div className="flex justify-center items-center w-full h-[500px]">
            <ClipLoader size={200} color={"#123abc"} loading={loading} />
          </div>
        ) : (
          <div className="w-full max-w-4xl mt-5 bg-white rounded-lg mx-5 lg:mx-0 border border-gray-300 shadow-md relative">
            <div className="relative">
              <div className="bg-blue-500 h-32 rounded-t-lg"></div>
              <button
                className="absolute top-0 right-0 p-1 m-2"
                onClick={() => setIsEditing(!isEditing)}
              >
                <img
                  src={editIcon}
                  alt="Edit"
                  className="h-8 w-8 icon-edit p-1"
                />
              </button>

              <div className="flex justify-center lg:justify-start relative">
                <img
                  className="h-32 w-32 rounded-full lg:ml-10 object-cover absolute -bottom-16 border-4 border-white"
                  src={
                    formData.select_image === "profile_image"
                      ? userData.profile_image
                      : userData.upload_image
                  }
                  alt="Profile"
                />
              </div>
            </div>
            <div className="p-8 pt-0 mt-16 lg:mt-0 ">
              {isEditing ? (
                <form>
                  <div className="mb-4 mt-20">
                    <label className="block text-sm font-medium text-gray-700">
                      ชื่อ
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      placeholder="กรุณากรอกชื่อ"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      นามสกุล
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      placeholder="กรุณากรอกนามสกุล"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      อีเมล
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="กรุณากรอกอีเมล"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      เบอร์โทรศัพท์
                    </label>
                    <input
                      type="text"
                      name="tel_num"
                      value={formData.tel_num}
                      onChange={handleInputChange}
                      placeholder="กรุณากรอกเบอร์โทรศัพท์"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      เลือกรูปโปรไฟล์
                    </label>
                    <select
                      name="select_image"
                      value={formData.select_image}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="profile_image">รูปโปรไฟล์เริ่มต้น</option>
                      <option value="upload_image">รูปโปรไฟล์ที่อัปโหลด</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      อัปโหลดรูปโปรไฟล์ใหม่
                    </label>
                    <input
                      type="file"
                      name="profile_image"
                      onChange={handleImageChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      ที่อยู่
                    </label>
                    <input
                      type="text"
                      name="ad_detail"
                      value={formData.ad_detail}
                      onChange={handleInputChange}
                      placeholder="กรุณากรอกที่อยู่"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      แขวง / ตำบล
                    </label>
                    <input
                      type="text"
                      name="ad_subdistrict"
                      value={formData.ad_subdistrict}
                      onChange={handleInputChange}
                      placeholder="กรุณากรอก แขวง / ตำบล"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      เขต / อำเภอ
                    </label>
                    <input
                      type="text"
                      name="ad_district"
                      value={formData.ad_district}
                      onChange={handleInputChange}
                      placeholder="กรุณากรอก เขต / อำเภอ"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      จังหวัด
                    </label>
                    <input
                      type="text"
                      name="ad_province"
                      value={formData.ad_province}
                      onChange={handleInputChange}
                      placeholder="กรุณากรอกจังหวัด"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      ระบุข้อมูลเพิ่มเติม
                    </label>
                    <input
                      type="text"
                      name="ad_moredetail"
                      value={formData.ad_moredetail}
                      onChange={handleInputChange}
                      placeholder=""
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsPasswordPopupOpen(true)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      เปลี่ยนรหัสผ่าน
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      disabled={submitLoading}
                    >
                      {submitLoading ? "กำลังบันทึก..." : "บันทึก"}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-2xl font-medium mb-8 mt-1 lg:text-left text-center text-blue-950 lg:pl-36">
                    {userData.firstname} {userData.lastname}
                  </h2>
                  <div className="lg:flex lg:flex-row flex-col gap-5">
                    <div>
                      <h3>ข้อมูลส่วนตัว</h3>
                      <p className="text-sm text-gray-700">{userData.email}</p>
                      <p className="text-sm text-gray-700">
                        {userData.tel_num}
                      </p>
                    </div>
                    <div>
                      <h3>ที่อยู่</h3>
                      <p className="text-sm text-gray-700">
                        {userData.ad_detail}
                      </p>
                      <p className="text-sm text-gray-700">
                        {userData.ad_subdistrict}
                      </p>
                      <p className="text-sm text-gray-700">
                        {userData.ad_district}
                      </p>
                      <p className="text-sm text-gray-700">
                        {userData.ad_province}
                      </p>
                      <p className="text-sm text-gray-700">
                        {userData.ad_moredetail}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {isPasswordPopupOpen && (
          <PasswordChangePopup onClose={() => setIsPasswordPopupOpen(false)} />
        )}
      </div>
    </>
  );
}

export default UserProfilePage;
