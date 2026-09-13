import React from "react";
import { Truck, HeartHandshake, Tag, Leaf } from "lucide-react";

export function TrustFeatures() {
  const items = [
    {
      icon: "🚚",
      title: "Same Day Delivery",
      subtitle: "Fresh groceries at your doorstep",
    },
    {
      icon: "🌿",
      title: "100% Fresh Quality",
      subtitle: "Farm to your family",
    },
    {
      icon: "🏷",
      title: "Best Prices",
      subtitle: "Everyday savings",
    },
    {
      icon: "♡",
      title: "Trusted by Families",
      subtitle: "Your neighborhood store",
    },
  ];

  return (
    <section className="mt-3 px-1 md:px-0">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-2 px-0 md:grid-cols-4 md:gap-3">
          {items.map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-lg bg-[#FFF9EC] px-2.5 py-3 shadow-sm md:px-3" style={{ width: '100%' }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F8F3E8] text-lg font-medium text-[#176B3A]">{item.icon}</div>
              <div>
                <div className="text-sm font-semibold text-[#173522]">{item.title}</div>
                <div className="mt-1 text-xs text-[#556955]">{item.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
