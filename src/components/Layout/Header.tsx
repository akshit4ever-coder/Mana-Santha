import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingCart, User, Heart, LogOut, LayoutDashboard, Package } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "@/components/UI/button";
import LogoIcon from "@/assets/ManaSantha_Logo.jpeg";
import TitleImg from "@/assets/Mana Santa Title.jpg";
import { Input } from "@/components/UI/input";
import { useAuth } from "@/lib/auth";
import { useCart, useWishlist } from "@/lib/queries";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/UI/dropdown-menu";
import { useEffect, useState } from "react";
import { getOrderCutoffStatus } from "@/lib/delivery-cutoff";

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const { data: cart } = useCart(user?.id);
  const { data: wishlist } = useWishlist(user?.id);
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartCount = cart?.reduce((s: number, i: any) => s + (i.quantity ?? 0), 0) ?? 0;
  const wishlistCount = wishlist?.length ?? 0;
  const cutoffStatus = getOrderCutoffStatus();

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.username || user?.email?.split("@")[0] || "Account";

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } as any });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[rgba(255,249,236,0.95)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(255,249,236,0.85)]">
      <div className="hidden w-full border-b bg-[#176B3A] px-4 py-1 text-[13px] text-[#fff9ec] md:block">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm">
            <span>🚚 Same Day Delivery in Your Area</span>
            <span className="opacity-70">🌿 Fresh & Quality Products</span>
            <span className="opacity-70">❤️ Best Prices Always</span>
          </div>

          <div className="text-sm opacity-90">📍 Deliver to {/* location preserved by existing site */} Your Area</div>
        </div>
      </div>

      {/* Mobile top row */}
      <div className="container mx-auto px-4 md:hidden">
        <div className="flex h-12 items-center justify-between gap-2 py-2">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <img src={LogoIcon} alt="Mana Santa logo" className="h-11 w-11 object-contain rounded-lg" />
            <span className="truncate text-lg font-bold text-[#173522]">మన సంత</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <Button asChild variant="ghost" size="icon" className="relative"><Link to="/wishlist"><Heart className="h-5 w-5 text-[#176B3A]" />{wishlistCount > 0 && (<span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F97316] px-1 text-xs font-bold text-white">{wishlistCount}</span>)}</Link></Button>
            <Button asChild variant="ghost" size="icon" className="relative"><Link to="/cart"><ShoppingCart className="h-5 w-5 text-[#176B3A]" />{cartCount > 0 && (<span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F97316] px-1 text-xs font-bold text-white">{cartCount}</span>)}</Link></Button>
            <Button aria-label="Open menu" onClick={() => setIsMobileMenuOpen(true)} variant="ghost" size="icon" className="ml-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-[#d9c9a4] bg-[#f4ead3] shadow-sm ring-1 ring-[#f3e2b6]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#173522" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </Button>
          </div>
        </div>

        {/* Mobile search row */}
        <form onSubmit={onSearch} className="mb-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#173522]" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="h-12 w-full rounded-full bg-[#fff] pl-12 pr-4 text-sm shadow-sm" />
          </div>
        </form>

        {/* Mobile pills */}
        <div className="mb-3 flex gap-3 overflow-x-auto">
          <Link to="/daily-combo" className="shrink-0 rounded-full bg-[#238B45] px-4 py-2 text-sm font-semibold text-white">నేటి కాంబో</Link>
          <a href="/shop-fresh" className="shrink-0 rounded-full bg-[#238B45] px-4 py-2 text-sm font-semibold text-white">Shop Fresh</a>
          <a href="/kirana-essentials" className="shrink-0 rounded-full bg-[#F97316] px-4 py-2 text-sm font-semibold text-white shadow-sm">Kirana Essentials</a>
          <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-900">
            {cutoffStatus.isAfterCutoff ? "Orders now for tomorrow delivery" : "Order before 7:30 PM for today’s delivery"}
          </span>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden container mx-auto md:flex h-[88px] items-center gap-4 px-4 py-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-17 w-17 items-center justify-center rounded-lg bg-transparent p-0">
              <img src={LogoIcon} alt="Mana Santa logo" className="h-[3.6rem] w-[3.6rem] object-contain rounded-lg" />
            </div>
          </Link>

          <div className="hidden sm:block">
            <img src={TitleImg} alt="Mana Santa" className="h-12 object-contain rounded-lg" />
          </div>
        </div>

        <form onSubmit={onSearch} className="relative mx-4 flex flex-1 items-center sm:mx-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#173522]" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for atta, dal, milk, snacks..."
            className="h-11 w-full rounded-full border border-[#e6eadf] bg-[#fff9ec] pl-12 text-[#173522] shadow-sm"
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="relative hidden md:inline-flex">
            <Link to="/wishlist"><Heart className="h-5 w-5 text-[#176B3A]" />{wishlistCount > 0 && (<span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F97316] px-1 text-xs font-bold text-white">{wishlistCount}</span>)}</Link>
          </Button>

          <Button asChild variant="ghost" className="relative">
            <Link to="/cart" className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-[#176B3A]" />
              <span className="hidden md:inline text-sm font-medium text-[#173522]">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F97316] px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-full px-3">
                  <User className="h-4 w-4 text-[#176B3A]" />
                  <span className="max-w-[100px] truncate text-xs font-semibold text-[#173522]">{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="font-semibold text-sm">{displayName}</div>
                  <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/orders"><Package className="mr-2 h-4 w-4" />My Orders</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/wishlist"><Heart className="mr-2 h-4 w-4" />Wishlist</Link></DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild><Link to="/admin"><LayoutDashboard className="mr-2 h-4 w-4 text-primary" />Admin Dashboard</Link></DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}><LogOut className="mr-2 h-4 w-4 text-destructive" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="rounded-full px-4"><Link to="/auth">Sign in</Link></Button>
          )}
        </div>
      </div>

      <div className="hidden md:block border-t bg-[#FFF9EC] px-4 md:px-0">
        <nav className="container mx-auto flex items-center gap-3 overflow-x-auto py-1">
          <Link to="/" className="shrink-0 rounded-full bg-[#238B45] px-4 py-2 text-sm font-semibold text-white shadow-sm">Home</Link>
          <Link to="/daily-combo" className="shrink-0 rounded-full bg-[#238B45] px-4 py-2 text-sm font-semibold text-white shadow-sm">నేటి కాంబో</Link>
          <Link to="/shop-fresh" className="shrink-0 rounded-full bg-[#238B45] px-4 py-2 text-sm font-semibold text-white shadow-sm">Shop Fresh</Link>
          <Link to="/kirana-essentials" className="shrink-0 rounded-full bg-[#F97316] px-4 py-2 text-sm font-semibold text-white shadow-sm">Kirana Essentials</Link>
          <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-900">
            {cutoffStatus.isAfterCutoff ? "Orders now for tomorrow delivery" : "Order before 7:30 PM for today’s delivery"}
          </span>
          <div className="hidden md:flex md:items-center md:gap-3">

            {/* <Link to="/shop-fresh" className="shrink-0 rounded-full border border-[#e6eadf] bg-[#FFF9EC] px-4 py-2 text-sm font-semibold text-[#173522]">Categories</Link>
            <Link to="/kirana-essentials" className="shrink-0 rounded-full border border-[#e6eadf] bg-[#FFF9EC] px-4 py-2 text-sm font-semibold text-[#173522]">About Us</Link> */}
          </div>
        </nav>
      </div>

      {mounted && createPortal(
        <div className={`fixed inset-0 z-[100] ${isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div
            className={`absolute inset-y-0 right-0 z-[101] h-full w-[85%] max-w-sm overflow-y-auto rounded-l-3xl bg-white shadow-[0_20px_60px_rgba(10,22,15,0.22)] ring-1 ring-black/5 transition-transform duration-300 ease-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex items-center justify-between border-b border-[#e6eadf] p-4">
              <div className="flex items-center gap-2">
                <img src={LogoIcon} alt="Mana Santa" className="h-13 w-13 object-contain rounded-lg" />
                <div className="font-semibold text-[#173522]">మన సంత</div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9c9a4] bg-[#f7f1e2] text-lg font-semibold text-[#173522] shadow-sm"
              >
                ×
              </button>
            </div>

            <nav className="flex flex-col gap-3 p-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md px-2 py-2 text-base font-medium text-[#173522] hover:bg-[#f7f3ea]">Home</Link>
              <Link to="/daily-combo" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md px-2 py-2 text-base font-medium text-[#173522] hover:bg-[#f7f3ea]">నేటి కాంబో</Link>
              <Link to="/shop-fresh" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md px-2 py-2 text-base font-medium text-[#173522] hover:bg-[#f7f3ea]">Shop Fresh</Link>
              <Link to="/kirana-essentials" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md px-2 py-2 text-base font-medium text-[#173522] hover:bg-[#f7f3ea]">Kirana Essentials</Link>
              <Link to="/shop-fresh" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md px-2 py-2 text-base font-medium text-[#173522] hover:bg-[#f7f3ea]">Categories</Link>
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md px-2 py-2 text-base font-medium text-[#173522] hover:bg-[#f7f3ea]">Orders</Link>
              <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md px-2 py-2 text-base font-medium text-[#173522] hover:bg-[#f7f3ea]">Wishlist</Link>

              {user ? (
                <div className="mt-2 border-t border-[#e6eadf] pt-3">
                  <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#6c7a68]">Account</div>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full rounded-md px-2 py-2 text-left text-base font-medium text-[#173522] hover:bg-[#f7f3ea]"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 rounded-md bg-[#176B3A] px-3 py-2.5 text-center text-base font-semibold text-white shadow-sm hover:bg-[#145a32]"
                >
                  Sign in
                </Link>
              )}
            </nav>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
