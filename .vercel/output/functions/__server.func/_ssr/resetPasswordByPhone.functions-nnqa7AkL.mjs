import { n as stringType, t as objectType } from "../_libs/zod.mjs";
import { i as createServerFn } from "./server-Dc8Yo-fM.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CipoJ1oW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resetPasswordByPhone.functions-nnqa7AkL.js
var resetPasswordByPhone = createServerFn({ method: "POST" }).validator(objectType({
	phone: stringType().min(6),
	fullName: stringType().min(1),
	newPassword: stringType().min(6)
})).handler(createSsrRpc("a169b7eef8fa33d86a378da24fae2e11e1e384979a1579b5f9262a790b318192"));
//#endregion
export { resetPasswordByPhone };
