import { jsx, jsxs } from "react/jsx-runtime";
import { Leaf } from "lucide-react";
//#region src/components/Layout/Footer.jsx
function Footer() {
	return /* @__PURE__ */ jsxs("footer", {
		className: "mt-16 border-t bg-gradient-fresh",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "container mx-auto grid gap-8 px-4 py-10 md:grid-cols-4",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground",
						children: /* @__PURE__ */ jsx(Leaf, { className: "h-5 w-5" })
					}), /* @__PURE__ */ jsx("span", {
						className: "text-lg font-bold text-primary",
						children: "Mana Santha"
					})]
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Fresh groceries delivered to your doorstep. Kirana essentials, farm-fresh produce, dairy, and more."
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
					className: "mb-3 text-sm font-semibold",
					children: "Shop"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx("li", { children: "Fruits & Vegetables" }),
						/* @__PURE__ */ jsx("li", { children: "Dairy & Eggs" }),
						/* @__PURE__ */ jsx("li", { children: "Rice & Atta" }),
						/* @__PURE__ */ jsx("li", { children: "Snacks" })
					]
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
					className: "mb-3 text-sm font-semibold",
					children: "Help"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx("li", { children: "Track Order" }),
						/* @__PURE__ */ jsx("li", { children: "Returns" }),
						/* @__PURE__ */ jsx("li", { children: "FAQ" }),
						/* @__PURE__ */ jsx("li", { children: "Contact Us" })
					]
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
					className: "mb-3 text-sm font-semibold",
					children: "Company"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx("li", { children: "About Mana Santha" }),
						/* @__PURE__ */ jsx("li", { children: "Careers" }),
						/* @__PURE__ */ jsx("li", { children: "Terms" }),
						/* @__PURE__ */ jsx("li", { children: "Privacy" })
					]
				})] })
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "border-t py-4 text-center text-xs text-muted-foreground",
			children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" Mana Santha. Fresh groceries, delivered daily."
			]
		})]
	});
}
//#endregion
export { Footer as t };
