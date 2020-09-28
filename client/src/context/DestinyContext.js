import React, { createContext, useState, useEffect } from "react";
import { getManifestUrls } from "../utils/destiny2";

const DestinyContext = createContext();

function DestinyContextProvider({ children }) {
  const [manifest, setManifest] = useState({});

  useEffect(() => {
    getManifest();
  }, []);

  async function getManifest() {
    try {
      let TIME_START = performance.now();
      let manifestUrl = "";
      // Fetch manifest URLs if they aren't already in local storage
      if (!localStorage.getItem("destinyManifestPath")) {
        console.log("Fetching manifest URL...");
        const data = await getManifestUrls();
        manifestUrl = data.Response.jsonWorldContentPaths.en;
        localStorage.setItem("destinyManifestPath", manifestUrl);
      } else {
        manifestUrl = localStorage.getItem("destinyManifestPath");
      }
      // Fetch the manifest
      const res = await fetch(`https://www.bungie.net${manifestUrl}`);
      if (!res.ok) {
        throw new Error(res.status);
      } else {
        const json = await res.json();
        setManifest(json);
      }
      // Log performance
      let TIME_END = performance.now();
      console.log(
        `Finished loading Destiny 2 manifest - ${TIME_END - TIME_START} ms`
      );
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <DestinyContext.Provider value={{ manifest }}>
      {children}
    </DestinyContext.Provider>
  );
}

export { DestinyContextProvider, DestinyContext };
