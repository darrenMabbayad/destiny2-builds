import React, { useContext, useState } from "react";
import { DestinyContext } from "../../../context/DestinyContext";

function ClassPickerModal({
  currentClass,
  currentSubClass,
  selectClass,
  selectClassElement,
  toggleClassPicker,
}) {
  const { getSubClass } = useContext(DestinyContext);
  const [subClasses, setSubClasses] = useState(
    currentClass ? getSubClass(currentClass) : []
  );
  const currentElement = currentSubClass.element;

  function selectClassAndGetSubClasses(e) {
    const { name } = e.target;
    const list = getSubClass(name);
    setSubClasses(list);
    selectClass(e);
  }

  function getElementClassName(element) {
    let className = currentClass ? currentClass : "";
    if (element === "arc") {
      className = `class-picker-element-img arc-class`;
    } else if (element === "solar") {
      className = `class-picker-element-img solar-class`;
    } else if (element === "void") {
      className = `class-picker-element-img void-class`;
    }
    return className;
  }

  return (
    <>
      <div
        className="class-picker-overlay"
        onClick={e => toggleClassPicker(e)}
      />
      {!currentClass && (
        <div className="class-picker-modal">
          <button
            name="btn-warlock"
            onClick={e => selectClassAndGetSubClasses(e)}
          >
            Warlock
          </button>
          <button
            name="btn-hunter"
            onClick={e => selectClassAndGetSubClasses(e)}
          >
            Hunter
          </button>
          <button
            name="btn-titan"
            onClick={e => selectClassAndGetSubClasses(e)}
          >
            Titan
          </button>
        </div>
      )}
      {currentClass && !currentElement && (
        <div className="class-picker-element-images">
          {subClasses.map((subClass, index) => (
            <div key={index} className={getElementClassName(subClass.element)}>
              <img
                id={subClass.element}
                src={`http://www.bungie.net/${subClass.icon}`}
                alt=""
                onClick={e => selectClassElement(e)}
              />
            </div>
          ))}
        </div>
      )}
      {currentClass && currentElement && <div>TODO</div>}
    </>
  );
}

export default ClassPickerModal;
