import { i as createServerFn } from "./server-DOeVVFqk.js";
import { t as createServerRpc } from "./createServerRpc-BCcuCjeM.js";
import { z } from "zod";
//#region src/serverFns/resetPasswordByPhone.functions.ts?tss-serverfn-split
var resetPasswordByPhone_createServerFn_handler = createServerRpc({
	id: "a169b7eef8fa33d86a378da24fae2e11e1e384979a1579b5f9262a790b318192",
	name: "resetPasswordByPhone",
	filename: "src/serverFns/resetPasswordByPhone.functions.ts"
}, (opts) => resetPasswordByPhone.__executeServer(opts));
var resetPasswordByPhone = createServerFn({ method: "POST" }).validator(z.object({
	phone: z.string().min(6),
	fullName: z.string().min(1),
	newPassword: z.string().min(6)
})).handler(resetPasswordByPhone_createServerFn_handler, async ({ data }) => {
	console.log("🔔 serverFn resetPasswordByPhone called");
	try {
		const digits = String(data.phone).replace(/\D/g, "");
		if (digits.length !== 10) return {
			success: false,
			error: "Please provide a valid 10-digit phone number."
		};
		const syntheticEmail = `${digits}@manasantha.local`;
		console.log("📧 importing supabaseAdmin");
		const { supabaseAdmin } = await import("./client.server-CMVldoqb.js");
		const { data: listData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
		if (listErr) {
			console.error(listErr);
			return {
				success: false,
				error: listErr.message || String(listErr)
			};
		}
		const found = (listData?.users || []).find((u) => (u.email || "").toLowerCase() === syntheticEmail.toLowerCase());
		if (!found) return {
			success: false,
			error: "No account found for this phone number."
		};
		if ((found.user_metadata && (found.user_metadata.full_name || found.user_metadata.name) || "").trim().toLowerCase() !== String(data.fullName).trim().toLowerCase()) return {
			success: false,
			error: "Provided name does not match our records."
		};
		console.log("📧 updating password for user id", found.id);
		const { data: updated, error: updErr } = await supabaseAdmin.auth.admin.updateUserById(found.id, { password: data.newPassword });
		if (updErr) {
			console.error(updErr);
			return {
				success: false,
				error: updErr.message || String(updErr)
			};
		}
		console.log("✅ password updated for user", found.id);
		return { success: true };
	} catch (err) {
		console.error(err);
		return {
			success: false,
			error: err?.message ?? String(err)
		};
	}
});
//#endregion
export { resetPasswordByPhone_createServerFn_handler };
