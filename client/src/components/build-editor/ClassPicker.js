import React from "react";
import destinyLogo from "../../img/destiny-logo.png";

function ClassPicker({ toggleClassPicker }) {
  return (
    <div className="class-picker">
      <img src={destinyLogo} alt="" onClick={e => toggleClassPicker(e)} />
    </div>
  );
}

export default ClassPicker;
