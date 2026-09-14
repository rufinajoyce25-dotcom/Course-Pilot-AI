import { UniversityDataProviderSuite } from "./types";
import { createDevelopmentProviderSuite, globalStore } from "./developmentProvider";
import { RealUniversityDataProviderSuite } from "./realUniversityProvider";

let activeSuite: UniversityDataProviderSuite | null = null;
let forceLiveMode = true; // LIVE REAL DATA MODE IS DEFAULT

export function getDataProvider(): UniversityDataProviderSuite {
  if (forceLiveMode) {
    if (!activeSuite || activeSuite.isDemoMode()) {
      activeSuite = new RealUniversityDataProviderSuite();
    }
  } else {
    if (!activeSuite || !activeSuite.isDemoMode()) {
      activeSuite = createDevelopmentProviderSuite();
    }
  }

  return activeSuite;
}

export function setRuntimeProviderMode(useReal: boolean) {
  forceLiveMode = useReal;
  activeSuite = useReal ? new RealUniversityDataProviderSuite() : createDevelopmentProviderSuite();
}

export { globalStore };
