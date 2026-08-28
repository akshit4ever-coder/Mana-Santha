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
	"/assets/Footer-cdORsa1Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a5-AWnsMSe5uV0S14F9aRsCasMQ3g0\"",
		"mtime": "2026-08-28T17:21:13.097Z",
		"size": 2213,
		"path": "../public/assets/Footer-cdORsa1Z.js"
	},
	"/assets/Header-ZNsdozXA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"85e9-F54B3CQmk1YNBrEgoY9wDqeonEo\"",
		"mtime": "2026-08-28T17:21:13.097Z",
		"size": 34281,
		"path": "../public/assets/Header-ZNsdozXA.js"
	},
	"/assets/Match-A2YpxfhX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be04-UoastAPCmxVZJc4bpJ9HatXpvD4\"",
		"mtime": "2026-08-28T17:21:13.098Z",
		"size": 48644,
		"path": "../public/assets/Match-A2YpxfhX.js"
	},
	"/assets/ProductCard-C_i8Xg8a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ffc-aoGD0rfGSvV7JCQF/g3Rz9FJ7Ec\"",
		"mtime": "2026-08-28T17:21:13.098Z",
		"size": 4092,
		"path": "../public/assets/ProductCard-C_i8Xg8a.js"
	},
	"/assets/admin-ISk6mBcB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e72-efgdictvecvoEygBp0a3fZ7GPH4\"",
		"mtime": "2026-08-28T17:21:13.098Z",
		"size": 11890,
		"path": "../public/assets/admin-ISk6mBcB.js"
	},
	"/assets/admin.banners-CuNlkEdD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1af9-SUatN6kjb0CcceT1KvcnnV/eptY\"",
		"mtime": "2026-08-28T17:21:13.098Z",
		"size": 6905,
		"path": "../public/assets/admin.banners-CuNlkEdD.js"
	},
	"/assets/admin.categories-Bou51u40.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2112-jD6Mckha1yQ6t7xM4n8/DBQUN50\"",
		"mtime": "2026-08-28T17:21:13.098Z",
		"size": 8466,
		"path": "../public/assets/admin.categories-Bou51u40.js"
	},
	"/assets/admin.customers-DDFMWpFr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fd4-n7k+8Ge9MmgKKRU6yX/Twxw2/Oc\"",
		"mtime": "2026-08-28T17:21:13.099Z",
		"size": 4052,
		"path": "../public/assets/admin.customers-DDFMWpFr.js"
	},
	"/assets/admin.coupons-DbqGANXU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2093-o2dRK+Vnw33lyR5kONGS9oinEvA\"",
		"mtime": "2026-08-28T17:21:13.099Z",
		"size": 8339,
		"path": "../public/assets/admin.coupons-DbqGANXU.js"
	},
	"/assets/admin.index-CkaLZ6JZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"828-2ycYtpSFlbLOvLchORFMAqdSpjw\"",
		"mtime": "2026-08-28T17:21:13.099Z",
		"size": 2088,
		"path": "../public/assets/admin.index-CkaLZ6JZ.js"
	},
	"/assets/admin.delivery-B7J4xlTB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d56-qHkRoEAb0AMZVOq/x/z7z3BNwDE\"",
		"mtime": "2026-08-28T17:21:13.099Z",
		"size": 7510,
		"path": "../public/assets/admin.delivery-B7J4xlTB.js"
	},
	"/assets/admin.inventory-CPOYGi4p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b86-OChYJk0e1dUO7+nBZCyLlb+PSMA\"",
		"mtime": "2026-08-28T17:21:13.099Z",
		"size": 7046,
		"path": "../public/assets/admin.inventory-CPOYGi4p.js"
	},
	"/assets/admin.orders-C46BeJjd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"903-jbScrAS6IHo0PavwYFbnAWToDxw\"",
		"mtime": "2026-08-28T17:21:13.099Z",
		"size": 2307,
		"path": "../public/assets/admin.orders-C46BeJjd.js"
	},
	"/assets/admin.products-BYIrTK_6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"61cd-A+I986hmqJTbPUMZ3yRCBKNawMk\"",
		"mtime": "2026-08-28T17:21:13.099Z",
		"size": 25037,
		"path": "../public/assets/admin.products-BYIrTK_6.js"
	},
	"/assets/admin.settings-DmriPc7p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f16-aVlDd6bzeKrM8ffJ6MwqSv8755M\"",
		"mtime": "2026-08-28T17:21:13.099Z",
		"size": 7958,
		"path": "../public/assets/admin.settings-DmriPc7p.js"
	},
	"/assets/admin.subcategories-DqcTn2fU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22fb-tKMZGyRvnc8Tcfk+HC7PVaFG/c8\"",
		"mtime": "2026-08-28T17:21:13.100Z",
		"size": 8955,
		"path": "../public/assets/admin.subcategories-DqcTn2fU.js"
	},
	"/assets/badge-DKEwzlBn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30e-VZ8Xc3i1bsOMwYg/T1z/1bViNxQ\"",
		"mtime": "2026-08-28T17:21:13.100Z",
		"size": 782,
		"path": "../public/assets/badge-DKEwzlBn.js"
	},
	"/assets/auth-DPZZ3YLA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2be4-eZpzDVU5DGoNn0WsV4je2Hn+bWc\"",
		"mtime": "2026-08-28T17:21:13.100Z",
		"size": 11236,
		"path": "../public/assets/auth-DPZZ3YLA.js"
	},
	"/assets/bike-DzgsIyKi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"120-SNJ17/mINBHhrrltURUsz/5EAz4\"",
		"mtime": "2026-08-28T17:21:13.100Z",
		"size": 288,
		"path": "../public/assets/bike-DzgsIyKi.js"
	},
	"/assets/cart-ClpDQmC-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"145d-T41vltmqKWvxs0ry/xk0SyqLXNw\"",
		"mtime": "2026-08-28T17:21:13.100Z",
		"size": 5213,
		"path": "../public/assets/cart-ClpDQmC-.js"
	},
	"/assets/category._slug-DRWQL7vP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1672-M9Wh8ePEKafFhh108pKd3a28amQ\"",
		"mtime": "2026-08-28T17:21:13.100Z",
		"size": 5746,
		"path": "../public/assets/category._slug-DRWQL7vP.js"
	},
	"/assets/checkout-Cbc7GRj4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5aa7-A7MpM3+qOCFE+WG2X+u/R0qDoS0\"",
		"mtime": "2026-08-28T17:21:13.100Z",
		"size": 23207,
		"path": "../public/assets/checkout-Cbc7GRj4.js"
	},
	"/assets/admin.reports-7bny45HO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5da47-LwSRaqAsYHUZyqzWUmtUSkhEdHA\"",
		"mtime": "2026-08-28T17:21:13.099Z",
		"size": 383559,
		"path": "../public/assets/admin.reports-7bny45HO.js"
	},
	"/assets/Mana Santa Title-DqZPVoko.jpg": {
		"type": "image/jpeg",
		"etag": "\"842f7-kT9jfyPPFySzN6EU45BADolftAI\"",
		"mtime": "2026-08-28T17:21:13.105Z",
		"size": 541431,
		"path": "../public/assets/Mana Santa Title-DqZPVoko.jpg"
	},
	"/assets/clsx-CjueKrWZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"170-hIN6XMVOMUzluNGmYPaM/SbauwQ\"",
		"mtime": "2026-08-28T17:21:13.101Z",
		"size": 368,
		"path": "../public/assets/clsx-CjueKrWZ.js"
	},
	"/assets/createLucideIcon-CVnwy2Vf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34e54-OXVLjrOox5Y78dFK6ml1ZrxNgYo\"",
		"mtime": "2026-08-28T17:21:13.101Z",
		"size": 216660,
		"path": "../public/assets/createLucideIcon-CVnwy2Vf.js"
	},
	"/assets/dialog-Dct0KmTq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b50-Fp515eqQdGvchFYo55MYxoL5qK8\"",
		"mtime": "2026-08-28T17:21:13.101Z",
		"size": 6992,
		"path": "../public/assets/dialog-Dct0KmTq.js"
	},
	"/assets/dist-CV95ClVn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8267-BLIAzq5erwIZwIfj0lzFisHNpTY\"",
		"mtime": "2026-08-28T17:21:13.101Z",
		"size": 33383,
		"path": "../public/assets/dist-CV95ClVn.js"
	},
	"/assets/dist-CeKYeOJC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97ba-wt4HcsmBpEbhOe5Kw4LpEHHqVec\"",
		"mtime": "2026-08-28T17:21:13.101Z",
		"size": 38842,
		"path": "../public/assets/dist-CeKYeOJC.js"
	},
	"/assets/dist-LLrQVNOg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a3-5BKMXbuVR+c0Zh0fBXalrCNbGew\"",
		"mtime": "2026-08-28T17:21:13.101Z",
		"size": 675,
		"path": "../public/assets/dist-LLrQVNOg.js"
	},
	"/assets/es2015-DC1cJU57.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"721b-1W/1zF/992qEFWZUB/0XYBE+etM\"",
		"mtime": "2026-08-28T17:21:13.101Z",
		"size": 29211,
		"path": "../public/assets/es2015-DC1cJU57.js"
	},
	"/assets/eye-DftuKSdI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"279-+RHYyGqj6/MbhhuaEMiqq2i4Lg8\"",
		"mtime": "2026-08-28T17:21:13.102Z",
		"size": 633,
		"path": "../public/assets/eye-DftuKSdI.js"
	},
	"/assets/format-CA24X11b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-BJVNHHAFrohS89sP8IlCaHomcOE\"",
		"mtime": "2026-08-28T17:21:13.102Z",
		"size": 241,
		"path": "../public/assets/format-CA24X11b.js"
	},
	"/assets/hero-groceries-m_gCqZg2.jpg": {
		"type": "image/jpeg",
		"etag": "\"38781-XhadbGl+pKuN8CExMFKfV5lJY/g\"",
		"mtime": "2026-08-28T17:21:13.106Z",
		"size": 231297,
		"path": "../public/assets/hero-groceries-m_gCqZg2.jpg"
	},
	"/assets/image-BbFAvhTT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10d-q1/gAP9uqxk9eEP7b9eWwhYTm/k\"",
		"mtime": "2026-08-28T17:21:13.102Z",
		"size": 269,
		"path": "../public/assets/image-BbFAvhTT.js"
	},
	"/assets/link-IJWRDUrh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5bbb-dJzdFkaGrPkFRfPPSy9/6PbN/GE\"",
		"mtime": "2026-08-28T17:21:13.102Z",
		"size": 23483,
		"path": "../public/assets/link-IJWRDUrh.js"
	},
	"/assets/label-DcRvwduZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b2-yxYBFJyuEzdQzYrIXsdaKdSfCzY\"",
		"mtime": "2026-08-28T17:21:13.102Z",
		"size": 690,
		"path": "../public/assets/label-DcRvwduZ.js"
	},
	"/assets/index-DMJNiYws.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"57872-e5IoK7H/xAHtji6/05AUi6Fxy8g\"",
		"mtime": "2026-08-28T17:21:13.095Z",
		"size": 358514,
		"path": "../public/assets/index-DMJNiYws.js"
	},
	"/assets/minus-HGJvXfnR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75-FxCG+2UQRh+yegx8wR8JmcKtcL0\"",
		"mtime": "2026-08-28T17:21:13.103Z",
		"size": 117,
		"path": "../public/assets/minus-HGJvXfnR.js"
	},
	"/assets/loader-circle-DiHifPgd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-6xtDMSA/CZTYgNgvGQD/T3zlIMA\"",
		"mtime": "2026-08-28T17:21:13.103Z",
		"size": 144,
		"path": "../public/assets/loader-circle-DiHifPgd.js"
	},
	"/assets/package-OkNHeG3h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"174-LqWyFb5MPRn/HuV6DRY03Y4kgGI\"",
		"mtime": "2026-08-28T17:21:13.103Z",
		"size": 372,
		"path": "../public/assets/package-OkNHeG3h.js"
	},
	"/assets/plus-DcqyTJlm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-SPXGpHcmFxLG+vC98WDcDTpjh9Y\"",
		"mtime": "2026-08-28T17:21:13.103Z",
		"size": 153,
		"path": "../public/assets/plus-DcqyTJlm.js"
	},
	"/assets/orders-DAxX_5O3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c5e-7l38iTBvzGglbtc239/LAQOEGYg\"",
		"mtime": "2026-08-28T17:21:13.103Z",
		"size": 3166,
		"path": "../public/assets/orders-DAxX_5O3.js"
	},
	"/assets/product-storage-CjeFVlPL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f3-10NFgIk0DOjQ5NF0/ReNcDidBaQ\"",
		"mtime": "2026-08-28T17:21:13.103Z",
		"size": 2035,
		"path": "../public/assets/product-storage-CjeFVlPL.js"
	},
	"/assets/routes-tmJVzUy8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1388-FTGARa3QCxU/dA4CgZ1ygGNgEW4\"",
		"mtime": "2026-08-28T17:21:13.103Z",
		"size": 5e3,
		"path": "../public/assets/routes-tmJVzUy8.js"
	},
	"/assets/product._slug-DQRCiQnL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e6e-GlNrmux3td8YMGie7C+Tg/1BH+M\"",
		"mtime": "2026-08-28T17:21:13.103Z",
		"size": 7790,
		"path": "../public/assets/product._slug-DQRCiQnL.js"
	},
	"/assets/kirana-essentials-EJQl8jWK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"619-9ZOY5VME8ZhwRSjHFVcO5aeuSpE\"",
		"mtime": "2026-08-28T17:21:13.102Z",
		"size": 1561,
		"path": "../public/assets/kirana-essentials-EJQl8jWK.js"
	},
	"/assets/input-DgSBepZH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"272-MIzhFjCyL1tAJ2Jz/VHKt487G0w\"",
		"mtime": "2026-08-28T17:21:13.102Z",
		"size": 626,
		"path": "../public/assets/input-DgSBepZH.js"
	},
	"/assets/ManaSantha_Logo-DHtIdeVI.jpeg": {
		"type": "image/jpeg",
		"etag": "\"2a34bb-CyenopO9jO3G5nE+rveMSli+MPY\"",
		"mtime": "2026-08-28T17:21:13.106Z",
		"size": 2766011,
		"path": "../public/assets/ManaSantha_Logo-DHtIdeVI.jpeg"
	},
	"/assets/search-BZx4EhEJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f6-FVtb24N/+kk0AdfTldLk+GYuBds\"",
		"mtime": "2026-08-28T17:21:13.103Z",
		"size": 1014,
		"path": "../public/assets/search-BZx4EhEJ.js"
	},
	"/assets/search-D7wzA-JS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-feUx4tlELMhrfGnjpYQLeV+sR38\"",
		"mtime": "2026-08-28T17:21:13.103Z",
		"size": 174,
		"path": "../public/assets/search-D7wzA-JS.js"
	},
	"/assets/select-XPLEQY5Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"579b-kMfBARdKXa7pFMfyr2gHbozETYQ\"",
		"mtime": "2026-08-28T17:21:13.104Z",
		"size": 22427,
		"path": "../public/assets/select-XPLEQY5Y.js"
	},
	"/assets/shield-check-o6WoG8bF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-e9zoe62n6RcqObYxa8xhx7gGCmE\"",
		"mtime": "2026-08-28T17:21:13.104Z",
		"size": 320,
		"path": "../public/assets/shield-check-o6WoG8bF.js"
	},
	"/assets/shopping-bag-X32CnPKm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"154-w8JWGCNBU1zqjwC0RrfqqbQPX3U\"",
		"mtime": "2026-08-28T17:21:13.104Z",
		"size": 340,
		"path": "../public/assets/shopping-bag-X32CnPKm.js"
	},
	"/assets/table-BGr17bd1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"671-A3gENfPMY+ZeKnGMUAisjMdX9p0\"",
		"mtime": "2026-08-28T17:21:13.104Z",
		"size": 1649,
		"path": "../public/assets/table-BGr17bd1.js"
	},
	"/assets/tag-BSwb9GJY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"146-ydoJuXdsPuzLLcK3bScVpMUpq+M\"",
		"mtime": "2026-08-28T17:21:13.104Z",
		"size": 326,
		"path": "../public/assets/tag-BSwb9GJY.js"
	},
	"/assets/shop-fresh-Bx4JSsP9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"616-FrTjIqCIMlMUWYpvdXX4bdACyfo\"",
		"mtime": "2026-08-28T17:21:13.104Z",
		"size": 1558,
		"path": "../public/assets/shop-fresh-Bx4JSsP9.js"
	},
	"/assets/trash-2-C6Ep27IR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-rjDHQ0/BqG97o2lxAW1isPp3uU0\"",
		"mtime": "2026-08-28T17:21:13.104Z",
		"size": 328,
		"path": "../public/assets/trash-2-C6Ep27IR.js"
	},
	"/assets/triangle-alert-BQ3OOQHL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-wOSInFGkiQbrH4czWC0pF2Ug8h4\"",
		"mtime": "2026-08-28T17:21:13.104Z",
		"size": 265,
		"path": "../public/assets/triangle-alert-BQ3OOQHL.js"
	},
	"/assets/styles-Bb1g6MFo.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1786a-zTgN8hcZh+YcSqDa6aTk52E7aGY\"",
		"mtime": "2026-08-28T17:21:13.108Z",
		"size": 96362,
		"path": "../public/assets/styles-Bb1g6MFo.css"
	},
	"/assets/truck-BUOLXnjd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"196-0hizuVg2dE7TsqLG+Ui2Sfu4DB0\"",
		"mtime": "2026-08-28T17:21:13.105Z",
		"size": 406,
		"path": "../public/assets/truck-BUOLXnjd.js"
	},
	"/assets/trending-up-CC2CzmOU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"af-LmSl3plhUzsXFOL1AHbwzNDyjC4\"",
		"mtime": "2026-08-28T17:21:13.104Z",
		"size": 175,
		"path": "../public/assets/trending-up-CC2CzmOU.js"
	},
	"/assets/useMatch-CmBzsMBc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"47c-7IstDZXBU96uwqh3+jbHhCsxbgs\"",
		"mtime": "2026-08-28T17:21:13.105Z",
		"size": 1148,
		"path": "../public/assets/useMatch-CmBzsMBc.js"
	},
	"/assets/useMutation-V_G79m_K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8cf-rC9+IzdtkeNia3sZEbKu4rj3ujE\"",
		"mtime": "2026-08-28T17:21:13.105Z",
		"size": 2255,
		"path": "../public/assets/useMutation-V_G79m_K.js"
	},
	"/assets/useQuery-DxODw3Jc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2256-qOqb+nR/dh4dQq9h6QtQfo7BMpM\"",
		"mtime": "2026-08-28T17:21:13.105Z",
		"size": 8790,
		"path": "../public/assets/useQuery-DxODw3Jc.js"
	},
	"/assets/users-DihXMyOm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-fDs8ROHjBYGpu9ljx3HnW8Bi/nY\"",
		"mtime": "2026-08-28T17:21:13.105Z",
		"size": 306,
		"path": "../public/assets/users-DihXMyOm.js"
	},
	"/assets/wishlist-9wlBlT56.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"567-1qbG1fJ7qlHTdqGn8khrPCwtHmg\"",
		"mtime": "2026-08-28T17:21:13.105Z",
		"size": 1383,
		"path": "../public/assets/wishlist-9wlBlT56.js"
	},
	"/assets/images/product-placeholder.png": {
		"type": "image/png",
		"etag": "\"38781-XhadbGl+pKuN8CExMFKfV5lJY/g\"",
		"mtime": "2026-08-28T17:21:13.899Z",
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
