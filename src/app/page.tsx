"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  Factory,
  FlaskConical,
  Hammer,
  Home,
  Leaf,
  Package,
  Pill,
  Search,
  Shirt,
  Truck,
  Zap,
} from "lucide-react";

type Member = {
  name: string;
  specialties: string[];
  primaryCategory: string;
};

const MEMBERS: Member[] = [
  { name: "Agarwal Enterprise", specialties: ["Shirt Manufacturing"], primaryCategory: "Textiles" },
  { name: "Amrut Ventures", specialties: ["Frozen Fruits", "Vegetables"], primaryCategory: "Agro" },
  { name: "Ancient Roots Global", specialties: ["Ayurveda Herbs"], primaryCategory: "Healthcare" },
  {
    name: "Anecon Global",
    specialties: ["Cotton Textile", "Sportswear", "Plastic Items"],
    primaryCategory: "Textiles",
  },
  { name: "Anvi Global", specialties: ["Turmeric", "Spices"], primaryCategory: "Agro" },
  { name: "Arcentli", specialties: ["Branded Beverages", "FMCG"], primaryCategory: "FMCG" },
  { name: "Arnica Impex", specialties: ["Textile Fabric", "Shirting"], primaryCategory: "Textiles" },
  { name: "Arumai Foods", specialties: ["Ready-to-Eat Food"], primaryCategory: "FMCG" },
  { name: "Atlantis Trading", specialties: ["Agro", "Spices", "Steel"], primaryCategory: "Agro" },
  { name: "Ayas Kant", specialties: ["Kandhamal Turmeric", "GI Products"], primaryCategory: "Agro" },
  { name: "Ahiri", specialties: ["Handloom Fabrics"], primaryCategory: "Textiles" },
  { name: "Ayodhya Healthcare", specialties: ["Ahswgandha"], primaryCategory: "Healthcare" },
  {
    name: "Arihant Enterprise",
    specialties: ["Fruit", "Vegetables", "Spices"],
    primaryCategory: "Agro",
  },
  { name: "Bharath Global", specialties: ["Herbal Products"], primaryCategory: "Healthcare" },
  { name: "Bicyclist", specialties: ["Handicraft Leather Goods"], primaryCategory: "Handicraft" },
  { name: "Bridge Axis", specialties: ["Pickle", "Spices", "Dehydrated"], primaryCategory: "FMCG" },
  { name: "Beauty Villa", specialties: ["Clinical Machines", "Salon Products"], primaryCategory: "Healthcare" },
  { name: "BKH Enterprise", specialties: ["Coco Peat"], primaryCategory: "Agro" },
  { name: "Coral Polypack", specialties: ["Plastic Packaging"], primaryCategory: "Packaging" },
  { name: "Cigren Overseas", specialties: ["Rice", "Spices", "Handicraft"], primaryCategory: "Agro" },
  { name: "Deepak", specialties: ["Web Solutions", "Export Website"], primaryCategory: "Services" },
  { name: "Devalaye", specialties: ["Women's Indian Wear"], primaryCategory: "Textiles" },
  { name: "DP Polyfilms", specialties: ["Mulching Film", "Stretch Film"], primaryCategory: "Packaging" },
  {
    name: "Dhruv Katariya",
    specialties: ["Dehydrated Onion Powder", "Garlic Powder", "Spices"],
    primaryCategory: "Agro",
  },
  {
    name: "Durga Enterprise",
    specialties: ["Ayurvedic Herbal Medicine", "Allopathic Medicine"],
    primaryCategory: "Healthcare",
  },
  { name: "Devling Ayushcare", specialties: ["Perfume", "Oils", "Animal Feed"], primaryCategory: "FMCG" },
  { name: "Dmira Global Product", specialties: ["Leather"], primaryCategory: "Manufacturing" },
  { name: "DMH Expoship", specialties: ["Foxnuts", "Red Chilli", "Moringa"], primaryCategory: "Agro" },
  { name: "Exportix Global", specialties: ["Agro", "Spice", "Fertiliser"], primaryCategory: "Agro" },
  { name: "Fabley", specialties: ["Skincare", "Hair Oil", "Cosmetics"], primaryCategory: "FMCG" },
  {
    name: "Farmer to Factory",
    specialties: ["Fruits", "Vegetables", "Spices"],
    primaryCategory: "Agro",
  },
  { name: "Farm95", specialties: ["Rice", "Spices", "Foxnuts"], primaryCategory: "Agro" },
  { name: "Flying Nimbus", specialties: ["Agro", "Frozen"], primaryCategory: "Agro" },
  {
    name: "Fabrix Indiq",
    specialties: ["Home Furnishings", "Upholstery", "Leather Goods"],
    primaryCategory: "Textiles",
  },
  { name: "Glenstorm", specialties: ["Workwear", "Uniform Manufacturing"], primaryCategory: "Textiles" },
  { name: "Global Chem Food", specialties: ["Raw Salt"], primaryCategory: "Chemicals" },
  { name: "Global Sea Trans", specialties: ["CHA", "Kandla Operations"], primaryCategory: "Logistics" },
  { name: "Gisa Global Solution", specialties: ["Agro", "Spices"], primaryCategory: "Agro" },
  {
    name: "Green Origin",
    specialties: ["Eco Friendly Disposables", "Gifting Solutions", "Home Essentials"],
    primaryCategory: "FMCG",
  },
  { name: "Greenspire Co.", specialties: ["Moringa Based Products"], primaryCategory: "Agro" },
  { name: "Go Green India", specialties: ["RDF"], primaryCategory: "Services" },
  { name: "Globroute", specialties: ["Medicinal Plants", "Dehydrated Food"], primaryCategory: "Agro" },
  { name: "Hayath Foods", specialties: ["Mango", "Guava", "Papaya"], primaryCategory: "Agro" },
  { name: "Harsh Exports", specialties: ["Coffee", "Onion", "Banana", "Chilli"], primaryCategory: "Agro" },
  { name: "Imran Exports", specialties: ["Vegetables", "Indian Snacks"], primaryCategory: "Agro" },
  { name: "Indoclan Exports", specialties: ["South Indian Handicraft"], primaryCategory: "Handicraft" },
  { name: "Indibuy", specialties: ["Hotel Amenities", "Jewellery", "Handicrafts"], primaryCategory: "Handicraft" },
  { name: "Jagdeep Enterprise", specialties: ["Banana Broom", "Spices"], primaryCategory: "Agro" },
  { name: "JMJ Trading", specialties: ["Areca Nuts", "Grass Brooms"], primaryCategory: "Agro" },
  { name: "Jema Aurum", specialties: ["Natural Stone", "Related Products"], primaryCategory: "Construction" },
  {
    name: "Kaizen Exports",
    specialties: ["Healthcare Advisory", "Export Consulting"],
    primaryCategory: "Services",
  },
  { name: "Karni Exim", specialties: ["Agro", "Spice", "Copper", "Jewellery"], primaryCategory: "Agro" },
  { name: "Kivaro Global", specialties: ["Agro", "Rice", "Pulses"], primaryCategory: "Agro" },
  { name: "Key Engineering", specialties: ["Automobile"], primaryCategory: "Manufacturing" },
  { name: "Khatu Shyam Makhana", specialties: ["Fox Nuts"], primaryCategory: "Agro" },
  { name: "Kerkar Products", specialties: ["Agro", "Jaggery", "Spices"], primaryCategory: "Agro" },
  { name: "Kesari Aluminium", specialties: ["Aluminium Extrusion"], primaryCategory: "Metals" },
  {
    name: "Latin Trade Solution",
    specialties: ["Freight Forwarding", "Mexico", "Latin America"],
    primaryCategory: "Logistics",
  },
  { name: "MSPS Tradelinks", specialties: ["Handicraft", "Antiques"], primaryCategory: "Handicraft" },
  { name: "Mukesh Iron", specialties: ["Cast Iron Fittings", "Nut Bolts"], primaryCategory: "Metals" },
  { name: "MPU Exim", specialties: ["Heavy Earth Moving Machinery"], primaryCategory: "Machinery" },
  { name: "Meghmani", specialties: ["Chemicals"], primaryCategory: "Chemicals" },
  { name: "Navdeep", specialties: ["Export Banking", "Jaggery"], primaryCategory: "Services" },
  { name: "Nirvatva", specialties: ["Furniture"], primaryCategory: "Manufacturing" },
  { name: "Ntech Ship Care", specialties: ["Ship Machinery Spare Parts"], primaryCategory: "Machinery" },
  { name: "Obsidian", specialties: ["Dairy Products"], primaryCategory: "FMCG" },
  { name: "Off Pattern Labs", specialties: ["Sales", "Marketing"], primaryCategory: "Services" },
  { name: "Omera Industries", specialties: ["Agro", "Rice", "Pulses"], primaryCategory: "Agro" },
  { name: "Om Sera Tiles LLP", specialties: ["Tiles", "Sanitary Ware"], primaryCategory: "Construction" },
  { name: "Praprit Agro", specialties: ["Foxnuts", "Agro Commodities"], primaryCategory: "Agro" },
  { name: "PS Global", specialties: ["Dehydrated Fruits", "Dehydrated Vegetables"], primaryCategory: "Agro" },
  {
    name: "Paracasa",
    specialties: ["Modular Furniture", "Kitchen Cabinet", "Wardrobe"],
    primaryCategory: "Manufacturing",
  },
  { name: "P2M International", specialties: ["Nuts", "Rice", "Spices", "Onion"], primaryCategory: "Agro" },
  { name: "Ragya Enterprise", specialties: ["Hand Tufted Rugs"], primaryCategory: "Textiles" },
  { name: "Rajadhiraj Pvt Ltd", specialties: ["Merchant Exports"], primaryCategory: "Services" },
  { name: "Realms Enterprise", specialties: ["Spices", "DEF", "Minerals"], primaryCategory: "Agro" },
  { name: "Rivaan Global", specialties: ["Spices"], primaryCategory: "Agro" },
  { name: "Sanganeria Steel", specialties: ["All Steel Products"], primaryCategory: "Metals" },
  { name: "Sarvagya", specialties: ["Bio Fertiliser", "Pesticides"], primaryCategory: "Agro" },
  {
    name: "Savera Handicraft",
    specialties: ["Metal Handicraft", "Wooden Jewellery"],
    primaryCategory: "Handicraft",
  },
  { name: "Savira Global", specialties: ["Spices", "Dehydrated Vegetables"], primaryCategory: "Agro" },
  { name: "Shekina International", specialties: ["Quartz Products"], primaryCategory: "Construction" },
  { name: "Shobha Auto Parts", specialties: ["Engine Parts", "Auto Parts"], primaryCategory: "Machinery" },
  { name: "Sofsscroll", specialties: ["Makhana", "Foxnuts"], primaryCategory: "Agro" },
  { name: "Sparrow International", specialties: ["Agro", "Tiles"], primaryCategory: "Agro" },
  {
    name: "SSD Face",
    specialties: ["Dates", "Dry Dates", "Rice", "Pulses", "Tea", "Spices"],
    primaryCategory: "Agro",
  },
  { name: "SSS Global", specialties: ["Leather Goods"], primaryCategory: "Manufacturing" },
  { name: "Sumesha Technocrats", specialties: ["Pashmina Wool", "Coffee Beans"], primaryCategory: "Textiles" },
  { name: "Swift Cargo", specialties: ["Freight Forwarder"], primaryCategory: "Logistics" },
  { name: "Sass Logistics", specialties: ["CHA", "Freight Forwarder"], primaryCategory: "Logistics" },
  {
    name: "South Coast Exports",
    specialties: ["Coconut", "Ginger", "Potato", "Chilli"],
    primaryCategory: "Agro",
  },
  { name: "Spheres Overseas", specialties: ["Coffee", "Wine"], primaryCategory: "FMCG" },
  { name: "Salvo Exports", specialties: ["Spices", "Vegetables"], primaryCategory: "Agro" },
  { name: "SSK Enterprise", specialties: ["Agarbatti", "Indian Spices"], primaryCategory: "FMCG" },
  {
    name: "Shree Sai Pig Farm",
    specialties: ["Cotton Seed Oil Cake", "Cattle Feed"],
    primaryCategory: "Agro",
  },
  {
    name: "Shivaba Food Processing",
    specialties: ["Maize", "Pooni Rice", "Spices"],
    primaryCategory: "Agro",
  },
  { name: "Teira Blue", specialties: ["Leather Products"], primaryCategory: "Manufacturing" },
  { name: "Thangam Tex Mill", specialties: ["Dhoti", "Lungi", "Grey Fabric"], primaryCategory: "Textiles" },
  { name: "Trediz", specialties: ["Food Safe Paper Packaging"], primaryCategory: "Packaging" },
  { name: "Treveni Granicera", specialties: ["Granite", "Natural Stone"], primaryCategory: "Construction" },
  { name: "Triosanjh", specialties: ["Foxnuts", "Scrap", "Agro", "Rugs"], primaryCategory: "Agro" },
  { name: "Tamil Crew Globals", specialties: ["Ready To Eat Food"], primaryCategory: "FMCG" },
  { name: "Tribes&Tales", specialties: ["Food", "Beverages"], primaryCategory: "FMCG" },
  { name: "Unitas Ceramica", specialties: ["Tiles"], primaryCategory: "Construction" },
  { name: "Uplix Health", specialties: ["Medical Implants", "Ayurvedic"], primaryCategory: "Healthcare" },
  { name: "Urbanwave", specialties: ["Handicraft"], primaryCategory: "Handicraft" },
  { name: "Vingrow", specialties: ["Customised Apparel Manufacturing"], primaryCategory: "Textiles" },
  { name: "Volare Potentia", specialties: ["Agro Commodities"], primaryCategory: "Agro" },
  { name: "voltQ", specialties: ["Battery", "Electronics", "Solar"], primaryCategory: "Energy" },
  { name: "Viahamdicraftdukan", specialties: ["Chilli", "Handicrafts", "Toys"], primaryCategory: "Handicraft" },
  { name: "Worldwide Logistics", specialties: ["Freight Forwarders"], primaryCategory: "Logistics" },
  { name: "Yash", specialties: ["Pashmina Wool", "Coffee"], primaryCategory: "Textiles" },
  { name: "Yul", specialties: ["Wollen Carpets", "Shawls"], primaryCategory: "Textiles" },
  { name: "Verixa International", specialties: ["Onion Powder"], primaryCategory: "Agro" },
  { name: "Zolindu", specialties: ["High Fashion Garment"], primaryCategory: "Textiles" },
];

