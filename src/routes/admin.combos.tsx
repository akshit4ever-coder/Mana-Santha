import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { useState, useRef } from "react";
import { uploadImageToBucket } from "@/lib/product-storage";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/combos")({ component: AdminCombos });

function AdminCombos() {
  const qc = useQueryClient();
  const { data: combos } = useQuery({ queryKey: ["admin-combos"], queryFn: async () => {
    const { data, error } = await supabase.from("combos").select("*").order("date_valid_from", { ascending: false });
    if (error) throw error;
    return data;
  }});

  const [editing, setEditing] = useState<any | null>(null);
  const [productQuery, setProductQuery] = useState("");
  const [productSearchResults, setProductSearchResults] = useState<any[]>([]);
  const [productSearchVisible, setProductSearchVisible] = useState(false);
  const [showAddVegetableForm, setShowAddVegetableForm] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemDraft, setEditingItemDraft] = useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const searchTimerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getComboItemDisplay = (item: any) => {
    const productName = item.product_name || item.product?.name || "Vegetable";
    const unitLabel = item.unit_label || item.variant?.unit || item.product?.unit || "1 kg";
    const quantity = item.quantity ?? 1;
    return `${productName} • ${unitLabel} × ${quantity}`;
  };

  const getImageUrl = (value?: string | null) => value || "/assets/images/product-placeholder.png";

  const syncComboItem = (index: number, updates: any) => {
    const next = (editing.combo_items || []).slice();
    next[index] = { ...next[index], ...updates };
    setEditing({ ...editing, combo_items: next });
  };

  const removeComboItem = (index: number) => {
    const next = (editing.combo_items || []).slice();
    next.splice(index, 1);
    if (editingItemId && next.length === 0) {
      setEditingItemId(null);
      setEditingItemDraft(null);
    }
    setEditing({ ...editing, combo_items: next });
  };

  // Helper to load full combo with enriched product/variant details
  const loadComboDetails = async (comboId: string) => {
    const { data: full, error } = await supabase.from("combos").select("*, combo_items(*)").eq("id", comboId).maybeSingle();
    if (!full) return null;
    const items = full.combo_items || [];
    const productIds = items.map((it: any) => it.product_id).filter(Boolean);
    const variantIds = items.map((it: any) => it.variant_id).filter(Boolean);

    let products: any[] = [];
    let variants: any[] = [];
    if (productIds.length > 0) {
      const { data: p } = await supabase.from("products").select("id,name,image_url,unit").in("id", productIds as any[]);
      products = p || [];
    }
    if (variantIds.length > 0) {
      const { data: v } = await supabase.from("product_variants").select("*").in("id", variantIds as any[]);
      variants = v || [];
    }

    full.combo_items = items.map((it: any, idx: number) => ({
      ...it,
      product: products.find((p) => p.id === it.product_id) || null,
      product_name: (products.find((p) => p.id === it.product_id) || {}).name,
      variant: variants.find((v) => v.id === it.variant_id) || null,
      variant_options: [],
      sort_order: it.sort_order ?? idx,
    }));

    // fetch variant options for products that may have variants
    const uniqueProductIds = Array.from(new Set(productIds));
    if (uniqueProductIds.length > 0) {
      const { data: allVariants } = await supabase.from("product_variants").select("*").in("product_id", uniqueProductIds as any[]).order("sort_order");
      const grouped: Record<string, any[]> = {};
      (allVariants || []).forEach((v: any) => { grouped[v.product_id] = grouped[v.product_id] || []; grouped[v.product_id].push(v); });
      full.combo_items = full.combo_items.map((it: any) => ({ ...it, variant_options: grouped[it.product_id] || [] }));
    }

    return full;
  };

  const save = useMutation({ mutationFn: async (payload: any) => {
    // Delegate to server function which uses service-role supabase
    const mod = await import("../serverFns/comboAdmin.functions");
    const res = await mod.upsertCombo({ data: payload } as any);
    return res;
  }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-combos"] }); toast.success('Combo saved'); }, onError: (err: any) => { console.error('Save error', err); toast.error(err?.message || 'Failed to save combo'); } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Catalog</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Daily Vegetable Combos</h1>
        </div>
        <Button onClick={() => setEditing({})}>New Combo</Button>
      </div>

      <div className="space-y-4">

        <div className="grid gap-3">
          {combos?.map((c: any) => (
            <div key={c.id} className="rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">{c.name}</div>
                  <div className="text-sm text-muted-foreground">Price: ₹{c.price} • Status: {c.status}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={async () => {
                    const full = await loadComboDetails(c.id);
                    setEditing(full || c);
                  }}>Edit</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-600">Combo</p>
                <h2 className="text-xl font-bold text-slate-900">{editing.id ? "Update existing combo" : "Create new combo"}</h2>
              </div>
              <Button variant="outline" onClick={() => setEditing(null)}>Back to list</Button>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
              <div className="space-y-4">
                <section className="rounded-lg border bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900">Combo Information</h3>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Label>Combo Name</Label>
                      <Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label>Regular Price</Label>
                      <Input type="number" value={editing.price || 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="mt-1" />
                    </div>
                    <div>
                      <Label>Offer Price</Label>
                      <Input type="number" value={editing.offer_price || ""} onChange={(e) => setEditing({ ...editing, offer_price: e.target.value ? Number(e.target.value) : null })} className="mt-1" />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <select value={editing.status || "inactive"} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="inactive">inactive</option>
                        <option value="active">active</option>
                      </select>
                    </div>
                    <div>
                      <Label>Valid From</Label>
                      <Input type="date" value={editing.date_valid_from || ""} onChange={(e) => setEditing({ ...editing, date_valid_from: e.target.value || null })} className="mt-1" />
                    </div>
                    <div>
                      <Label>Valid To</Label>
                      <Input type="date" value={editing.date_valid_to || ""} onChange={(e) => setEditing({ ...editing, date_valid_to: e.target.value || null })} className="mt-1" />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Combo Image</Label>
                      <div className="mt-2 rounded-lg border border-dashed bg-white p-3">
                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-start">
                          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border bg-slate-100">
                            {editing.image_url ? (
                              <img src={editing.image_url} alt={editing.name || "Combo image"} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-xs text-slate-500">No image</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                              {editing.image_url ? "Upload Image" : "Upload Image"}
                            </Button>
                            {editing.image_url && (
                              <Button type="button" variant="ghost" onClick={() => setEditing({ ...editing, image_url: "" })} className="text-red-600 hover:text-red-700">
                                Remove Image
                              </Button>
                            )}
                          </div>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            try {
                              const compressed = await uploadImageToBucket(f, "combos", editing.name || "combo", "poster");
                              setEditing({ ...editing, image_url: compressed });
                              toast?.success?.("Image uploaded");
                            } catch (err) {
                              console.error("Upload failed", err);
                              toast?.error?.("Image upload failed");
                            } finally {
                              e.target.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-lg border bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-900">Vegetables in this Combo</h3>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                      {(editing.combo_items || []).length} vegetables
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(editing.combo_items || []).map((it: any, idx: number) => {
                      const isEditing = editingItemId === (it.id || `${it.product_id}-${idx}`);
                      const current = isEditing ? editingItemDraft : it;
                      const productName = current?.product_name || current?.product?.name || current?.product_id || "Vegetable";
                      const unitLabel = current?.unit_label || current?.variant?.unit || current?.product?.unit || "1 kg";

                      return (
                        <div key={it.id || `${it.product_id}-${idx}`} className="rounded-lg border bg-white p-3">
                          {!isEditing ? (
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex min-w-0 items-center gap-3">
                                <img src={getImageUrl(current?.product?.image_url || current?.image_url)} alt={productName} className="h-12 w-12 rounded-md object-cover" />
                                <div className="min-w-0">
                                  <div className="truncate font-medium text-slate-900">{productName}</div>
                                  <div className="text-sm text-slate-600">{unitLabel} × {current?.quantity ?? 1}</div>
                                </div>
                              </div>
                              <div className="flex shrink-0 gap-2">
                                <Button variant="outline" size="sm" onClick={() => {
                                  setEditingItemId(it.id || `${it.product_id}-${idx}`);
                                  setEditingItemDraft({ ...it, quantity: it.quantity ?? 1 });
                                }}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => removeComboItem(idx)}>Remove</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <img src={getImageUrl(current?.product?.image_url || current?.image_url)} alt={productName} className="h-12 w-12 rounded-md object-cover" />
                                <div className="font-medium text-slate-900">{productName}</div>
                              </div>
                              <div className="grid gap-3 md:grid-cols-2">
                                <div>
                                  <Label>Variant / Unit</Label>
                                  <select
                                    value={current?.variant_id || "manual"}
                                    onChange={(e) => {
                                      const variantId = e.target.value;
                                      const selectedVariant = (current?.variant_options || []).find((v: any) => v.id === variantId);
                                      const next = { ...current, variant_id: variantId === "manual" ? null : variantId, unit_label: selectedVariant?.unit || selectedVariant?.name || current?.unit_label || "1 kg" };
                                      setEditingItemDraft(next);
                                    }}
                                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                  >
                                    <option value="manual">Manual unit</option>
                                    {(current?.variant_options || []).map((v: any) => (
                                      <option key={v.id} value={v.id}>{v.name || v.unit || "Variant"}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <Label>Quantity</Label>
                                  <Input type="number" min={1} value={current?.quantity ?? 1} onChange={(e) => setEditingItemDraft({ ...current, quantity: Number(e.target.value) || 1 })} className="mt-1" />
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {['250 g', '500 g', '1 kg', '1 bunch', 'piece'].map((preset) => (
                                  <Button key={preset} type="button" variant={current?.unit_label === preset ? "default" : "outline"} size="sm" onClick={() => setEditingItemDraft({ ...current, unit_label: preset })}>{preset}</Button>
                                ))}
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => {
                                  setEditingItemId(null);
                                  setEditingItemDraft(null);
                                }}>Cancel</Button>
                                <Button size="sm" onClick={() => {
                                  const next = (editing.combo_items || []).slice();
                                  next[idx] = { ...next[idx], ...editingItemDraft, quantity: editingItemDraft.quantity || 1, unit_label: editingItemDraft.unit_label || "1 kg" };
                                  setEditing({ ...editing, combo_items: next });
                                  setEditingItemId(null);
                                  setEditingItemDraft(null);
                                }}>Save</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4">
                    {!showAddVegetableForm ? (
                      <Button type="button" variant="outline" onClick={() => setShowAddVegetableForm(true)} className="w-full justify-center border-dashed">+ Add Vegetable</Button>
                    ) : (
                      <div className="rounded-lg border border-dashed bg-white p-3">
                        <div className="mb-2">
                          <Label>Search vegetable</Label>
                          <Input
                            placeholder="Search vegetable"
                            value={productQuery}
                            onFocus={() => setProductSearchVisible(true)}
                            onChange={(e) => {
                              const q = e.target.value;
                              setProductQuery(q);
                              if (searchTimerRef.current) window.clearTimeout(searchTimerRef.current as any);
                              if (q.length < 2) {
                                setProductSearchResults([]);
                                return;
                              }
                              searchTimerRef.current = window.setTimeout(async () => {
                                const { data } = await supabase.from("products").select("id,name,image_url,unit").ilike("name", `%${q}%`).limit(12).order("name");
                                setProductSearchResults(data || []);
                              }, 250);
                            }}
                            className="mt-1"
                          />
                        </div>

                        {productSearchVisible && productSearchResults.length > 0 && (
                          <div className="mb-3 max-h-52 overflow-auto rounded border bg-slate-50 p-2">
                            {productSearchResults.map((p) => (
                              <button
                                key={p.id}
                                type="button"
                                className="flex w-full items-center justify-between gap-2 rounded p-2 text-left hover:bg-white"
                                onClick={async () => {
                                  const { data: variants } = await supabase.from("product_variants").select("*").eq("product_id", p.id).order("sort_order");
                                  const candidate: any = {
                                    product_id: p.id,
                                    product: p,
                                    product_name: p.name,
                                    variant_id: variants && variants.length > 0 ? variants[0].id : null,
                                    unit_label: variants && variants.length > 0 ? (variants[0].unit || variants[0].name) : p.unit,
                                    quantity: 1,
                                    variant_options: variants || [],
                                  };
                                  setSelectedCandidate(candidate);
                                  setProductSearchVisible(false);
                                  setProductQuery(p.name);
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <img src={p.image_url || "/assets/images/product-placeholder.png"} alt={p.name} className="h-9 w-9 rounded object-cover" />
                                  <div>
                                    <div className="font-medium text-slate-900">{p.name}</div>
                                    <div className="text-xs text-slate-500">{p.unit}</div>
                                  </div>
                                </div>
                                <span className="text-xs text-emerald-700">Select</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {selectedCandidate && (
                          <div className="rounded border bg-slate-50 p-3">
                            <div className="mb-3 flex items-center gap-3">
                              <img src={getImageUrl(selectedCandidate.product?.image_url)} alt={selectedCandidate.product_name} className="h-12 w-12 rounded object-cover" />
                              <div>
                                <div className="font-medium text-slate-900">{selectedCandidate.product_name}</div>
                                <div className="text-sm text-slate-500">{selectedCandidate.product?.unit || "Vegetable"}</div>
                              </div>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                              <div>
                                <Label>Variant / Unit</Label>
                                {selectedCandidate.variant_options && selectedCandidate.variant_options.length > 0 ? (
                                  <select value={selectedCandidate.variant_id || "manual"} onChange={(e) => setSelectedCandidate({ ...selectedCandidate, variant_id: e.target.value === "manual" ? null : e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="manual">Manual unit</option>
                                    {selectedCandidate.variant_options.map((v: any) => (
                                      <option key={v.id} value={v.id}>{v.name || v.unit || "Variant"}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <div className="mt-1 text-sm text-slate-500">No variant options</div>
                                )}
                              </div>
                              <div>
                                <Label>Quantity</Label>
                                <Input type="number" min={1} value={selectedCandidate.quantity || 1} onChange={(e) => setSelectedCandidate({ ...selectedCandidate, quantity: Number(e.target.value) || 1 })} className="mt-1" />
                              </div>
                            </div>

                            <div className="mt-3">
                              <Label>Preset</Label>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {['250 g', '500 g', '1 kg', '1 bunch', 'piece'].map((preset) => (
                                  <Button key={preset} type="button" variant={selectedCandidate.unit_label === preset ? "default" : "outline"} size="sm" onClick={() => setSelectedCandidate({ ...selectedCandidate, unit_label: preset })}>{preset}</Button>
                                ))}
                              </div>
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                              <Button type="button" variant="outline" size="sm" onClick={() => {
                                setSelectedCandidate(null);
                                setProductQuery("");
                              }}>Cancel</Button>
                              <Button type="button" size="sm" onClick={() => {
                                const next = editing.combo_items ? editing.combo_items.slice() : [];
                                const dup = next.find((x: any) => x.product_id === selectedCandidate.product_id && (x.variant_id || null) === (selectedCandidate.variant_id || null));
                                if (dup) {
                                  toast.error("This product/variant is already added");
                                  return;
                                }
                                next.push({
                                  product_id: selectedCandidate.product_id,
                                  product: selectedCandidate.product,
                                  product_name: selectedCandidate.product_name,
                                  variant_id: selectedCandidate.variant_id || null,
                                  unit_label: selectedCandidate.unit_label || selectedCandidate.product?.unit || "1 kg",
                                  quantity: selectedCandidate.quantity || 1,
                                  sort_order: next.length,
                                  variant_options: selectedCandidate.variant_options || [],
                                });
                                setEditing({ ...editing, combo_items: next });
                                setSelectedCandidate(null);
                                setProductQuery("");
                                setShowAddVegetableForm(false);
                              }}>Add Vegetable</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <aside className="space-y-4">
                <section className="rounded-lg border bg-slate-50 p-4">
                  <h3 className="text-base font-semibold text-slate-900">Combo Summary</h3>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <div className="flex items-center justify-between"><span>{(editing.combo_items || []).length} vegetables</span></div>
                    <div className="flex items-center justify-between"><span>Regular Price</span><span className="font-medium">₹{Number(editing.price || 0)}</span></div>
                    <div className="flex items-center justify-between"><span>Offer Price</span><span className="font-medium">₹{Number(editing.offer_price || 0)}</span></div>
                    <div className="flex items-center justify-between"><span>Status</span><span className="font-medium capitalize">{editing.status || "inactive"}</span></div>
                    <div className="flex items-center justify-between"><span>Valid</span><span className="font-medium">{editing.date_valid_from || "—"} to {editing.date_valid_to || "—"}</span></div>
                  </div>
                </section>
              </aside>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2 border-t pt-4">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button variant="ghost" onClick={() => setPreviewOpen(true)}>Preview</Button>
              <Button onClick={async () => { await save.mutateAsync(editing); setEditing(null); }}>{editing.id ? "Update Combo" : "Update Combo"}</Button>
            </div>
          </div>
        )}

        {previewOpen && editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Today's Combo</p>
                  <h3 className="text-2xl font-bold text-slate-900">{editing.name || "Combo"}</h3>
                </div>
                <Button variant="outline" size="sm" onClick={() => setPreviewOpen(false)}>Close</Button>
              </div>

              <div className="flex flex-col gap-4">
                {editing.image_url && (
                  <img src={editing.image_url} alt={editing.name || "Combo preview"} className="h-48 w-full rounded-lg object-cover" />
                )}

                <div className="text-sm text-slate-600">{(editing.combo_items || []).length} vegetables included</div>

                <div className="space-y-2">
                  {(editing.combo_items || []).map((it: any, idx: number) => (
                    <div key={it.id || `${it.product_id}-${idx}`} className="flex items-center justify-between gap-3 rounded border p-2 text-sm">
                      <span>{it.product_name || it.product?.name || "Vegetable"}</span>
                      <span>{it.unit_label || it.product?.unit || "1 kg"}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-md bg-slate-50 p-3">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Regular Price</span>
                    <span>₹{Number(editing.price || 0)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-base font-semibold text-slate-900">
                    <span>Combo Price</span>
                    <span>₹{Number(editing.offer_price || editing.price || 0)}</span>
                  </div>
                </div>

                <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">కాంబోలో చేర్చండి</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
