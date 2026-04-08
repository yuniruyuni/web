// IMPORTANT: GlobalRegistrator.register() must be called BEFORE any module
// that loads @testing-library/dom (e.g. @testing-library/react) is imported.
// @testing-library/dom's screen.js is CJS and reads `typeof document` at
// require time, so it captures the throwing fallback if document is undefined.
// This preload file therefore avoids importing @testing-library/react.
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

import { expect } from "bun:test";
import * as matchers from "@testing-library/jest-dom/matchers";
import { disableRealRequests } from "bun-bagel";

disableRealRequests();
expect.extend(matchers);
