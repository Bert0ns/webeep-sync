import path from "path"
import i18n from "i18next"

import { __static } from "../util"

declare const __non_webpack_require__: any

let initializing = false
let initialized = false

export function i18nInit(): Promise<void> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (initialized) {
      resolve()
      return
    }
    if (initializing) i18n.on("loaded", () => resolve())
    else {
      initializing = true
      // Bypass webpack completely for this module
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backend = (
        typeof __non_webpack_require__ !== "undefined"
          ? __non_webpack_require__
          : require
      )("i18next-fs-backend")
      await i18n.use(backend).init({
        ns: ["common", "tray", "client", "notifications"],
        defaultNS: "common",
        fallbackLng: "en",
        saveMissing: true,
        backend: {
          loadPath: path.join(__static, "/locales/{{lng}}/{{ns}}.json"),
          addPath: path.join(__static, "/locales/{{lng}}/{{ns}}.missing.json"),
        },
      })
      initialized = true
      resolve()
    }
  })
}

export { i18n }
