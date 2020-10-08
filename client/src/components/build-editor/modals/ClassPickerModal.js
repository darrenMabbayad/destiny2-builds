import React, { useContext, useState } from "react";
import { DestinyContext } from "../../../context/DestinyContext";

function ClassPickerModal({ selectClass, toggleClassPicker }) {
  const { getSubClass } = useContext(DestinyContext);
  const [subClasses, setSubClasses] = useState([]);
  function selectClassAndGetSubClasses(e) {
    const { name } = e.target;
    const list = getSubClass(name);
    setSubClasses(list);
    selectClass(e);
  }
  return (
    <>
      <div
        className="class-picker-overlay"
        onClick={e => toggleClassPicker(e)}
      />
      <div className="class-picker-modal">
        <button
          name="btn-warlock"
          onClick={e => selectClassAndGetSubClasses(e)}
        >
          Warlock
        </button>
        <button name="btn-hunter" onClick={e => selectClassAndGetSubClasses(e)}>
          Hunter
        </button>
        <button name="btn-titan" onClick={e => selectClassAndGetSubClasses(e)}>
          Titan
        </button>
      </div>
    </>
  );
}

export default ClassPickerModal;
