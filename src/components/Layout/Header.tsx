import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingCart, User, Heart, LogOut, LayoutDashboard, Package } from "lucide-react";
import { Button } from "@/components/UI/button";
import LogoIcon from "@/assets/ManaSantha_Logo.png";
import { Input } from "@/components/UI/input";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/queries";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/UI/dropdown-menu";
import { useState } from "react";

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const { data: cart } = useCart(user?.id);
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const cartCount = cart?.reduce((s, i) => s + i.quantity, 0) ?? 0;

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.username || user?.email?.split("@")[0] || "Account";

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } as any });
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-none bg-transparent border-0 shadow-none p-0">
            <img src={LogoIcon} alt="Mana Santha" className="h-50 w-50 object-contain" />
          </div>
          <div className="hidden sm:block">
            <div className="text-lg font-bold leading-tight text-primary">Mana Santha</div>
            <div className="text-[10px] font-medium leading-none text-muted-foreground">Fresh to doorstep</div>
          </div>
        </Link>

        <form onSubmit={onSearch} className="relative ml-2 hidden max-w-xl flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for atta, dal, milk, snacks..."
            className="h-10 rounded-full border-secondary bg-secondary/50 pl-10"
          />
        </form>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Link to="/wishlist"><Heart className="h-5 w-5" /></Link>
          </Button>

          <Button asChild variant="ghost" className="relative gap-2">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-full px-3">
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate text-xs font-semibold">{displayName}</span>
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

      <form onSubmit={onSearch} className="border-t bg-secondary/30 px-4 py-2 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="h-9 rounded-full bg-background pl-10" />
        </div>
      </form>
    </header>
  );
}
