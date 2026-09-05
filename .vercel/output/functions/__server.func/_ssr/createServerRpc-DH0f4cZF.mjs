import { a as TSS_SERVER_FUNCTION } from "./server-Dc8Yo-fM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createServerRpc-DH0f4cZF.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
export { createServerRpc as t };
