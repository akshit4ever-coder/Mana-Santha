import { t as supabase } from "./client-Dxm-ZOZR.js";
//#region src/lib/product-storage.ts
var PRODUCT_STORAGE_BUCKET = "ManaSantha";
var MAX_IMAGE_SIZE_BYTES = 5242880;
var ALLOWED_IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp"
];
var PLACEHOLDER_IMAGE = "/assets/images/product-placeholder.png";
function slugifyProductName(name) {
	return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product";
}
function buildProductFolderName(name) {
	return slugifyProductName(name);
}
function getStorageObjectPath(imageUrl) {
	if (!imageUrl) return null;
	try {
		const parts = new URL(imageUrl).pathname.split("/").filter(Boolean);
		const bucketIndex = parts.indexOf(PRODUCT_STORAGE_BUCKET);
		if (bucketIndex === -1) return null;
		const objectPath = parts.slice(bucketIndex + 1).join("/");
		return decodeURIComponent(objectPath);
	} catch {
		return null;
	}
}
function buildImagePublicUrl(objectPath) {
	const { data } = supabase.storage.from(PRODUCT_STORAGE_BUCKET).getPublicUrl(objectPath);
	return data.publicUrl;
}
async function uploadProductImage(file, productName) {
	const folderName = buildProductFolderName(productName);
	const extension = (file.name.split(".").pop() || "jpg").toLowerCase();
	const objectPath = `${folderName}/${`product.${extension === "jpeg" ? "jpg" : extension}`}`;
	const { error } = await supabase.storage.from(PRODUCT_STORAGE_BUCKET).upload(objectPath, file, {
		cacheControl: "3600",
		upsert: true,
		contentType: file.type || void 0
	});
	if (error) throw error;
	return buildImagePublicUrl(objectPath);
}
async function uploadImageToBucket(file, folder, itemName, fileNameBase) {
	const folderName = slugifyProductName(itemName);
	const extension = (file.name.split(".").pop() || "jpg").toLowerCase();
	const objectPath = `${folder}/${folderName}/${`${fileNameBase}.${extension === "jpeg" ? "jpg" : extension}`}`;
	const { error } = await supabase.storage.from(PRODUCT_STORAGE_BUCKET).upload(objectPath, file, {
		cacheControl: "3600",
		upsert: true,
		contentType: file.type || void 0
	});
	if (error) throw error;
	return buildImagePublicUrl(objectPath);
}
async function deleteProductImage(imageUrl) {
	const objectPath = getStorageObjectPath(imageUrl);
	if (!objectPath) return;
	const { error } = await supabase.storage.from(PRODUCT_STORAGE_BUCKET).remove([objectPath]);
	if (error) throw error;
}
async function moveProductImage(imageUrl, newProductName) {
	const oldObjectPath = getStorageObjectPath(imageUrl);
	if (!oldObjectPath) return null;
	const newObjectPath = `${buildProductFolderName(newProductName)}/${oldObjectPath.split("/").pop() || "product.jpg"}`;
	const { error } = await supabase.storage.from(PRODUCT_STORAGE_BUCKET).move(oldObjectPath, newObjectPath);
	if (error) throw error;
	return buildImagePublicUrl(newObjectPath);
}
async function compressImageFile(file) {
	if (!file.type.startsWith("image/")) return file;
	if (file.size <= 1048576) return file;
	const imageBitmap = await createImageBitmap(file);
	const canvas = document.createElement("canvas");
	const maxDimension = 1600;
	let { width, height } = imageBitmap;
	if (width > maxDimension || height > maxDimension) {
		const scale = Math.min(maxDimension / width, maxDimension / height, 1);
		width = Math.max(1, Math.round(width * scale));
		height = Math.max(1, Math.round(height * scale));
	}
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext("2d");
	if (!context) return file;
	context.drawImage(imageBitmap, 0, 0, width, height);
	const quality = file.type === "image/png" ? .92 : .82;
	const blob = await new Promise((resolve) => {
		canvas.toBlob(resolve, file.type, quality);
	});
	imageBitmap.close();
	if (!blob) return file;
	const extension = file.name.split(".").pop() || "jpg";
	return new File([blob], file.name.replace(/\.[^.]+$/, `.${extension}`), {
		type: file.type,
		lastModified: Date.now()
	});
}
//#endregion
export { deleteProductImage as a, uploadProductImage as c, compressImageFile as i, MAX_IMAGE_SIZE_BYTES as n, moveProductImage as o, PLACEHOLDER_IMAGE as r, uploadImageToBucket as s, ALLOWED_IMAGE_TYPES as t };
