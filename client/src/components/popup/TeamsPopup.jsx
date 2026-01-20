import React from "react";

const TermsPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 sm:p-4 md:p-6 lg:p-6 z-50">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-medium mb-4 text-blue-900">
          ข้อกำหนดและเงื่อนไข
        </h2>
        <p className="text-xs sm:text-sm">
          โปรดอ่านข้อกำหนดและเงื่อนไขเหล่านี้อย่างละเอียดก่อนใช้บริการของเรา
          การที่คุณใช้บริการของเราแสดงว่าคุณยอมรับข้อกำหนดและเงื่อนไขเหล่านี้
        </p>
        <h3 className="text-md sm:text-lg font-medium mt-4 text-blue-900">
          1. การใช้งานบริการ
        </h3>
        <p className="text-xs sm:text-sm">
          คุณต้องปฏิบัติตามข้อกำหนดและเงื่อนไขเหล่านี้เมื่อใช้บริการของเรา
          การละเมิดข้อกำหนดและเงื่อนไขอาจทำให้คุณถูกยกเลิกการให้บริการโดยไม่มีการคืนเงิน
        </p>
        <h3 className="text-md sm:text-lg font-medium mt-4 text-blue-900">
          2. การลงทะเบียน
        </h3>
        <p className="text-xs sm:text-sm">
          เพื่อใช้บริการบางอย่าง
          คุณอาจต้องลงทะเบียนและให้ข้อมูลที่ถูกต้องและเป็นปัจจุบัน
          คุณต้องรับผิดชอบในการรักษาความลับของบัญชีและรหัสผ่านของคุณ
        </p>
        <h3 className="text-md sm:text-lg font-medium mt-4 text-blue-900">
          3. ความรับผิดชอบ
        </h3>
        <p className="text-xs sm:text-sm">
          เราไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดจากการใช้บริการของเรา
          การใช้บริการของเราอยู่ภายใต้ความเสี่ยงของคุณเอง
        </p>
        <h3 className="text-md sm:text-lg font-medium mt-4 text-blue-900">
          4. การเปลี่ยนแปลงบริการ
        </h3>
        <p className="text-xs sm:text-sm">
          เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงหรือยกเลิกบริการของเราได้ทุกเวลาโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
        </p>
        <h3 className="text-md sm:text-lg font-medium mt-4 text-blue-900">
          5. กฎหมายที่ใช้บังคับ
        </h3>
        <p className="text-xs sm:text-sm">
          ข้อกำหนดและเงื่อนไขเหล่านี้อยู่ภายใต้กฎหมายของประเทศไทย
          หากมีข้อพิพาทเกิดขึ้นจะต้องถูกพิจารณาในศาลที่มีเขตอำนาจในประเทศไทย
        </p>
        <br />
        <p className="text-xs sm:text-sm">
          หากคุณมีคำถามหรือข้อสงสัยเกี่ยวกับข้อกำหนดและเงื่อนไขนี้
          กรุณาติดต่อเราได้ที่{" "}
          <span className="font-medium text-blue-900">
            contact@homeservices.co
          </span>
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          ปิด
        </button>
      </div>
    </div>
  );
};

export default TermsPopup;
