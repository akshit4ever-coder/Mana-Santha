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
	"/assets/Footer-BYlb3T_Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a5-1PYEo9n44RL5iU4oaikkj+K95IM\"",
		"mtime": "2026-09-03T09:08:15.173Z",
		"size": 2213,
		"path": "../public/assets/Footer-BYlb3T_Z.js"
	},
	"/assets/Header-DebK68Wl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"85e4-xg9cLDinEoy0HYvzgvH2fNB/lBc\"",
		"mtime": "2026-09-03T09:08:15.173Z",
		"size": 34276,
		"path": "../public/assets/Header-DebK68Wl.js"
	},
	"/assets/Match-CiCNJap6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be04-+Leg/4rHJhPirpJr/sOrdVjAc20\"",
		"mtime": "2026-09-03T09:08:15.173Z",
		"size": 48644,
		"path": "../public/assets/Match-CiCNJap6.js"
	},
	"/assets/ProductCard-C-6M_O93.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ffc-XqulMbCYsJQpnQgxnnExmIq5fco\"",
		"mtime": "2026-09-03T09:08:15.173Z",
		"size": 4092,
		"path": "../public/assets/ProductCard-C-6M_O93.js"
	},
	"/assets/admin.banners-h2eBLKGD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1af4-/VWFTGEQR2WxbvYkTQj+pQVX3Jg\"",
		"mtime": "2026-09-03T09:08:15.174Z",
		"size": 6900,
		"path": "../public/assets/admin.banners-h2eBLKGD.js"
	},
	"/assets/admin-D5BuwHjB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3027-usmpWV7eo1MpgyUKUE45xa3T01A\"",
		"mtime": "2026-09-03T09:08:15.174Z",
		"size": 12327,
		"path": "../public/assets/admin-D5BuwHjB.js"
	},
	"/assets/admin.categories-B5ZQX0LZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"210d-tbsNJ2IvT8eTr5A+d8DLZQxrY/Q\"",
		"mtime": "2026-09-03T09:08:15.174Z",
		"size": 8461,
		"path": "../public/assets/admin.categories-B5ZQX0LZ.js"
	},
	"/assets/admin.customers-B8Hc1wCY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fcf-GKK4lPUA420QqWWyWpMvDax7N2A\"",
		"mtime": "2026-09-03T09:08:15.174Z",
		"size": 4047,
		"path": "../public/assets/admin.customers-B8Hc1wCY.js"
	},
	"/assets/admin.delivery-DmxC_B5X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d51-1NHy7j2rrqZDoD45Q+zPh1Z1ers\"",
		"mtime": "2026-09-03T09:08:15.174Z",
		"size": 7505,
		"path": "../public/assets/admin.delivery-DmxC_B5X.js"
	},
	"/assets/admin.coupons-Ym2u1C3R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"208e-AOJcgUpnJAMgBQra01rH3iYVZsY\"",
		"mtime": "2026-09-03T09:08:15.174Z",
		"size": 8334,
		"path": "../public/assets/admin.coupons-Ym2u1C3R.js"
	},
	"/assets/admin.index-CGBg2DFr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"828-2BK2BnJl5DJZ0SOpopZfl0yvy5Y\"",
		"mtime": "2026-09-03T09:08:15.174Z",
		"size": 2088,
		"path": "../public/assets/admin.index-CGBg2DFr.js"
	},
	"/assets/admin.products-Dj5yioob.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"61c8-xhgP7Cnp7D9tUZlUgE5XLzBaC/k\"",
		"mtime": "2026-09-03T09:08:15.175Z",
		"size": 25032,
		"path": "../public/assets/admin.products-Dj5yioob.js"
	},
	"/assets/admin.reports-B6xrDSck.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5da47-hXqgx/EViVUL/nn/5pAtvKDt/yg\"",
		"mtime": "2026-09-03T09:08:15.175Z",
		"size": 383559,
		"path": "../public/assets/admin.reports-B6xrDSck.js"
	},
	"/assets/admin.settings-Bu_b11rJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f11-TobohY+ag+4QocKUrVKixQupGQE\"",
		"mtime": "2026-09-03T09:08:15.176Z",
		"size": 7953,
		"path": "../public/assets/admin.settings-Bu_b11rJ.js"
	},
	"/assets/admin.subcategories-DAiWbc8Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22f6-PpTfWbioYVLDSDqASk/ZpkRVv3k\"",
		"mtime": "2026-09-03T09:08:15.176Z",
		"size": 8950,
		"path": "../public/assets/admin.subcategories-DAiWbc8Y.js"
	},
	"/assets/admin.orders-CC-fCwiE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b76-QiHxTpeQMbXMBP7rzyDcfp8gDoE\"",
		"mtime": "2026-09-03T09:08:15.175Z",
		"size": 2934,
		"path": "../public/assets/admin.orders-CC-fCwiE.js"
	},
	"/assets/auth-DjTy32U8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2bdf-kI2z9gMzNVHqRjkDIs3FPZcUgzg\"",
		"mtime": "2026-09-03T09:08:15.176Z",
		"size": 11231,
		"path": "../public/assets/auth-DjTy32U8.js"
	},
	"/assets/badge-AibOcyF4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30e-nR51GqYfcZH3KkLf9xdDwfLamns\"",
		"mtime": "2026-09-03T09:08:15.176Z",
		"size": 782,
		"path": "../public/assets/badge-AibOcyF4.js"
	},
	"/assets/category._slug-C5TpYqSa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"166d-fceQArNWqfpB5xfwdDxzfA0nIKY\"",
		"mtime": "2026-09-03T09:08:15.177Z",
		"size": 5741,
		"path": "../public/assets/category._slug-C5TpYqSa.js"
	},
	"/assets/admin.inventory-CYLl_JnA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b81-mgpaLZ9vnPR66NcdaG2vy0aR1lY\"",
		"mtime": "2026-09-03T09:08:15.175Z",
		"size": 7041,
		"path": "../public/assets/admin.inventory-CYLl_JnA.js"
	},
	"/assets/checkout-a96XTIgI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e6b-mPY5Spym7rjlhJ4MhgJatN+mILQ\"",
		"mtime": "2026-09-03T09:08:15.177Z",
		"size": 24171,
		"path": "../public/assets/checkout-a96XTIgI.js"
	},
	"/assets/bike-i2rEQ-Wj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"120-gmHr/TtZFLHkWjM0Uqp9lHkCGxE\"",
		"mtime": "2026-09-03T09:08:15.176Z",
		"size": 288,
		"path": "../public/assets/bike-i2rEQ-Wj.js"
	},
	"/assets/Mana Santa Title-DqZPVoko.jpg": {
		"type": "image/jpeg",
		"etag": "\"842f7-kT9jfyPPFySzN6EU45BADolftAI\"",
		"mtime": "2026-09-03T09:08:15.182Z",
		"size": 541431,
		"path": "../public/assets/Mana Santa Title-DqZPVoko.jpg"
	},
	"/assets/cart-CpJRPhkv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"145d-bB1adO3sWQXho5Shaw+oecFpuM0\"",
		"mtime": "2026-09-03T09:08:15.177Z",
		"size": 5213,
		"path": "../public/assets/cart-CpJRPhkv.js"
	},
	"/assets/clsx-CjueKrWZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"170-hIN6XMVOMUzluNGmYPaM/SbauwQ\"",
		"mtime": "2026-09-03T09:08:15.177Z",
		"size": 368,
		"path": "../public/assets/clsx-CjueKrWZ.js"
	},
	"/assets/createLucideIcon-BIEfAyGf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35a47-sBPbzNgRGO2XXEmXsi6AFHac4uw\"",
		"mtime": "2026-09-03T09:08:15.177Z",
		"size": 219719,
		"path": "../public/assets/createLucideIcon-BIEfAyGf.js"
	},
	"/assets/dialog-D-BJrMkH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b50-sQ1EVFiMwYylrmFWOnU9EgIzl9I\"",
		"mtime": "2026-09-03T09:08:15.178Z",
		"size": 6992,
		"path": "../public/assets/dialog-D-BJrMkH.js"
	},
	"/assets/dist-1JR_SzMx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a3-AFsplbMlYVUE2UhZL00Ti9hicUs\"",
		"mtime": "2026-09-03T09:08:15.178Z",
		"size": 675,
		"path": "../public/assets/dist-1JR_SzMx.js"
	},
	"/assets/dist-CuAt3GHu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8267-71hn96QK1yrpzJjafD8JfhKNnow\"",
		"mtime": "2026-09-03T09:08:15.178Z",
		"size": 33383,
		"path": "../public/assets/dist-CuAt3GHu.js"
	},
	"/assets/dist-CvmPBrts.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97ba-2E+sKtVIJgyTr2m1vdz8P/VUHkg\"",
		"mtime": "2026-09-03T09:08:15.178Z",
		"size": 38842,
		"path": "../public/assets/dist-CvmPBrts.js"
	},
	"/assets/es2015-D0ZFl_sN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"721b-BpLrG0qRkK5Y+Zy+UWL95+X/k4g\"",
		"mtime": "2026-09-03T09:08:15.179Z",
		"size": 29211,
		"path": "../public/assets/es2015-D0ZFl_sN.js"
	},
	"/assets/eye-D4630qzC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"279-8RvYyVQAX5/5+9+M+Ippg9oxxq0\"",
		"mtime": "2026-09-03T09:08:15.179Z",
		"size": 633,
		"path": "../public/assets/eye-D4630qzC.js"
	},
	"/assets/format-CA24X11b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-BJVNHHAFrohS89sP8IlCaHomcOE\"",
		"mtime": "2026-09-03T09:08:15.179Z",
		"size": 241,
		"path": "../public/assets/format-CA24X11b.js"
	},
	"/assets/image-DClF1px-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10d-7b2Ss3rNAtYYTpHpLd7RlcnLpSA\"",
		"mtime": "2026-09-03T09:08:15.179Z",
		"size": 269,
		"path": "../public/assets/image-DClF1px-.js"
	},
	"/assets/input-DbGi2YHw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"272-qpAKcmSEFiiCBLabHBHXClO5zo0\"",
		"mtime": "2026-09-03T09:08:15.179Z",
		"size": 626,
		"path": "../public/assets/input-DbGi2YHw.js"
	},
	"/assets/kirana-essentials-C4_Adoxh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"619-qBwkuH8Wf2LJWQ39MjsxP0/iE54\"",
		"mtime": "2026-09-03T09:08:15.179Z",
		"size": 1561,
		"path": "../public/assets/kirana-essentials-C4_Adoxh.js"
	},
	"/assets/label-DYZCxf6b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b2-cM9z0C28mb36o74R2M7+tod5C0c\"",
		"mtime": "2026-09-03T09:08:15.179Z",
		"size": 690,
		"path": "../public/assets/label-DYZCxf6b.js"
	},
	"/assets/link-DJgNKeec.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5bbb-x+mGbpGWpWVnFgRhB37JrXoilkg\"",
		"mtime": "2026-09-03T09:08:15.179Z",
		"size": 23483,
		"path": "../public/assets/link-DJgNKeec.js"
	},
	"/assets/index-DeSYMWtZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"57d8b-jnNcEBdPWBhE0WueIU7M6RWQklw\"",
		"mtime": "2026-09-03T09:08:15.173Z",
		"size": 359819,
		"path": "../public/assets/index-DeSYMWtZ.js"
	},
	"/assets/hero-groceries-m_gCqZg2.jpg": {
		"type": "image/jpeg",
		"etag": "\"38781-XhadbGl+pKuN8CExMFKfV5lJY/g\"",
		"mtime": "2026-09-03T09:08:15.184Z",
		"size": 231297,
		"path": "../public/assets/hero-groceries-m_gCqZg2.jpg"
	},
	"/assets/loader-circle-Bg-v6hxz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-8YKHX91z8DM7jXhRKlrT3uxTLo8\"",
		"mtime": "2026-09-03T09:08:15.179Z",
		"size": 144,
		"path": "../public/assets/loader-circle-Bg-v6hxz.js"
	},
	"/assets/minus-CyqkW7Hj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75-0AgONi/nhJAojWE9MrBsS2X/r0g\"",
		"mtime": "2026-09-03T09:08:15.179Z",
		"size": 117,
		"path": "../public/assets/minus-CyqkW7Hj.js"
	},
	"/assets/package-Bl87pZO7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"174-pmBkkn8pAbkDprh69CxZPxRL5P0\"",
		"mtime": "2026-09-03T09:08:15.179Z",
		"size": 372,
		"path": "../public/assets/package-Bl87pZO7.js"
	},
	"/assets/orders-CajDW0mf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f3b-00s8+WuSrkd5W0hZ7Fy18GSXJxw\"",
		"mtime": "2026-09-03T09:08:15.179Z",
		"size": 3899,
		"path": "../public/assets/orders-CajDW0mf.js"
	},
	"/assets/plus-wYUeCRGx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-nHKddf7ZTmBRY+lFrCbOdEeHTAY\"",
		"mtime": "2026-09-03T09:08:15.180Z",
		"size": 153,
		"path": "../public/assets/plus-wYUeCRGx.js"
	},
	"/assets/product-storage-c6Nr09QO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f3-8CtF+2cVLpxSo1PafO45xcULgig\"",
		"mtime": "2026-09-03T09:08:15.180Z",
		"size": 2035,
		"path": "../public/assets/product-storage-c6Nr09QO.js"
	},
	"/assets/product._slug-D-013x6c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e6e-0V5MRBqoGGrIV0plfjLNjOwU0Cs\"",
		"mtime": "2026-09-03T09:08:15.180Z",
		"size": 7790,
		"path": "../public/assets/product._slug-D-013x6c.js"
	},
	"/assets/routes-CIAYpLll.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1388-bDys9vqhO8m1ICzk9/JEKQWry1k\"",
		"mtime": "2026-09-03T09:08:15.180Z",
		"size": 5e3,
		"path": "../public/assets/routes-CIAYpLll.js"
	},
	"/assets/search-DkcxcAwP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f6-Yw0yFumYaf2i1NrcZ6vKxV0iHEw\"",
		"mtime": "2026-09-03T09:08:15.180Z",
		"size": 1014,
		"path": "../public/assets/search-DkcxcAwP.js"
	},
	"/assets/search-ZmSuaSrj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-ZLh3BaGUt7pAkjbpUshFqRe4Kq4\"",
		"mtime": "2026-09-03T09:08:15.180Z",
		"size": 174,
		"path": "../public/assets/search-ZmSuaSrj.js"
	},
	"/assets/select-CpaNgdvE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"579b-7UnGLXgOjINxslYvhc7zqkq+Zwg\"",
		"mtime": "2026-09-03T09:08:15.181Z",
		"size": 22427,
		"path": "../public/assets/select-CpaNgdvE.js"
	},
	"/assets/shield-check-B7PcbRs4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-lp3u6MbiOD6lksGiN4/Rocfy5PY\"",
		"mtime": "2026-09-03T09:08:15.181Z",
		"size": 320,
		"path": "../public/assets/shield-check-B7PcbRs4.js"
	},
	"/assets/shop-fresh-CfaO8Ozh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"616-9yeUbgCiRmw35rtqOelWJQXT/XA\"",
		"mtime": "2026-09-03T09:08:15.181Z",
		"size": 1558,
		"path": "../public/assets/shop-fresh-CfaO8Ozh.js"
	},
	"/assets/shopping-bag-BhL-BbKg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"154-BrrLQwPsyn69Dxlmcojx/Pw5rE4\"",
		"mtime": "2026-09-03T09:08:15.181Z",
		"size": 340,
		"path": "../public/assets/shopping-bag-BhL-BbKg.js"
	},
	"/assets/table-Bz-sA7QW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"671-OAAZmDsPr+VY3gyxffP4WRfKSWs\"",
		"mtime": "2026-09-03T09:08:15.181Z",
		"size": 1649,
		"path": "../public/assets/table-Bz-sA7QW.js"
	},
	"/assets/tag-BuuQq08u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"146-BajIPSe5YmDB6tcYTJcCI2txyFw\"",
		"mtime": "2026-09-03T09:08:15.181Z",
		"size": 326,
		"path": "../public/assets/tag-BuuQq08u.js"
	},
	"/assets/trash-2-u3or30r5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-JKMksInVEWaLMr5iVIKQteJxaC8\"",
		"mtime": "2026-09-03T09:08:15.181Z",
		"size": 328,
		"path": "../public/assets/trash-2-u3or30r5.js"
	},
	"/assets/trending-up-C7zLdsut.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"af-VN5Zk/NUZNG4eVJk3x0qeJjCitM\"",
		"mtime": "2026-09-03T09:08:15.181Z",
		"size": 175,
		"path": "../public/assets/trending-up-C7zLdsut.js"
	},
	"/assets/truck-Baph5B6W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"196-GV91Y42u7PyPA2iqbCNyf6l5gRg\"",
		"mtime": "2026-09-03T09:08:15.181Z",
		"size": 406,
		"path": "../public/assets/truck-Baph5B6W.js"
	},
	"/assets/useMatch-TbLp_VuJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"47c-wNBCsiLVfMdnSO+npMQ7P3v+W4w\"",
		"mtime": "2026-09-03T09:08:15.181Z",
		"size": 1148,
		"path": "../public/assets/useMatch-TbLp_VuJ.js"
	},
	"/assets/triangle-alert-ChGe5upY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-MEtTU00eKjSNDtqY8C2VIVDrcA0\"",
		"mtime": "2026-09-03T09:08:15.181Z",
		"size": 265,
		"path": "../public/assets/triangle-alert-ChGe5upY.js"
	},
	"/assets/styles-Cqd2j3XO.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17966-lljvXRy2BPtnwqEwOTSBJ7+Z0L4\"",
		"mtime": "2026-09-03T09:08:15.186Z",
		"size": 96614,
		"path": "../public/assets/styles-Cqd2j3XO.css"
	},
	"/assets/useMutation-BXM8RE_b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8cf-BgeMtWBPsdx/RCJchzK/lmZy3vY\"",
		"mtime": "2026-09-03T09:08:15.181Z",
		"size": 2255,
		"path": "../public/assets/useMutation-BXM8RE_b.js"
	},
	"/assets/useQuery-BX_diIN3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2256-BLhNtGecJ7u7vhR5IzRJDNdEOpw\"",
		"mtime": "2026-09-03T09:08:15.182Z",
		"size": 8790,
		"path": "../public/assets/useQuery-BX_diIN3.js"
	},
	"/assets/users-BF9hlVvX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-zMRe/650hElv7KPCv0d7S5Vy3Kc\"",
		"mtime": "2026-09-03T09:08:15.182Z",
		"size": 306,
		"path": "../public/assets/users-BF9hlVvX.js"
	},
	"/assets/wishlist-DQ7r6UND.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"567-FrSgsSXbO7pub/9Cn9+q7W4ago0\"",
		"mtime": "2026-09-03T09:08:15.182Z",
		"size": 1383,
		"path": "../public/assets/wishlist-DQ7r6UND.js"
	},
	"/assets/ManaSantha_Logo-DHtIdeVI.jpeg": {
		"type": "image/jpeg",
		"etag": "\"2a34bb-CyenopO9jO3G5nE+rveMSli+MPY\"",
		"mtime": "2026-09-03T09:08:15.183Z",
		"size": 2766011,
		"path": "../public/assets/ManaSantha_Logo-DHtIdeVI.jpeg"
	},
	"/assets/images/product-placeholder.png": {
		"type": "image/png",
		"etag": "\"38781-XhadbGl+pKuN8CExMFKfV5lJY/g\"",
		"mtime": "2026-09-03T09:08:15.999Z",
		"size": 231297,
		"path": "../public/assets/images/product-placeholder.png"
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
