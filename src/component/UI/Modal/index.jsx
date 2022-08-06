import React from "react";

const Modal = ({ openModal, children, modalRef }) => {
  return (
    <>
      {openModal && (
        <>
          <dialog open ref={modalRef} className="custom_modal">
            {children}
          </dialog>
          <div className="backdrop_effect_blur"></div>
        </>
      )}
    </>
  );
};

export default Modal;