const CATEGORY_ORDER = [
  "Agro",
  "Textiles",
  "Services",
  "Logistics",
  "FMCG",
  "Healthcare",
  "Manufacturing",
  "Handicraft",
  "Packaging",
  "Construction",
  "Machinery",
  "Metals",
  "Chemicals",
  "Energy",
];

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Agro: Leaf,
  Textiles: Shirt,
  Services: Briefcase,
  Logistics: Truck,
  FMCG: Package,
  Healthcare: Pill,
  Manufacturing: Factory,
  Handicraft: Hammer,
  Packaging: Package,
  Construction: Home,
  Machinery: Factory,
  Metals: Factory,
  Chemicals: FlaskConical,
  Energy: Zap,
};

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(MEMBERS.map((member) => member.primaryCategory)));
    const sorted = CATEGORY_ORDER.filter((category) => uniqueCategories.includes(category));
    const remaining = uniqueCategories
      .filter((category) => !CATEGORY_ORDER.includes(category))
      .sort((a, b) => a.localeCompare(b));

    return ["All", ...sorted, ...remaining];
  }, []);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return MEMBERS.filter((member) => {
      const categoryMatch = selectedCategory === "All" || member.primaryCategory === selectedCategory;

      if (!categoryMatch) {
        return false;
      }

      if (!query) {
        return true;
      }

      const inName = member.name.toLowerCase().includes(query);
      const inSpecialties = member.specialties.some((specialty) => specialty.toLowerCase().includes(query));

      return inName || inSpecialties;
    });
  }, [search, selectedCategory]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/95">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Kivaro Member Directory</h1>
          <p className="mt-1 text-sm text-neutral-400">Search exporters by company and specialization.</p>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search company or specialty"
              className="h-14 w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-12 pr-4 text-base text-neutral-100 outline-none transition focus:border-neutral-600"
            />
          </div>

          <div className="mt-4 overflow-x-auto pb-1">
            <div className="flex min-w-max gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      isActive
                        ? "border-neutral-100 bg-neutral-100 text-neutral-950"
                        : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-600"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            Showing <span className="font-semibold text-neutral-100">{filteredMembers.length}</span> of {MEMBERS.length}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => {
            const CategoryIcon = CATEGORY_ICONS[member.primaryCategory] ?? Briefcase;

            return (
              <article key={member.name} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold leading-tight text-neutral-100">{member.name}</h2>
                  <span className="inline-flex items-center gap-1 rounded-md border border-neutral-800 px-2 py-1 text-xs text-neutral-300">
                    <CategoryIcon className="h-3.5 w-3.5" />
                    {member.primaryCategory}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((specialty) => (
                    <span
                      key={`${member.name}-${specialty}`}
                      className="rounded-md border border-neutral-800 px-2 py-1 text-xs text-neutral-400"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        {filteredMembers.length === 0 ? (
          <p className="mt-10 border border-neutral-800 p-6 text-center text-sm text-neutral-400">
            No members found for this search and category.
          </p>
        ) : null}
      </section>
    </main>
  );
}
