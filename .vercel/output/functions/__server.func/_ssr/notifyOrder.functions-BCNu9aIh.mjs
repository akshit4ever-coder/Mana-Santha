import { i as createServerFn } from "./server-Dc8Yo-fM.mjs";
import { t as createServerRpc } from "./createServerRpc-DH0f4cZF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifyOrder.functions-BCNu9aIh.js
var notifyOrder_createServerFn_handler = createServerRpc({
	id: "eb13faa37431209b1eff913458093db5164eccfbabc251d3b28af01fded04681",
	name: "notifyOrder",
	filename: "src/serverFns/notifyOrder.functions.ts"
}, (opts) => notifyOrder.__executeServer(opts));
var notifyOrder = createServerFn({ method: "POST" }).validator((data) => data).handler(notifyOrder_createServerFn_handler, async ({ data }) => {
	console.log("🔔 serverFn notifyOrder called");
	try {
		console.log("📧 importing sendOrderEmail");
		const { sendOrderNotificationEmail } = await import("./sendOrderEmail-C6VscaZT.mjs");
		await sendOrderNotificationEmail(data);
		console.log("✅ email sent");
		return { success: true };
	} catch (error) {
		console.error(error);
		return {
			success: false,
			error: error instanceof Error ? error.message : String(error)
		};
	}
});
//#endregion
export { notifyOrder_createServerFn_handler };
