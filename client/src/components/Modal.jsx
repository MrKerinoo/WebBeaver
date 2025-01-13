import React from "react";
import { MdClose } from "react-icons/md";

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-[400px] rounded-lg border-2 border-secondary bg-primary p-6">
        <button
          className="absolute right-2 top-2 text-white hover:text-secondary"
          onClick={onClose}
        >
          <MdClose className="text-2xl" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
