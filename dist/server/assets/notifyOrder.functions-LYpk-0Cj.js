import { i as createServerFn } from "./server-DOeVVFqk.js";
import { t as createSsrRpc } from "./createSsrRpc-CyeIrpA-.js";
//#region src/serverFns/notifyOrder.functions.ts
var notifyOrder = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("eb13faa37431209b1eff913458093db5164eccfbabc251d3b28af01fded04681"));
//#endregion
export { notifyOrder };
