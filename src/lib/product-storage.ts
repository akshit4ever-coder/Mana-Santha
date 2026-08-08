import { supabase } from "@/integrations/supabase/client";

export const PRODUCT_STORAGE_BUCKET = "ManaSantha";
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const PLACEHOLDER_IMAGE = "/assets/images/product-placeholder.png";

export function slugifyProductName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "product";
}

export function buildProductFolderName(name: string) {
  return slugifyProductName(name);
}

export function getStorageObjectPath(imageUrl?: string | null) {
  if (!imageUrl) return null;

  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    const bucketIndex = parts.indexOf(PRODUCT_STORAGE_BUCKET);

    if (bucketIndex === -1) return null;

    const objectPath = parts.slice(bucketIndex + 1).join("/");
    return decodeURIComponent(objectPath);
  } catch {
    return null;
  }
}

export function buildImagePublicUrl(objectPath: string) {
  const { data } = supabase.storage.from(PRODUCT_STORAGE_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}

export async function uploadProductImage(file: File, productName: string) {
  const folderName = buildProductFolderName(productName);
  const extension = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeExtension = extension === "jpeg" ? "jpg" : extension;
  const fileName = `product.${safeExtension}`;
  const objectPath = `${folderName}/${fileName}`;

  const { error } = await supabase.storage.from(PRODUCT_STORAGE_BUCKET).upload(objectPath, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || undefined,
  });

  if (error) throw error;

  return buildImagePublicUrl(objectPath);
}

export async function uploadImageToBucket(file: File, folder: string, itemName: string, fileNameBase: string) {
  const folderName = slugifyProductName(itemName);
  const extension = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeExtension = extension === "jpeg" ? "jpg" : extension;
  const fileName = `${fileNameBase}.${safeExtension}`;
  const objectPath = `${folder}/${folderName}/${fileName}`;

  const { error } = await supabase.storage.from(PRODUCT_STORAGE_BUCKET).upload(objectPath, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || undefined,
  });

  if (error) throw error;

  return buildImagePublicUrl(objectPath);
}

export async function deleteProductImage(imageUrl?: string | null) {
  const objectPath = getStorageObjectPath(imageUrl);
  if (!objectPath) return;

  const { error } = await supabase.storage.from(PRODUCT_STORAGE_BUCKET).remove([objectPath]);
  if (error) throw error;
}

export async function deleteStorageImage(imageUrl?: string | null) {
  const objectPath = getStorageObjectPath(imageUrl);
  if (!objectPath) return;

  const { error } = await supabase.storage.from(PRODUCT_STORAGE_BUCKET).remove([objectPath]);
  if (error) throw error;
}

export async function moveProductImage(imageUrl: string, newProductName: string) {
  const oldObjectPath = getStorageObjectPath(imageUrl);
  if (!oldObjectPath) return null;

  const newFolder = buildProductFolderName(newProductName);
  const fileName = oldObjectPath.split("/").pop() || "product.jpg";
  const newObjectPath = `${newFolder}/${fileName}`;

  const { error } = await supabase.storage.from(PRODUCT_STORAGE_BUCKET).move(oldObjectPath, newObjectPath);
  if (error) throw error;

  return buildImagePublicUrl(newObjectPath);
}

export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (file.size <= 1024 * 1024) return file;

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

  const quality = file.type === "image/png" ? 0.92 : 0.82;
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, file.type, quality);
  });

  imageBitmap.close();

  if (!blob) return file;

  const extension = file.name.split(".").pop() || "jpg";
  return new File([blob], file.name.replace(/\.[^.]+$/, `.${extension}`), {
    type: file.type,
    lastModified: Date.now(),
  });
}
