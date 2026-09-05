import { i as createServerFn } from "./server-DOeVVFqk.js";
import { t as createSsrRpc } from "./createSsrRpc-CyeIrpA-.js";
import { z } from "zod";
//#region src/serverFns/resetPasswordByPhone.functions.ts
var resetPasswordByPhone = createServerFn({ method: "POST" }).validator(z.object({
	phone: z.string().min(6),
	fullName: z.string().min(1),
	newPassword: z.string().min(6)
})).handler(createSsrRpc("a169b7eef8fa33d86a378da24fae2e11e1e384979a1579b5f9262a790b318192"));
//#endregion
export { resetPasswordByPhone };
