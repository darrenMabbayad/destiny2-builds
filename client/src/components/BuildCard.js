import React from "react";

function BuildCard({ build, editBuild, deleteBuild }) {
  const dateCreated = new Date(build.createdAt).toLocaleDateString();
  const dateModified = new Date(build.updatedAt).toLocaleDateString();

  return (
    <div>
      {build.name && <h2>{build.name}</h2>}
      <h4>{build.selectedClass}</h4>
      <p>{`Created on: ${dateCreated}`}</p>
      <p>{`Modified on: ${dateModified}`}</p>
      {build.description && <p>{build.description}</p>}
      <div>
        <button name="btn-edit-build" onClick={() => editBuild(build)}>
          Edit
        </button>
        <button name="btn-delete-build" onClick={() => deleteBuild(build._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default BuildCard;
