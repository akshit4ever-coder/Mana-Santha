import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-gradient-fresh">
      <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-primary">Mana Santha</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Fresh groceries delivered to your doorstep. Kirana essentials, farm-fresh produce, dairy, and more.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Fruits & Vegetables</li><li>Dairy & Eggs</li><li>Rice & Atta</li><li>Snacks</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Help</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Track Order</li><li>Returns</li><li>FAQ</li><li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About Mana Santha</li><li>Careers</li><li>Terms</li><li>Privacy</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Mana Santha. Fresh groceries, delivered daily.
      </div>
    </footer>
  );
}
