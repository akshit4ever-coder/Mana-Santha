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
		"mtime": "2026-08-30T07:57:12.556Z",
		"size": 2213,
		"path": "../public/assets/Footer-cdORsa1Z.js"
	},
	"/assets/Header-CCtswHec.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"85e9-KGiuY4clm+IhdxCNmxBftuy6C6k\"",
		"mtime": "2026-08-30T07:57:12.556Z",
		"size": 34281,
		"path": "../public/assets/Header-CCtswHec.js"
	},
	"/assets/ProductCard-BG27JFHL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ffc-fViYfBYMMAtYqQpTJaqD1NWZroM\"",
		"mtime": "2026-08-30T07:57:12.556Z",
		"size": 4092,
		"path": "../public/assets/ProductCard-BG27JFHL.js"
	},
	"/assets/admin.banners-CGI3L4gJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1af9-71IlsMuFPbbY24II9lJ9hFEW+GA\"",
		"mtime": "2026-08-30T07:57:12.557Z",
		"size": 6905,
		"path": "../public/assets/admin.banners-CGI3L4gJ.js"
	},
	"/assets/admin.categories--7LVIYfB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2112-6SrAuMZkdW1iSYrTGxvxPo5eYGY\"",
		"mtime": "2026-08-30T07:57:12.557Z",
		"size": 8466,
		"path": "../public/assets/admin.categories--7LVIYfB.js"
	},
	"/assets/admin-DtJVGLX4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3031-57b72ckPglE2/u3B0uz85viGQu8\"",
		"mtime": "2026-08-30T07:57:12.557Z",
		"size": 12337,
		"path": "../public/assets/admin-DtJVGLX4.js"
	},
	"/assets/Match-A2YpxfhX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be04-UoastAPCmxVZJc4bpJ9HatXpvD4\"",
		"mtime": "2026-08-30T07:57:12.556Z",
		"size": 48644,
		"path": "../public/assets/Match-A2YpxfhX.js"
	},
	"/assets/admin.index-BqKVi0ll.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"828-62i2yfKzQV8w7VOh83Udq6+IIJ8\"",
		"mtime": "2026-08-30T07:57:12.558Z",
		"size": 2088,
		"path": "../public/assets/admin.index-BqKVi0ll.js"
	},
	"/assets/admin.delivery-DVJixhYr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d56-HmKc54h0NtetnetIh5qUHSMm3Pw\"",
		"mtime": "2026-08-30T07:57:12.558Z",
		"size": 7510,
		"path": "../public/assets/admin.delivery-DVJixhYr.js"
	},
	"/assets/admin.customers-CBaD2I2_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fd4-t2KSUlHfpY+D/zRwgCVGYRzEuhI\"",
		"mtime": "2026-08-30T07:57:12.558Z",
		"size": 4052,
		"path": "../public/assets/admin.customers-CBaD2I2_.js"
	},
	"/assets/admin.coupons-zfHEO78a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2093-SNUpyH7p46rTiyj+g+nB6tahHFc\"",
		"mtime": "2026-08-30T07:57:12.557Z",
		"size": 8339,
		"path": "../public/assets/admin.coupons-zfHEO78a.js"
	},
	"/assets/admin.orders-DJ6KNIL5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"903-K/jnuZ1TlGrcFhkntLWhYgkts78\"",
		"mtime": "2026-08-30T07:57:12.559Z",
		"size": 2307,
		"path": "../public/assets/admin.orders-DJ6KNIL5.js"
	},
	"/assets/admin.products-BuR1zBxg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"61cd-sgoBpps53jWtmqIbo/MkywPAr8s\"",
		"mtime": "2026-08-30T07:57:12.559Z",
		"size": 25037,
		"path": "../public/assets/admin.products-BuR1zBxg.js"
	},
	"/assets/admin.settings-CkqKS3yQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f16-9XxCM8BmvwuqX9CEF/IYMrpQda8\"",
		"mtime": "2026-08-30T07:57:12.560Z",
		"size": 7958,
		"path": "../public/assets/admin.settings-CkqKS3yQ.js"
	},
	"/assets/admin.inventory-CK_vU5j9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b86-X4R80o+puuzT1o7e/gn4fyKGwhg\"",
		"mtime": "2026-08-30T07:57:12.558Z",
		"size": 7046,
		"path": "../public/assets/admin.inventory-CK_vU5j9.js"
	},
	"/assets/admin.subcategories-BtBsZb1a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22fb-D4SJUZHnUs++CKQq3exA5z7vX9Y\"",
		"mtime": "2026-08-30T07:57:12.560Z",
		"size": 8955,
		"path": "../public/assets/admin.subcategories-BtBsZb1a.js"
	},
	"/assets/auth-OvhGYkOI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2be4-b8Yrb1kAu3tpa76cJxXTtxUloRI\"",
		"mtime": "2026-08-30T07:57:12.560Z",
		"size": 11236,
		"path": "../public/assets/auth-OvhGYkOI.js"
	},
	"/assets/badge-BtvKdvIS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30e-r+qs2nRXyR7WHXBn3OdwIXqRzyc\"",
		"mtime": "2026-08-30T07:57:12.560Z",
		"size": 782,
		"path": "../public/assets/badge-BtvKdvIS.js"
	},
	"/assets/bike-DzgsIyKi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"120-SNJ17/mINBHhrrltURUsz/5EAz4\"",
		"mtime": "2026-08-30T07:57:12.560Z",
		"size": 288,
		"path": "../public/assets/bike-DzgsIyKi.js"
	},
	"/assets/category._slug-CoBZ90rZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1672-mr9PNmh+KFt/g7iupjp9yCFTiEo\"",
		"mtime": "2026-08-30T07:57:12.561Z",
		"size": 5746,
		"path": "../public/assets/category._slug-CoBZ90rZ.js"
	},
	"/assets/cart-BAUTJiQi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"145d-/RwqCiqsNdOPM7t1RoZOIvr1ZEY\"",
		"mtime": "2026-08-30T07:57:12.560Z",
		"size": 5213,
		"path": "../public/assets/cart-BAUTJiQi.js"
	},
	"/assets/checkout-BewcLqNQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5aa7-E4LA6tQF4wAEZxfapV5S+vS67m4\"",
		"mtime": "2026-08-30T07:57:12.561Z",
		"size": 23207,
		"path": "../public/assets/checkout-BewcLqNQ.js"
	},
	"/assets/admin.reports-C_zkiAUx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5da47-9qAWsitKkSBrgtU43aqxDcI8Jcc\"",
		"mtime": "2026-08-30T07:57:12.559Z",
		"size": 383559,
		"path": "../public/assets/admin.reports-C_zkiAUx.js"
	},
	"/assets/Mana Santa Title-DqZPVoko.jpg": {
		"type": "image/jpeg",
		"etag": "\"842f7-kT9jfyPPFySzN6EU45BADolftAI\"",
		"mtime": "2026-08-30T07:57:12.567Z",
		"size": 541431,
		"path": "../public/assets/Mana Santa Title-DqZPVoko.jpg"
	},
	"/assets/clsx-CjueKrWZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"170-hIN6XMVOMUzluNGmYPaM/SbauwQ\"",
		"mtime": "2026-08-30T07:57:12.561Z",
		"size": 368,
		"path": "../public/assets/clsx-CjueKrWZ.js"
	},
	"/assets/dist-CV95ClVn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8267-BLIAzq5erwIZwIfj0lzFisHNpTY\"",
		"mtime": "2026-08-30T07:57:12.561Z",
		"size": 33383,
		"path": "../public/assets/dist-CV95ClVn.js"
	},
	"/assets/dialog-C7ywW1NZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b50-57eK1L1Apb6KNP0+Uc4aZpEoInU\"",
		"mtime": "2026-08-30T07:57:12.561Z",
		"size": 6992,
		"path": "../public/assets/dialog-C7ywW1NZ.js"
	},
	"/assets/dist-LLrQVNOg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a3-5BKMXbuVR+c0Zh0fBXalrCNbGew\"",
		"mtime": "2026-08-30T07:57:12.561Z",
		"size": 675,
		"path": "../public/assets/dist-LLrQVNOg.js"
	},
	"/assets/dist-CeKYeOJC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97ba-wt4HcsmBpEbhOe5Kw4LpEHHqVec\"",
		"mtime": "2026-08-30T07:57:12.561Z",
		"size": 38842,
		"path": "../public/assets/dist-CeKYeOJC.js"
	},
	"/assets/createLucideIcon-CVnwy2Vf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34e54-OXVLjrOox5Y78dFK6ml1ZrxNgYo\"",
		"mtime": "2026-08-30T07:57:12.561Z",
		"size": 216660,
		"path": "../public/assets/createLucideIcon-CVnwy2Vf.js"
	},
	"/assets/es2015-DC1cJU57.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"721b-1W/1zF/992qEFWZUB/0XYBE+etM\"",
		"mtime": "2026-08-30T07:57:12.561Z",
		"size": 29211,
		"path": "../public/assets/es2015-DC1cJU57.js"
	},
	"/assets/eye-DftuKSdI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"279-+RHYyGqj6/MbhhuaEMiqq2i4Lg8\"",
		"mtime": "2026-08-30T07:57:12.562Z",
		"size": 633,
		"path": "../public/assets/eye-DftuKSdI.js"
	},
	"/assets/format-CA24X11b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-BJVNHHAFrohS89sP8IlCaHomcOE\"",
		"mtime": "2026-08-30T07:57:12.562Z",
		"size": 241,
		"path": "../public/assets/format-CA24X11b.js"
	},
	"/assets/image-BbFAvhTT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10d-q1/gAP9uqxk9eEP7b9eWwhYTm/k\"",
		"mtime": "2026-08-30T07:57:12.562Z",
		"size": 269,
		"path": "../public/assets/image-BbFAvhTT.js"
	},
	"/assets/input-DZScOdgr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"272-Tk/UHzeNnxRiQcwGNApeOm1U2xA\"",
		"mtime": "2026-08-30T07:57:12.562Z",
		"size": 626,
		"path": "../public/assets/input-DZScOdgr.js"
	},
	"/assets/kirana-essentials-DTZxIjui.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"619-zYXhmT4B4LxlT7K6G0QVocbHKq0\"",
		"mtime": "2026-08-30T07:57:12.562Z",
		"size": 1561,
		"path": "../public/assets/kirana-essentials-DTZxIjui.js"
	},
	"/assets/label-BLxjo1fj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b2-CTEmAZv0tzJvYlHZOABHqftf11A\"",
		"mtime": "2026-08-30T07:57:12.562Z",
		"size": 690,
		"path": "../public/assets/label-BLxjo1fj.js"
	},
	"/assets/link-IJWRDUrh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5bbb-dJzdFkaGrPkFRfPPSy9/6PbN/GE\"",
		"mtime": "2026-08-30T07:57:12.563Z",
		"size": 23483,
		"path": "../public/assets/link-IJWRDUrh.js"
	},
	"/assets/loader-circle-DiHifPgd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-6xtDMSA/CZTYgNgvGQD/T3zlIMA\"",
		"mtime": "2026-08-30T07:57:12.563Z",
		"size": 144,
		"path": "../public/assets/loader-circle-DiHifPgd.js"
	},
	"/assets/minus-HGJvXfnR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75-FxCG+2UQRh+yegx8wR8JmcKtcL0\"",
		"mtime": "2026-08-30T07:57:12.563Z",
		"size": 117,
		"path": "../public/assets/minus-HGJvXfnR.js"
	},
	"/assets/index-DWqX_QhY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"578fa-KwVGUj9mNjtgtRMi8RXLHUIK0M0\"",
		"mtime": "2026-08-30T07:57:12.555Z",
		"size": 358650,
		"path": "../public/assets/index-DWqX_QhY.js"
	},
	"/assets/orders-BtcMxPRD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c5e-uStUkhTrrb/VPoYtBgnzn/SmqYc\"",
		"mtime": "2026-08-30T07:57:12.563Z",
		"size": 3166,
		"path": "../public/assets/orders-BtcMxPRD.js"
	},
	"/assets/package-OkNHeG3h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"174-LqWyFb5MPRn/HuV6DRY03Y4kgGI\"",
		"mtime": "2026-08-30T07:57:12.563Z",
		"size": 372,
		"path": "../public/assets/package-OkNHeG3h.js"
	},
	"/assets/plus-DcqyTJlm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-SPXGpHcmFxLG+vC98WDcDTpjh9Y\"",
		"mtime": "2026-08-30T07:57:12.564Z",
		"size": 153,
		"path": "../public/assets/plus-DcqyTJlm.js"
	},
	"/assets/product._slug-Bw0u5B7O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e6e-z76Ccam11SKDO+10VbkzJoOqMlc\"",
		"mtime": "2026-08-30T07:57:12.564Z",
		"size": 7790,
		"path": "../public/assets/product._slug-Bw0u5B7O.js"
	},
	"/assets/product-storage-CjeFVlPL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f3-10NFgIk0DOjQ5NF0/ReNcDidBaQ\"",
		"mtime": "2026-08-30T07:57:12.564Z",
		"size": 2035,
		"path": "../public/assets/product-storage-CjeFVlPL.js"
	},
	"/assets/hero-groceries-m_gCqZg2.jpg": {
		"type": "image/jpeg",
		"etag": "\"38781-XhadbGl+pKuN8CExMFKfV5lJY/g\"",
		"mtime": "2026-08-30T07:57:12.569Z",
		"size": 231297,
		"path": "../public/assets/hero-groceries-m_gCqZg2.jpg"
	},
	"/assets/ManaSantha_Logo-DHtIdeVI.jpeg": {
		"type": "image/jpeg",
		"etag": "\"2a34bb-CyenopO9jO3G5nE+rveMSli+MPY\"",
		"mtime": "2026-08-30T07:57:12.568Z",
		"size": 2766011,
		"path": "../public/assets/ManaSantha_Logo-DHtIdeVI.jpeg"
	},
	"/assets/routes-D1ErtTGw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1388-9irbr258bzHWZVSziDr6TejLDUU\"",
		"mtime": "2026-08-30T07:57:12.564Z",
		"size": 5e3,
		"path": "../public/assets/routes-D1ErtTGw.js"
	},
	"/assets/search-CcVA7eN6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f6-A9Ti8p251iOZ5JcXUYyCn9dYvT0\"",
		"mtime": "2026-08-30T07:57:12.564Z",
		"size": 1014,
		"path": "../public/assets/search-CcVA7eN6.js"
	},
	"/assets/search-D7wzA-JS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-feUx4tlELMhrfGnjpYQLeV+sR38\"",
		"mtime": "2026-08-30T07:57:12.565Z",
		"size": 174,
		"path": "../public/assets/search-D7wzA-JS.js"
	},
	"/assets/select-igMSsu7R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"579b-uI+Xu72JGZi/gQKzdp1tE0LMl6A\"",
		"mtime": "2026-08-30T07:57:12.565Z",
		"size": 22427,
		"path": "../public/assets/select-igMSsu7R.js"
	},
	"/assets/shield-check-o6WoG8bF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-e9zoe62n6RcqObYxa8xhx7gGCmE\"",
		"mtime": "2026-08-30T07:57:12.565Z",
		"size": 320,
		"path": "../public/assets/shield-check-o6WoG8bF.js"
	},
	"/assets/shop-fresh-C0vl6P-o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"616-2wAdmmhDctfxlRgoTGimk4f230A\"",
		"mtime": "2026-08-30T07:57:12.565Z",
		"size": 1558,
		"path": "../public/assets/shop-fresh-C0vl6P-o.js"
	},
	"/assets/shopping-bag-X32CnPKm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"154-w8JWGCNBU1zqjwC0RrfqqbQPX3U\"",
		"mtime": "2026-08-30T07:57:12.565Z",
		"size": 340,
		"path": "../public/assets/shopping-bag-X32CnPKm.js"
	},
	"/assets/tag-BSwb9GJY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"146-ydoJuXdsPuzLLcK3bScVpMUpq+M\"",
		"mtime": "2026-08-30T07:57:12.565Z",
		"size": 326,
		"path": "../public/assets/tag-BSwb9GJY.js"
	},
	"/assets/triangle-alert-BQ3OOQHL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-wOSInFGkiQbrH4czWC0pF2Ug8h4\"",
		"mtime": "2026-08-30T07:57:12.566Z",
		"size": 265,
		"path": "../public/assets/triangle-alert-BQ3OOQHL.js"
	},
	"/assets/trash-2-C6Ep27IR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-rjDHQ0/BqG97o2lxAW1isPp3uU0\"",
		"mtime": "2026-08-30T07:57:12.565Z",
		"size": 328,
		"path": "../public/assets/trash-2-C6Ep27IR.js"
	},
	"/assets/table-DUktgkAa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"671-gZL2yYHQCvLCaRgIYArAnXFJ7+M\"",
		"mtime": "2026-08-30T07:57:12.565Z",
		"size": 1649,
		"path": "../public/assets/table-DUktgkAa.js"
	},
	"/assets/truck-BUOLXnjd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"196-0hizuVg2dE7TsqLG+Ui2Sfu4DB0\"",
		"mtime": "2026-08-30T07:57:12.566Z",
		"size": 406,
		"path": "../public/assets/truck-BUOLXnjd.js"
	},
	"/assets/useMutation-CBOQt1s_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8cf-HRJTg7ijrVjmo+8NgG89fSjPxVY\"",
		"mtime": "2026-08-30T07:57:12.566Z",
		"size": 2255,
		"path": "../public/assets/useMutation-CBOQt1s_.js"
	},
	"/assets/styles-Bb1g6MFo.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1786a-zTgN8hcZh+YcSqDa6aTk52E7aGY\"",
		"mtime": "2026-08-30T07:57:12.570Z",
		"size": 96362,
		"path": "../public/assets/styles-Bb1g6MFo.css"
	},
	"/assets/trending-up-CC2CzmOU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"af-LmSl3plhUzsXFOL1AHbwzNDyjC4\"",
		"mtime": "2026-08-30T07:57:12.566Z",
		"size": 175,
		"path": "../public/assets/trending-up-CC2CzmOU.js"
	},
	"/assets/useMatch-CmBzsMBc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"47c-7IstDZXBU96uwqh3+jbHhCsxbgs\"",
		"mtime": "2026-08-30T07:57:12.566Z",
		"size": 1148,
		"path": "../public/assets/useMatch-CmBzsMBc.js"
	},
	"/assets/useQuery-DBpiuUoE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2256-ucYHhkcZ77Pkm1YhJnAxz0BzGgk\"",
		"mtime": "2026-08-30T07:57:12.566Z",
		"size": 8790,
		"path": "../public/assets/useQuery-DBpiuUoE.js"
	},
	"/assets/users-DihXMyOm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-fDs8ROHjBYGpu9ljx3HnW8Bi/nY\"",
		"mtime": "2026-08-30T07:57:12.566Z",
		"size": 306,
		"path": "../public/assets/users-DihXMyOm.js"
	},
	"/assets/wishlist-CuRce-ev.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"567-3+ohh1Jh/On7/rObXcIZ4BkNYmA\"",
		"mtime": "2026-08-30T07:57:12.566Z",
		"size": 1383,
		"path": "../public/assets/wishlist-CuRce-ev.js"
	},
	"/assets/images/product-placeholder.png": {
		"type": "image/png",
		"etag": "\"38781-XhadbGl+pKuN8CExMFKfV5lJY/g\"",
		"mtime": "2026-08-30T07:57:13.477Z",
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
