import React, { createContext, useState, useEffect, useRef } from "react";
import { getManifestUrls } from "../utils/destiny2";
import axios from "axios";

const DestinyContext = createContext();

function DestinyContextProvider({ children }) {
  const cache = useRef({});
  const [manifest, setManifest] = useState({});

  useEffect(() => {
    async function getManifest() {
      try {
        let TIME_START = performance.now();
        let TIME_END = 0;
        // Fetch manifest URLs
        console.log("Fetching manifest URL...");
        const data = await getManifestUrls();
        const manifestUrl = `https://www.bungie.net${data.Response.jsonWorldContentPaths.en}`;
        // Fetch the manifest and set data in state
        if (cache.current[manifestUrl]) {
          const data = cache.current[manifestUrl];
          setManifest(data);
        } else {
          const res = await axios.get(manifestUrl);
          const json = res.data;
          setManifest(json);
        }
        // Log performance
        TIME_END = performance.now();
        console.log(
          `Finished loading Destiny 2 manifest - ${TIME_END - TIME_START} ms`
        );
      } catch (e) {
        console.log("Could not load Destiny 2 manifest...");
        console.error(e.response.status);
      }
    }
    getManifest();
  }, []);

  return (
    <DestinyContext.Provider value={{ manifest }}>
      {children}
    </DestinyContext.Provider>
  );
}

export { DestinyContextProvider, DestinyContext };
