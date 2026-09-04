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
	"/assets/Footer-CG0DVenT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a5-Ud1LbKVu9dsS3PGdXnePCm/4jYw\"",
		"mtime": "2026-09-03T14:48:35.956Z",
		"size": 2213,
		"path": "../public/assets/Footer-CG0DVenT.js"
	},
	"/assets/Match-CtAL2dIa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be04-q5ihbXdGwwcHTYWFzSarz/4J+AA\"",
		"mtime": "2026-09-03T14:48:35.956Z",
		"size": 48644,
		"path": "../public/assets/Match-CtAL2dIa.js"
	},
	"/assets/ProductCard-W2Z2cBV_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ffc-0edjqnadnxozts0e2IHC0i0dYcc\"",
		"mtime": "2026-09-03T14:48:35.956Z",
		"size": 4092,
		"path": "../public/assets/ProductCard-W2Z2cBV_.js"
	},
	"/assets/admin-BcUe6eoh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d2d-evhm6pYVx7u9dTEzX9EZaOJd2os\"",
		"mtime": "2026-09-03T14:48:35.956Z",
		"size": 11565,
		"path": "../public/assets/admin-BcUe6eoh.js"
	},
	"/assets/admin.banners-uO1FYaEm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1af9-AZihXBBj4Ompgkbl03lS+deYcG8\"",
		"mtime": "2026-09-03T14:48:35.956Z",
		"size": 6905,
		"path": "../public/assets/admin.banners-uO1FYaEm.js"
	},
	"/assets/Header-u5xLhwPq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"895d-+4lc5vO0UIkLfSmaFHzYj0pqmrA\"",
		"mtime": "2026-09-03T14:48:35.956Z",
		"size": 35165,
		"path": "../public/assets/Header-u5xLhwPq.js"
	},
	"/assets/admin.categories-XiMqSsfQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2112-8YDCANRVH0bw7gUP4+ZlfbB8jnM\"",
		"mtime": "2026-09-03T14:48:35.956Z",
		"size": 8466,
		"path": "../public/assets/admin.categories-XiMqSsfQ.js"
	},
	"/assets/admin.coupons-Ci3itd4z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2093-pK9gDL3OI52SYXFWSW5TqczKkMo\"",
		"mtime": "2026-09-03T14:48:35.956Z",
		"size": 8339,
		"path": "../public/assets/admin.coupons-Ci3itd4z.js"
	},
	"/assets/admin.delivery-BwT1z9_l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d56-PagQ/PtwVlRLIWhMiZJ0fc487zo\"",
		"mtime": "2026-09-03T14:48:35.957Z",
		"size": 7510,
		"path": "../public/assets/admin.delivery-BwT1z9_l.js"
	},
	"/assets/admin.index-C9Dx2vWK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"828-OKND9g4Sj1CYijH2YwIZOKTY9Do\"",
		"mtime": "2026-09-03T14:48:35.957Z",
		"size": 2088,
		"path": "../public/assets/admin.index-C9Dx2vWK.js"
	},
	"/assets/admin.inventory-DN4pxauO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b86-eIyFoLmE2hC3tnszQC2baL2+vLM\"",
		"mtime": "2026-09-03T14:48:35.957Z",
		"size": 7046,
		"path": "../public/assets/admin.inventory-DN4pxauO.js"
	},
	"/assets/admin.products-DTjuCyVZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"61cd-KEi/3MhRFa+c6NDwEQadzRL5Hho\"",
		"mtime": "2026-09-03T14:48:35.957Z",
		"size": 25037,
		"path": "../public/assets/admin.products-DTjuCyVZ.js"
	},
	"/assets/admin.orders-BilKN5RK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b76-mGuaeqWKhiDkiz2opslqAjAIRAA\"",
		"mtime": "2026-09-03T14:48:35.957Z",
		"size": 2934,
		"path": "../public/assets/admin.orders-BilKN5RK.js"
	},
	"/assets/admin.customers-C5_q1nYL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fd4-61ZvpzQZRFqQ0JSKMfwrbpKmypg\"",
		"mtime": "2026-09-03T14:48:35.957Z",
		"size": 4052,
		"path": "../public/assets/admin.customers-C5_q1nYL.js"
	},
	"/assets/admin.settings-i-mE9HKi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f16-HnJDHeN/XO4QS1nWdwSIDg4UnFE\"",
		"mtime": "2026-09-03T14:48:35.957Z",
		"size": 7958,
		"path": "../public/assets/admin.settings-i-mE9HKi.js"
	},
	"/assets/admin.subcategories-rQ9uVroU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22fb-3JVA79zSCX0jlQonTA0d5AFGGeo\"",
		"mtime": "2026-09-03T14:48:35.958Z",
		"size": 8955,
		"path": "../public/assets/admin.subcategories-rQ9uVroU.js"
	},
	"/assets/badge-niCGASQV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30e-ZpgQ7ZB0zCET3TqngOa0g2j3yUI\"",
		"mtime": "2026-09-03T14:48:35.958Z",
		"size": 782,
		"path": "../public/assets/badge-niCGASQV.js"
	},
	"/assets/bike-dNDpE9L7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"120-kc3VjWxYpZ/yb0t+wGGSf0enWl8\"",
		"mtime": "2026-09-03T14:48:35.958Z",
		"size": 288,
		"path": "../public/assets/bike-dNDpE9L7.js"
	},
	"/assets/cart-Ci2HcN8W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"145d-yDA5wMUF5CsRXQ1NjoexDoNqzNU\"",
		"mtime": "2026-09-03T14:48:35.958Z",
		"size": 5213,
		"path": "../public/assets/cart-Ci2HcN8W.js"
	},
	"/assets/auth-yhe-EGnw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2be4-nrWoAh47tlXqQ7Ki0YZ8Qsi4rkY\"",
		"mtime": "2026-09-03T14:48:35.958Z",
		"size": 11236,
		"path": "../public/assets/auth-yhe-EGnw.js"
	},
	"/assets/category._slug-GYHhfeDV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1672-kAJ/IBV3xzmIGtHo48ncqB3MMXY\"",
		"mtime": "2026-09-03T14:48:35.958Z",
		"size": 5746,
		"path": "../public/assets/category._slug-GYHhfeDV.js"
	},
	"/assets/checkout-dCtu80Cv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5f3b-7cIsS3SgPvB3o60Vh7l80WaCoCE\"",
		"mtime": "2026-09-03T14:48:35.958Z",
		"size": 24379,
		"path": "../public/assets/checkout-dCtu80Cv.js"
	},
	"/assets/admin.reports-CLg4dSYm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5da42-59pCObk8+VGcAZRExje+pi8FMZo\"",
		"mtime": "2026-09-03T14:48:35.957Z",
		"size": 383554,
		"path": "../public/assets/admin.reports-CLg4dSYm.js"
	},
	"/assets/Mana Santa Title-DqZPVoko.jpg": {
		"type": "image/jpeg",
		"etag": "\"842f7-kT9jfyPPFySzN6EU45BADolftAI\"",
		"mtime": "2026-09-03T14:48:35.962Z",
		"size": 541431,
		"path": "../public/assets/Mana Santa Title-DqZPVoko.jpg"
	},
	"/assets/clsx-CjueKrWZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"170-hIN6XMVOMUzluNGmYPaM/SbauwQ\"",
		"mtime": "2026-09-03T14:48:35.959Z",
		"size": 368,
		"path": "../public/assets/clsx-CjueKrWZ.js"
	},
	"/assets/dist-CLt8eBfz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a3-4JlISyDNDVubsoUW0+gAN2pUz50\"",
		"mtime": "2026-09-03T14:48:35.959Z",
		"size": 675,
		"path": "../public/assets/dist-CLt8eBfz.js"
	},
	"/assets/es2015-DxsLMMkc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7216-q/yhJJ60IhjdQIljn5h6Dufs3+o\"",
		"mtime": "2026-09-03T14:48:35.959Z",
		"size": 29206,
		"path": "../public/assets/es2015-DxsLMMkc.js"
	},
	"/assets/eye-BD9QG4nM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"279-Ig1Bc/T4aJhBFBBNOvAtCacKPBI\"",
		"mtime": "2026-09-03T14:48:35.959Z",
		"size": 633,
		"path": "../public/assets/eye-BD9QG4nM.js"
	},
	"/assets/format-CA24X11b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-BJVNHHAFrohS89sP8IlCaHomcOE\"",
		"mtime": "2026-09-03T14:48:35.959Z",
		"size": 241,
		"path": "../public/assets/format-CA24X11b.js"
	},
	"/assets/dist-Cx_2mWH0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8267-YN8xSOHtVuzLu/SAn1F/jPu4NaE\"",
		"mtime": "2026-09-03T14:48:35.959Z",
		"size": 33383,
		"path": "../public/assets/dist-Cx_2mWH0.js"
	},
	"/assets/createLucideIcon-gYwykkGq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35a3f-rnRpfwzdC9dNGdDbEVT/UvUrBVI\"",
		"mtime": "2026-09-03T14:48:35.959Z",
		"size": 219711,
		"path": "../public/assets/createLucideIcon-gYwykkGq.js"
	},
	"/assets/dist-BMQq3DqG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97ba-pV1ZGWPYEkyq5glJJcQr/B3Nw+Q\"",
		"mtime": "2026-09-03T14:48:35.959Z",
		"size": 38842,
		"path": "../public/assets/dist-BMQq3DqG.js"
	},
	"/assets/dialog-D1DmosLI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b50-peoHVSrWu/vDhjQ+fxkzgP/ZiyE\"",
		"mtime": "2026-09-03T14:48:35.959Z",
		"size": 6992,
		"path": "../public/assets/dialog-D1DmosLI.js"
	},
	"/assets/input-CHbyO20g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"272-7GW0MSeWBdtTNrscNcDrt2UwJTw\"",
		"mtime": "2026-09-03T14:48:35.959Z",
		"size": 626,
		"path": "../public/assets/input-CHbyO20g.js"
	},
	"/assets/image-D1dMQULK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10d-90N0a0yc2teWPlab+Jb/6jFo/Ww\"",
		"mtime": "2026-09-03T14:48:35.959Z",
		"size": 269,
		"path": "../public/assets/image-D1dMQULK.js"
	},
	"/assets/hero-groceries-m_gCqZg2.jpg": {
		"type": "image/jpeg",
		"etag": "\"38781-XhadbGl+pKuN8CExMFKfV5lJY/g\"",
		"mtime": "2026-09-03T14:48:35.963Z",
		"size": 231297,
		"path": "../public/assets/hero-groceries-m_gCqZg2.jpg"
	},
	"/assets/index-CK5W23DZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"57d8b-kYv4dGUMpMhjZXUVdzGb2p884w0\"",
		"mtime": "2026-09-03T14:48:35.955Z",
		"size": 359819,
		"path": "../public/assets/index-CK5W23DZ.js"
	},
	"/assets/label-BhF0WJBX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b2-v1vBCeLbHXguSFkZS3jW6X+tS4Q\"",
		"mtime": "2026-09-03T14:48:35.960Z",
		"size": 690,
		"path": "../public/assets/label-BhF0WJBX.js"
	},
	"/assets/link-YLISchRE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5bbb-5/TPzMnhcqLefHKApWf2noQTuyA\"",
		"mtime": "2026-09-03T14:48:35.960Z",
		"size": 23483,
		"path": "../public/assets/link-YLISchRE.js"
	},
	"/assets/loader-circle-hBBSq4cS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-6i9XtTyoClNtSvW7FDCDTfsCZUw\"",
		"mtime": "2026-09-03T14:48:35.960Z",
		"size": 144,
		"path": "../public/assets/loader-circle-hBBSq4cS.js"
	},
	"/assets/minus-QBQwIROy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75-9VrpOixNcpQ7v0BTmm5sjiBwtAI\"",
		"mtime": "2026-09-03T14:48:35.960Z",
		"size": 117,
		"path": "../public/assets/minus-QBQwIROy.js"
	},
	"/assets/kirana-essentials-DIkQjWq8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"619-EWLlcvSsCSpiqNvnKf+1j421G5A\"",
		"mtime": "2026-09-03T14:48:35.959Z",
		"size": 1561,
		"path": "../public/assets/kirana-essentials-DIkQjWq8.js"
	},
	"/assets/plus-Cco20Aaw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-SOa44AQAoh7cDLX9atua72R8Txk\"",
		"mtime": "2026-09-03T14:48:35.960Z",
		"size": 153,
		"path": "../public/assets/plus-Cco20Aaw.js"
	},
	"/assets/package-BNEivOQK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"174-8Zad+bjtSI6WzBsB2eNvZWaX6cA\"",
		"mtime": "2026-09-03T14:48:35.960Z",
		"size": 372,
		"path": "../public/assets/package-BNEivOQK.js"
	},
	"/assets/orders-D8zF1n6C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f3b-0cHjRMgSo0ku5mROi33VomZwHSg\"",
		"mtime": "2026-09-03T14:48:35.960Z",
		"size": 3899,
		"path": "../public/assets/orders-D8zF1n6C.js"
	},
	"/assets/product-storage-mAyI4RxF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f3-woP2T+NUIZas1d/BKGzl3hY3A6w\"",
		"mtime": "2026-09-03T14:48:35.960Z",
		"size": 2035,
		"path": "../public/assets/product-storage-mAyI4RxF.js"
	},
	"/assets/product._slug-DBSVAeLy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e6e-mXUrovNOdbI24GfqKTohato4HMA\"",
		"mtime": "2026-09-03T14:48:35.960Z",
		"size": 7790,
		"path": "../public/assets/product._slug-DBSVAeLy.js"
	},
	"/assets/routes-Dv5j-dJO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1388-E3YQtVjxswxx0ydacNWlL7+Q2i0\"",
		"mtime": "2026-09-03T14:48:35.960Z",
		"size": 5e3,
		"path": "../public/assets/routes-Dv5j-dJO.js"
	},
	"/assets/ManaSantha_Logo-DHtIdeVI.jpeg": {
		"type": "image/jpeg",
		"etag": "\"2a34bb-CyenopO9jO3G5nE+rveMSli+MPY\"",
		"mtime": "2026-09-03T14:48:35.963Z",
		"size": 2766011,
		"path": "../public/assets/ManaSantha_Logo-DHtIdeVI.jpeg"
	},
	"/assets/search-B4lQ8e91.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f6-H5KHxAmhYKogPkTxw1KS9Ppmc64\"",
		"mtime": "2026-09-03T14:48:35.960Z",
		"size": 1014,
		"path": "../public/assets/search-B4lQ8e91.js"
	},
	"/assets/search-CcGb8fQd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-b2BZJplJZOgwViPzuZgBWNPacUI\"",
		"mtime": "2026-09-03T14:48:35.960Z",
		"size": 174,
		"path": "../public/assets/search-CcGb8fQd.js"
	},
	"/assets/select-BjfEB3yd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"579b-r5gpVgBipjnssd9sxrtxdufL6fw\"",
		"mtime": "2026-09-03T14:48:35.961Z",
		"size": 22427,
		"path": "../public/assets/select-BjfEB3yd.js"
	},
	"/assets/shield-check-GZVy3i6y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-s/CanFgJhvpWoApdxj21NbBEnng\"",
		"mtime": "2026-09-03T14:48:35.961Z",
		"size": 320,
		"path": "../public/assets/shield-check-GZVy3i6y.js"
	},
	"/assets/shop-fresh-B9vGKAs5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"616-4Gtnd98MgDZrJzaMXgopVXzLyaI\"",
		"mtime": "2026-09-03T14:48:35.961Z",
		"size": 1558,
		"path": "../public/assets/shop-fresh-B9vGKAs5.js"
	},
	"/assets/shopping-bag-BrBj5AFc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"154-5sS4YPYRbMx/+vwKusKOQdY1zCE\"",
		"mtime": "2026-09-03T14:48:35.961Z",
		"size": 340,
		"path": "../public/assets/shopping-bag-BrBj5AFc.js"
	},
	"/assets/styles-Cqd2j3XO.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17966-lljvXRy2BPtnwqEwOTSBJ7+Z0L4\"",
		"mtime": "2026-09-03T14:48:35.966Z",
		"size": 96614,
		"path": "../public/assets/styles-Cqd2j3XO.css"
	},
	"/assets/table-xr2vDizU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"671-Ue916Z6xF9uI5kPNxWiOak2DBq8\"",
		"mtime": "2026-09-03T14:48:35.961Z",
		"size": 1649,
		"path": "../public/assets/table-xr2vDizU.js"
	},
	"/assets/tag-DL2x8d8g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"146-Ned6nk9NakFxMQou4d9/be3BC/Q\"",
		"mtime": "2026-09-03T14:48:35.961Z",
		"size": 326,
		"path": "../public/assets/tag-DL2x8d8g.js"
	},
	"/assets/trash-2-RZZFu3ED.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-kmnB3CqpbHXhAZ6fg/VXZIHSo2M\"",
		"mtime": "2026-09-03T14:48:35.961Z",
		"size": 328,
		"path": "../public/assets/trash-2-RZZFu3ED.js"
	},
	"/assets/trending-up-D6E7ID9Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"af-n4/sSsQ5gvBSkUqjRHy37Sp9J1g\"",
		"mtime": "2026-09-03T14:48:35.961Z",
		"size": 175,
		"path": "../public/assets/trending-up-D6E7ID9Y.js"
	},
	"/assets/truck-BNYHXzZ1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"196-zeI/0LCkLG868VRc4OafGQNDHUc\"",
		"mtime": "2026-09-03T14:48:35.961Z",
		"size": 406,
		"path": "../public/assets/truck-BNYHXzZ1.js"
	},
	"/assets/triangle-alert-BJPQkXc-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-P/ZfiZW/5ceWKiNiWwygr/SZQiI\"",
		"mtime": "2026-09-03T14:48:35.961Z",
		"size": 265,
		"path": "../public/assets/triangle-alert-BJPQkXc-.js"
	},
	"/assets/useMatch-CEkkl1sR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"47c-xrSYNALq/pCgZjxQbVHdk8HVQHg\"",
		"mtime": "2026-09-03T14:48:35.961Z",
		"size": 1148,
		"path": "../public/assets/useMatch-CEkkl1sR.js"
	},
	"/assets/users-B_PMEkm1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-891jrHAIjS+w9v6QM0KjUxfgNio\"",
		"mtime": "2026-09-03T14:48:35.962Z",
		"size": 306,
		"path": "../public/assets/users-B_PMEkm1.js"
	},
	"/assets/useQuery-D5dQFHvQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2256-5vOitLMViif1XN88m++wtfSXTAI\"",
		"mtime": "2026-09-03T14:48:35.962Z",
		"size": 8790,
		"path": "../public/assets/useQuery-D5dQFHvQ.js"
	},
	"/assets/wishlist-CgLUdbOo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"567-zXe/EyOkNbRbi8lfq2/BSdBdtXI\"",
		"mtime": "2026-09-03T14:48:35.962Z",
		"size": 1383,
		"path": "../public/assets/wishlist-CgLUdbOo.js"
	},
	"/assets/useMutation-C9TJDTgz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8cf-QmPT7iY0gRQ0Gkj5VCpLZSwZkT0\"",
		"mtime": "2026-09-03T14:48:35.962Z",
		"size": 2255,
		"path": "../public/assets/useMutation-C9TJDTgz.js"
	},
	"/assets/images/product-placeholder.png": {
		"type": "image/png",
		"etag": "\"38781-XhadbGl+pKuN8CExMFKfV5lJY/g\"",
		"mtime": "2026-09-03T14:48:36.750Z",
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
