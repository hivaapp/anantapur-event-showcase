import wedding from "@/assets/hero-wedding.jpg";
import birthday from "@/assets/gallery-birthday.jpg";
import haldi from "@/assets/gallery-haldi.jpg";
import cradle from "@/assets/gallery-cradle.jpg";
import engagement from "@/assets/gallery-engagement.jpg";
import mandap from "@/assets/gallery-mandap.jpg";
import corporate from "@/assets/gallery-corporate.jpg";

export const services = [
  {
    title: "Wedding Decor",
    image: wedding,
    description: "Grand floral mandaps, marigold canopies and royal stage setups for traditional South Indian weddings.",
    price: "₹45,000",
  },
  {
    title: "Engagement & Reception",
    image: engagement,
    description: "Lavish rose walls, fairy lights and golden lamps that turn your reception into a fairytale.",
    price: "₹35,000",
  },
  {
    title: "Haldi Function",
    image: haldi,
    description: "Sun-kissed marigold swings, yellow drapes and fresh flowers for your most joyful pre-wedding ritual.",
    price: "₹18,000",
  },
  {
    title: "Birthday Celebrations",
    image: birthday,
    description: "Pastel balloon arches, themed backdrops and whimsical setups for kids and adults alike.",
    price: "₹8,500",
  },
  {
    title: "Cradle & Naming Ceremony",
    image: cradle,
    description: "Soft pastel themes, delicate florals and dreamy drapes for your little one's first celebration.",
    price: "₹15,000",
  },
  {
    title: "Corporate & Functions",
    image: corporate,
    description: "Elegant stage decor, podiums and ambient lighting for conferences, launches and corporate galas.",
    price: "₹25,000",
  },
] as const;

export type Service = (typeof services)[number];
