import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import BuildCard from "../components/BuildCard";
import { fetchAllBuilds, deleteBuild } from "../utils/loadout";

function Builds() {
  const [builds, setBuilds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    loadBuilds();
  }, []);

  // Load/update all builds from DB
  async function loadBuilds() {
    const data = await fetchAllBuilds();
    setBuilds(data);
    setIsLoading(false);
  }

  // Delete specific build from list
  function deleteBuildAndUpdateList(id) {
    deleteBuild(id);
    loadBuilds();
  }

  // Go to editor and edit build
  function editBuild(build) {
    history.push(`/editor/${build._id}`, { buildId: build._id });
  }

  /* 
    Render the page 
    Have loading state render first, then render list
    If there are no list items, show New Build button
  */
  function renderPage() {
    if (isLoading) return <p>Loading...</p>;
    else
      return builds.map(build => (
        <BuildCard
          key={build._id}
          build={build}
          deleteBuild={deleteBuildAndUpdateList}
          editBuild={editBuild}
        />
      ));
  }

  return (
    <div>
      {renderPage()}
      <Link to="/editor">New Build</Link>
    </div>
  );
}

export default Builds;
