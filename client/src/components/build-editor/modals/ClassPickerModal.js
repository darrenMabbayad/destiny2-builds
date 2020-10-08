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
  const [subClassList, setSubClassList] = useState(
    currentClass ? getSubClass(currentClass) : []
  );
  const [subClassByElement, setSubClassByElement] = useState({});
  const currentElement = currentSubClass.element;

  function selectClassAndGetSubClasses(e) {
    const { name } = e.target;
    const list = getSubClass(name);
    setSubClassList(list);
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

  function selectElementandRenderTalents(e) {
    selectClassElement(e);
    const { id } = e.target;
    for (const item of subClassList) {
      const subClass = item;
      if (subClass.element === id) {
        setSubClassByElement({ ...subClass });
      }
    }
  }

  function selectTree(tree, icon) {}

  console.log(subClassList);

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
          {subClassList.map((subClass, index) => (
            <div key={index} className={getElementClassName(subClass.element)}>
              <img
                id={subClass.element}
                src={`http://www.bungie.net${subClass.icon}`}
                alt=""
                onClick={e => selectElementandRenderTalents(e)}
              />
            </div>
          ))}
        </div>
      )}
      {currentClass && currentElement && (
        <div className="class-picker-talent-grid">
          <div className="class-picker-talent-grid-skills">
            <div className="class-picker-talent-grid-class-specialty">
              {subClassByElement.classSpecialties.map((ability, index) => (
                <div
                  key={index}
                  className="class-picker-talent-grid-class-specialty-skill"
                >
                  <img src={`http://www.bungie.net${ability.icon}`} alt="" />
                </div>
              ))}
            </div>
            <div className="class-picker-talent-grid-abilities">
              <div className="class-picker-talent-grid-grenades">
                {subClassByElement.grenades.map((grenade, index) => (
                  <div key={index}>
                    <img src={`http://www.bungie.net${grenade.icon}`} alt="" />
                  </div>
                ))}
              </div>
              <div className="class-picker-talent-grid-class-icon">
                <img
                  src={`http://www.bungie.net${subClassByElement.secondaryIcon}`}
                  alt=""
                />
              </div>
              <div className="class-picker-talent-grid-jumps">
                {subClassByElement.movementModes.map((jump, index) => (
                  <div key={index}>
                    <img src={`http://www.bungie.net${jump.icon}`} alt="" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="class-picker-talent-grid-trees">
            <div className="class-picker-talent-grid-trees-icons-container">
              {subClassByElement.firstPath.talents.map((path, index) => (
                <div
                  key={index}
                  className="class-picker-talent-grid-trees-icon"
                >
                  <img
                    src={`http://www.bungie.net${path.icon}`}
                    alt=""
                    onClick={() =>
                      selectTree("top", subClassByElement.firstPath.icon)
                    }
                  />
                </div>
              ))}
            </div>
            <div className="class-picker-talent-grid-trees-icons-container">
              {subClassByElement.thirdPath.talents.map((path, index) => (
                <div
                  key={index}
                  className="class-picker-talent-grid-trees-icon"
                >
                  <img
                    src={`http://www.bungie.net${path.icon}`}
                    alt=""
                    onClick={() =>
                      selectTree("middle", subClassByElement.thirdPath.icon)
                    }
                  />
                </div>
              ))}
            </div>
            <div className="class-picker-talent-grid-trees-icons-container">
              {subClassByElement.secondPath.talents.map((path, index) => (
                <div
                  key={index}
                  className="class-picker-talent-grid-trees-icon"
                >
                  <img
                    src={`http://www.bungie.net${path.icon}`}
                    alt=""
                    onClick={() =>
                      selectTree("bottom", subClassByElement.secondPath.icon)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ClassPickerModal;
