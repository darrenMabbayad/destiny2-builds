import React, { createContext, useState, useEffect } from "react";
import { getManifestUrls } from "../utils/destiny2";
import axios from "axios";

const DestinyContext = createContext();

function DestinyContextProvider({ children }) {
  const [manifest, setManifest] = useState({});

  useEffect(() => {
    getManifest();
  }, []);

  async function getManifest() {
    try {
      let TIME_START = performance.now();
      let TIME_END = 0;
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
      const res = await axios.get(`https://www.bungie.net${manifestUrl}`);
      const json = res.data;
      setManifest(json);
      TIME_END = performance.now();
      console.log(
        `Finished loading Destiny 2 manifest - ${TIME_END - TIME_START} ms`
      );
    } catch (e) {
      console.log("Could not load Destiny 2 manifest...");
      console.error(e.response.status);
    }
  }

  return (
    <DestinyContext.Provider value={{ manifest }}>
      {children}
    </DestinyContext.Provider>
  );
}

export { DestinyContextProvider, DestinyContext };
