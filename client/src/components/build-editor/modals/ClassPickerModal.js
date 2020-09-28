import React from "react";

function ClassPickerModal({ selectClass, toggleClassPicker }) {
  return (
    <>
      <div
        className="class-picker-overlay"
        onClick={e => toggleClassPicker(e)}
      />
      <div className="class-picker-modal">
        <button name="btn-warlock" onClick={e => selectClass(e)}>
          Warlock
        </button>
        <button name="btn-hunter" onClick={e => selectClass(e)}>
          Hunter
        </button>
        <button name="btn-titan" onClick={e => selectClass(e)}>
          Titan
        </button>
      </div>
    </>
  );
}

export default ClassPickerModal;
