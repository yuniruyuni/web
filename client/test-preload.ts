// IMPORTANT: GlobalRegistrator.register() must be called BEFORE any module
// that loads @testing-library/dom (e.g. @testing-library/react) is imported.
// @testing-library/dom's screen.js is CJS and reads `typeof document` at
// require time, so it captures the throwing fallback if document is undefined.
// This preload file therefore avoids importing @testing-library/react.
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

import { expect } from "bun:test";
import { disableRealRequests } from "bun-bagel";

const matchers = (await import("@testing-library/jest-dom/matchers")) as Omit<
  typeof import("@testing-library/jest-dom/matchers"),
  "default"
>;

disableRealRequests();
expect.extend(matchers);
