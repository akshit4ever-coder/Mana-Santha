globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/Header-DJEoHsaB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"89da-vubvZ6mk0ll3IhvF7CfgoG0dMK8\"",
		"mtime": "2026-07-28T15:44:16.339Z",
		"size": 35290,
		"path": "../public/assets/Header-DJEoHsaB.js"
	},
	"/assets/ProductCard-BKZTzIEX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f88-Co9Jc2VCY+7d1JaVDqRuEDzgly4\"",
		"mtime": "2026-07-28T15:44:16.339Z",
		"size": 3976,
		"path": "../public/assets/ProductCard-BKZTzIEX.js"
	},
	"/assets/Footer-CBO1zZ8O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a5-6V7IvCQ4oQFv7br2+2omWmad/3Y\"",
		"mtime": "2026-07-28T15:44:16.338Z",
		"size": 2213,
		"path": "../public/assets/Footer-CBO1zZ8O.js"
	},
	"/assets/Match-CyHcSa8C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be04-pGl1woWZr6VB/Q0+HPDqrp31OFI\"",
		"mtime": "2026-07-28T15:44:16.339Z",
		"size": 48644,
		"path": "../public/assets/Match-CyHcSa8C.js"
	},
	"/assets/admin-GoAmvxdF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25ff-UexFFyd5TLHmPsRrjClH6gPnkPg\"",
		"mtime": "2026-07-28T15:44:16.339Z",
		"size": 9727,
		"path": "../public/assets/admin-GoAmvxdF.js"
	},
	"/assets/admin.customers-rQ5EYqmA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fcf-f1bGodJGkyABl5P2xFstpIiu9JY\"",
		"mtime": "2026-07-28T15:44:16.340Z",
		"size": 4047,
		"path": "../public/assets/admin.customers-rQ5EYqmA.js"
	},
	"/assets/admin.banners-BJ9xQh1z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1af4-QJc2JUOpZTJ38GXHMShW7I6rnOc\"",
		"mtime": "2026-07-28T15:44:16.339Z",
		"size": 6900,
		"path": "../public/assets/admin.banners-BJ9xQh1z.js"
	},
	"/assets/admin.coupons-oaSd-zwT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"208e-JFObUQgp/fK2tHlbdZnFaMAALzc\"",
		"mtime": "2026-07-28T15:44:16.340Z",
		"size": 8334,
		"path": "../public/assets/admin.coupons-oaSd-zwT.js"
	},
	"/assets/admin.delivery-C_yZquh6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d51-ux1ZOwvA0TNKkzUqY/XWMhn2Rqg\"",
		"mtime": "2026-07-28T15:44:16.340Z",
		"size": 7505,
		"path": "../public/assets/admin.delivery-C_yZquh6.js"
	},
	"/assets/admin.index-BIfQabzx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"828-4nMQx1R/SqY0GU4ESYrBro4hPA4\"",
		"mtime": "2026-07-28T15:44:16.340Z",
		"size": 2088,
		"path": "../public/assets/admin.index-BIfQabzx.js"
	},
	"/assets/admin.products-D9UFSDv2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"52f5-7Wcg088gn5R9/D5mpcl/X19J73g\"",
		"mtime": "2026-07-28T15:44:16.340Z",
		"size": 21237,
		"path": "../public/assets/admin.products-D9UFSDv2.js"
	},
	"/assets/admin.settings-DWOHi7ou.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f11-z756seINdlMFv14yTxyTzpIQcyI\"",
		"mtime": "2026-07-28T15:44:16.340Z",
		"size": 7953,
		"path": "../public/assets/admin.settings-DWOHi7ou.js"
	},
	"/assets/admin.subcategories-BJxDwdwS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22f6-eMvUBoz3d9m8v6Z6kLytgj6jrXE\"",
		"mtime": "2026-07-28T15:44:16.341Z",
		"size": 8950,
		"path": "../public/assets/admin.subcategories-BJxDwdwS.js"
	},
	"/assets/admin.orders-BXLhe0FO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"903-qgi14asSnVra4lLwnW0ezq7/zXI\"",
		"mtime": "2026-07-28T15:44:16.340Z",
		"size": 2307,
		"path": "../public/assets/admin.orders-BXLhe0FO.js"
	},
	"/assets/auth-e2_ap1Dh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f6a-0wifS4uhJsqI5zVE5K9zB5dM04E\"",
		"mtime": "2026-07-28T15:44:16.341Z",
		"size": 16234,
		"path": "../public/assets/auth-e2_ap1Dh.js"
	},
	"/assets/badge-CQ8gAc_O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30e-8gu4VE+0G4K4vBI7NqERnBlNMbo\"",
		"mtime": "2026-07-28T15:44:16.341Z",
		"size": 782,
		"path": "../public/assets/badge-CQ8gAc_O.js"
	},
	"/assets/bike-BT9EVJjL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"120-b2J+MLxiU8lWLWS2IOHWrWO/waI\"",
		"mtime": "2026-07-28T15:44:16.341Z",
		"size": 288,
		"path": "../public/assets/bike-BT9EVJjL.js"
	},
	"/assets/admin.inventory-BPOcmfFC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1821-HWnBggnGE0Yl+hCaBqJakmDIsOk\"",
		"mtime": "2026-07-28T15:44:16.340Z",
		"size": 6177,
		"path": "../public/assets/admin.inventory-BPOcmfFC.js"
	},
	"/assets/category._slug-9PSP0ulN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fdc-2snhuhijTifzkYCPNQup7FG1nGA\"",
		"mtime": "2026-07-28T15:44:16.341Z",
		"size": 4060,
		"path": "../public/assets/category._slug-9PSP0ulN.js"
	},
	"/assets/checkout-CuNra2Fc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3821-d3e0fkKHiYYMfe2+JLioYP7HRR8\"",
		"mtime": "2026-07-28T15:44:16.342Z",
		"size": 14369,
		"path": "../public/assets/checkout-CuNra2Fc.js"
	},
	"/assets/cart-D8e2sIt0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1501-qHuGmmQzc9Z8L/9riJQNF0nyfoI\"",
		"mtime": "2026-07-28T15:44:16.341Z",
		"size": 5377,
		"path": "../public/assets/cart-D8e2sIt0.js"
	},
	"/assets/clsx-CjueKrWZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"170-hIN6XMVOMUzluNGmYPaM/SbauwQ\"",
		"mtime": "2026-07-28T15:44:16.342Z",
		"size": 368,
		"path": "../public/assets/clsx-CjueKrWZ.js"
	},
	"/assets/admin.reports-XAwWoHXk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5da47-qMkpnDY29ZDtM2je3r+xXzyfHQ8\"",
		"mtime": "2026-07-28T15:44:16.340Z",
		"size": 383559,
		"path": "../public/assets/admin.reports-XAwWoHXk.js"
	},
	"/assets/admin.categories-DMOD6KRI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"210d-5Y7t5uGmApQ2vqR+VXDBzUqtr/8\"",
		"mtime": "2026-07-28T15:44:16.339Z",
		"size": 8461,
		"path": "../public/assets/admin.categories-DMOD6KRI.js"
	},
	"/assets/dialog-DMl14Dc1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b50-OEFtGR385Am8hkx1yfcVlqCegw8\"",
		"mtime": "2026-07-28T15:44:16.342Z",
		"size": 6992,
		"path": "../public/assets/dialog-DMl14Dc1.js"
	},
	"/assets/dist-B50E1yT5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a3-TkBqNqI/qW1fo1cbaVUfBFhL574\"",
		"mtime": "2026-07-28T15:44:16.343Z",
		"size": 675,
		"path": "../public/assets/dist-B50E1yT5.js"
	},
	"/assets/es2015-BQ04atqM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"721b-Q/+nIrw2fBdGhTQ7cc8rgPus5fU\"",
		"mtime": "2026-07-28T15:44:16.345Z",
		"size": 29211,
		"path": "../public/assets/es2015-BQ04atqM.js"
	},
	"/assets/eye-C4JTIp9N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"279-/6u9+hEMLwn9Gw040gtg+r7RMAY\"",
		"mtime": "2026-07-28T15:44:16.345Z",
		"size": 633,
		"path": "../public/assets/eye-C4JTIp9N.js"
	},
	"/assets/format-CA24X11b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-BJVNHHAFrohS89sP8IlCaHomcOE\"",
		"mtime": "2026-07-28T15:44:16.345Z",
		"size": 241,
		"path": "../public/assets/format-CA24X11b.js"
	},
	"/assets/image-D6j4kOBN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10d-htbMuB4tGcZ2Nu+5R+hVlXWmSkc\"",
		"mtime": "2026-07-28T15:44:16.345Z",
		"size": 269,
		"path": "../public/assets/image-D6j4kOBN.js"
	},
	"/assets/createLucideIcon-DwG7oz4p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34e4c-CI0vM1VuawFET/S7jkLdeSUH78I\"",
		"mtime": "2026-07-28T15:44:16.342Z",
		"size": 216652,
		"path": "../public/assets/createLucideIcon-DwG7oz4p.js"
	},
	"/assets/input-DB1Waq6q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"272-/CNCB464ZLWb9KqYHb7N8QinCdo\"",
		"mtime": "2026-07-28T15:44:16.345Z",
		"size": 626,
		"path": "../public/assets/input-DB1Waq6q.js"
	},
	"/assets/link-CJwB7acX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5bbb-rS3OMbMB3SPQxv8t4ztZg8B0330\"",
		"mtime": "2026-07-28T15:44:16.346Z",
		"size": 23483,
		"path": "../public/assets/link-CJwB7acX.js"
	},
	"/assets/dist-DkxRjgc-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97ba-bNjBOQejWZiZ4y+CTYEke2yNmNo\"",
		"mtime": "2026-07-28T15:44:16.344Z",
		"size": 38842,
		"path": "../public/assets/dist-DkxRjgc-.js"
	},
	"/assets/loader-circle-lqkmcbfA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-ypXEqSNfQihvDJdOM38JwXgmDFQ\"",
		"mtime": "2026-07-28T15:44:16.346Z",
		"size": 144,
		"path": "../public/assets/loader-circle-lqkmcbfA.js"
	},
	"/assets/label-ahjiiwn-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b2-TP1qxfQzcUAA2y9ZIUrwVKcKfMo\"",
		"mtime": "2026-07-28T15:44:16.345Z",
		"size": 690,
		"path": "../public/assets/label-ahjiiwn-.js"
	},
	"/assets/minus-Ppx_kQJx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75-1902sBJBxLr25rZJmT+PHgSp48g\"",
		"mtime": "2026-07-28T15:44:16.346Z",
		"size": 117,
		"path": "../public/assets/minus-Ppx_kQJx.js"
	},
	"/assets/orders-BN6FPkCq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d41-FC/20BrUM8jFVBV2HawbYJb29Hc\"",
		"mtime": "2026-07-28T15:44:16.346Z",
		"size": 3393,
		"path": "../public/assets/orders-BN6FPkCq.js"
	},
	"/assets/package-BQcU_4PE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"174-TOPFgDAco14JrDlnVviyxTypO1Q\"",
		"mtime": "2026-07-28T15:44:16.346Z",
		"size": 372,
		"path": "../public/assets/package-BQcU_4PE.js"
	},
	"/assets/plus-J-9_No2G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-XCyoYVCCLngzYgSkPjBhIDx7oco\"",
		"mtime": "2026-07-28T15:44:16.346Z",
		"size": 153,
		"path": "../public/assets/plus-J-9_No2G.js"
	},
	"/assets/product-storage-BnDk_Zw7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f3-vXFEA3szKCkHxxz44oatx+6cJvk\"",
		"mtime": "2026-07-28T15:44:16.346Z",
		"size": 2035,
		"path": "../public/assets/product-storage-BnDk_Zw7.js"
	},
	"/assets/product._slug-DhuHZqSm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c00-kHXvVu0rvZDw8DvVj0Qc3LWA6FA\"",
		"mtime": "2026-07-28T15:44:16.346Z",
		"size": 7168,
		"path": "../public/assets/product._slug-DhuHZqSm.js"
	},
	"/assets/routes-D-OK8-Av.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1317-bZ0S9khP/BVghTgUfJpgHqH3aOA\"",
		"mtime": "2026-07-28T15:44:16.347Z",
		"size": 4887,
		"path": "../public/assets/routes-D-OK8-Av.js"
	},
	"/assets/search-DeH2aE2O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-WxSwWAfUa313m6FnMNOc2JtDWBg\"",
		"mtime": "2026-07-28T15:44:16.347Z",
		"size": 174,
		"path": "../public/assets/search-DeH2aE2O.js"
	},
	"/assets/search-dVAZQbrm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f6-gUJovZ251GEhZW3Vj32Mg+Blz5A\"",
		"mtime": "2026-07-28T15:44:16.347Z",
		"size": 1014,
		"path": "../public/assets/search-dVAZQbrm.js"
	},
	"/assets/index-CAcvdisk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5752f-0Jqi1FVPsofWMVfvibX9o4Kuro4\"",
		"mtime": "2026-07-28T15:44:16.337Z",
		"size": 357679,
		"path": "../public/assets/index-CAcvdisk.js"
	},
	"/assets/hero-groceries-m_gCqZg2.jpg": {
		"type": "image/jpeg",
		"etag": "\"38781-XhadbGl+pKuN8CExMFKfV5lJY/g\"",
		"mtime": "2026-07-28T15:44:16.352Z",
		"size": 231297,
		"path": "../public/assets/hero-groceries-m_gCqZg2.jpg"
	},
	"/assets/dist-B-NZccuX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8267-fmqT24fsjbweCw2lYhg/yuUedNs\"",
		"mtime": "2026-07-28T15:44:16.342Z",
		"size": 33383,
		"path": "../public/assets/dist-B-NZccuX.js"
	},
	"/assets/table-Bf8X6pNK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"671-7NydENd/CH36k2l1KiF+JVOtsOU\"",
		"mtime": "2026-07-28T15:44:16.347Z",
		"size": 1649,
		"path": "../public/assets/table-Bf8X6pNK.js"
	},
	"/assets/tag-YLn7KVfx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"146-PDsu1VQ6ilwddi0sOFqgCeKQY/E\"",
		"mtime": "2026-07-28T15:44:16.347Z",
		"size": 326,
		"path": "../public/assets/tag-YLn7KVfx.js"
	},
	"/assets/trash-2-B1JCe1BA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-Z9HVI+gulpjUjMkf0ikjC/T+wX8\"",
		"mtime": "2026-07-28T15:44:16.348Z",
		"size": 328,
		"path": "../public/assets/trash-2-B1JCe1BA.js"
	},
	"/assets/trending-up-BqYQZ1WO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"af-DHcU+AN8t6HY7Gc+cgefPgbEI60\"",
		"mtime": "2026-07-28T15:44:16.348Z",
		"size": 175,
		"path": "../public/assets/trending-up-BqYQZ1WO.js"
	},
	"/assets/triangle-alert-CZo2RpdG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-/YGFdCdQJgPHxQp179Yp7QXZO8E\"",
		"mtime": "2026-07-28T15:44:16.348Z",
		"size": 265,
		"path": "../public/assets/triangle-alert-CZo2RpdG.js"
	},
	"/assets/truck-Djx2FYo6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"196-q57bcg+stfOVxKZTKuVEubkUMKg\"",
		"mtime": "2026-07-28T15:44:16.348Z",
		"size": 406,
		"path": "../public/assets/truck-Djx2FYo6.js"
	},
	"/assets/shield-check-yBpckx1h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-rI9ftKE3Klfovs0fx1/1K0nTLn8\"",
		"mtime": "2026-07-28T15:44:16.347Z",
		"size": 320,
		"path": "../public/assets/shield-check-yBpckx1h.js"
	},
	"/assets/useMatch-Dc31dhfB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"47c-ivGvzyYTp1DAw0b2NpMElbfLJPk\"",
		"mtime": "2026-07-28T15:44:16.348Z",
		"size": 1148,
		"path": "../public/assets/useMatch-Dc31dhfB.js"
	},
	"/assets/useMutation-UV4nRYkx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8cf-2d1Cd8Z+TIFNBClucA1XPfyYFWQ\"",
		"mtime": "2026-07-28T15:44:16.348Z",
		"size": 2255,
		"path": "../public/assets/useMutation-UV4nRYkx.js"
	},
	"/assets/useQuery-BpUMj7TE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2256-pIkE+8zAoJ+OH6nZAnaTjsBuvCM\"",
		"mtime": "2026-07-28T15:44:16.348Z",
		"size": 8790,
		"path": "../public/assets/useQuery-BpUMj7TE.js"
	},
	"/assets/users-C-Cuslwl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-7kxmIlsrh5YDYwsDpO1clz3/OBM\"",
		"mtime": "2026-07-28T15:44:16.349Z",
		"size": 306,
		"path": "../public/assets/users-C-Cuslwl.js"
	},
	"/assets/variant-utils-DlKBmrYd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ad-3YtgXHSNqY8tTMxExL1tChxBgXI\"",
		"mtime": "2026-07-28T15:44:16.349Z",
		"size": 429,
		"path": "../public/assets/variant-utils-DlKBmrYd.js"
	},
	"/assets/wishlist-CchbosW3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"567-GqWNR5eZVRZGaUDHsuLA4ldEM4I\"",
		"mtime": "2026-07-28T15:44:16.349Z",
		"size": 1383,
		"path": "../public/assets/wishlist-CchbosW3.js"
	},
	"/assets/images/product-placeholder.png": {
		"type": "image/png",
		"etag": "\"38781-XhadbGl+pKuN8CExMFKfV5lJY/g\"",
		"mtime": "2026-07-28T15:44:16.972Z",
		"size": 231297,
		"path": "../public/assets/images/product-placeholder.png"
	},
	"/assets/styles-BOvCHLVI.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17562-SoEJR2X37y4ffwkAEmofw1xNFkE\"",
		"mtime": "2026-07-28T15:44:16.353Z",
		"size": 95586,
		"path": "../public/assets/styles-BOvCHLVI.css"
	},
	"/assets/shopping-bag-DTNsku27.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"154-NU9oBzNsfDwvGZUrOYBp5oZ5D6M\"",
		"mtime": "2026-07-28T15:44:16.347Z",
		"size": 340,
		"path": "../public/assets/shopping-bag-DTNsku27.js"
	},
	"/assets/select-B2kTfMje.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"579b-nY8vVdC/vLrlgXxiUyVsmqDJlYM\"",
		"mtime": "2026-07-28T15:44:16.347Z",
		"size": 22427,
		"path": "../public/assets/select-B2kTfMje.js"
	},
	"/assets/ManaSantha_Logo-1NzmFXgc.png": {
		"type": "image/png",
		"etag": "\"8823a1-7SATzr9ADX+kZHujd3LRKNFQvXE\"",
		"mtime": "2026-07-28T15:44:16.351Z",
		"size": 8922017,
		"path": "../public/assets/ManaSantha_Logo-1NzmFXgc.png"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_1ELVq5 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_1ELVq5
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
