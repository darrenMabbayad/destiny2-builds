import React, { useContext, useState } from "react";
import { DestinyContext } from "../../../context/DestinyContext";

function ClassPickerModal({
  currentClass,
  currentSubClass,
  selectClass,
  changeClassAbility,
  changeJump,
  changeGrenade,
  changeTree,
  selectClassElement,
  toggleClassPicker,
}) {
  const { getSubClass } = useContext(DestinyContext);
  const [subClassList, setSubClassList] = useState(
    currentClass ? getSubClass(currentClass) : []
  );
  const currentElement = currentSubClass.element;
  const [subClassByElement, setSubClassByElement] = useState(
    currentElement ? filterSubClasses(currentElement) : {}
  );
  const equippedAbility = currentSubClass.classSpecialty;
  const equippedJump = currentSubClass.movementMode;
  const equippedGrenade = currentSubClass.grenade;
  const equippedTree = currentSubClass.path;

  function filterSubClasses(element) {
    const list = getSubClass(currentClass);
    for (const item of list) {
      const subClass = item;
      if (subClass.element === element) {
        return subClass;
      }
    }
  }

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

  function getAbilityClassName(ability) {
    if (equippedAbility === ability) {
      return `class-picker-talent-grid-class-specialty-skill ability-equipped`;
    } else return "class-picker-talent-grid-class-specialty-skill";
  }

  function getGrenadeClassName(grenade) {
    if (equippedGrenade === grenade) {
      return `class-picker-talent-grid-grenades-icon grenade-equipped`;
    } else return "class-picker-talent-grid-grenades-icon";
  }

  function getJumpClassName(jump) {
    if (equippedJump === jump) {
      return `class-picker-talent-grid-jumps-icon jump-equipped`;
    } else return "class-picker-talent-grid-jumps-icon";
  }

  function getTreeClassName(tree) {
    if (equippedTree === tree) {
      return `class-picker-talent-grid-trees-icon tree-equipped`;
    } else return "class-picker-talent-grid-trees-icon";
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
                <div key={index} className={getAbilityClassName(ability.name)}>
                  <img
                    src={`http://www.bungie.net${ability.icon}`}
                    alt=""
                    onClick={() => changeClassAbility(ability.name)}
                  />
                </div>
              ))}
            </div>
            <div className="class-picker-talent-grid-abilities">
              <div className="class-picker-talent-grid-grenades">
                {subClassByElement.grenades.map((grenade, index) => (
                  <div
                    key={index}
                    className={getGrenadeClassName(grenade.name)}
                  >
                    <img
                      src={`http://www.bungie.net${grenade.icon}`}
                      alt=""
                      onClick={() => changeGrenade(grenade.name)}
                    />
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
                  <div key={index} className={getJumpClassName(jump.name)}>
                    <img
                      src={`http://www.bungie.net${jump.icon}`}
                      alt=""
                      onClick={() => changeJump(jump.name)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="class-picker-talent-grid-trees">
            <div className="class-picker-talent-grid-trees-icons-container">
              {subClassByElement.firstPath.talents.map((path, index) => (
                <div key={index} className={getTreeClassName("top")}>
                  <img
                    src={`http://www.bungie.net${path.icon}`}
                    alt=""
                    onClick={() => changeTree("top")}
                  />
                </div>
              ))}
            </div>
            <div className="class-picker-talent-grid-trees-icons-container">
              {subClassByElement.thirdPath.talents.map((path, index) => (
                <div key={index} className={getTreeClassName("middle")}>
                  <img
                    src={`http://www.bungie.net${path.icon}`}
                    alt=""
                    onClick={() => changeTree("middle")}
                  />
                </div>
              ))}
            </div>
            <div className="class-picker-talent-grid-trees-icons-container">
              {subClassByElement.secondPath.talents.map((path, index) => (
                <div key={index} className={getTreeClassName("bottom")}>
                  <img
                    src={`http://www.bungie.net${path.icon}`}
                    alt=""
                    onClick={() => changeTree("bottom")}
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
