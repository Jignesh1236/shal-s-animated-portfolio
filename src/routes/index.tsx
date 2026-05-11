import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/PortfolioPage";

export const Route = createFileRoute("/")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "Vansal Nagrale — Memer & Internet Chaos Engineer" },
      {
        name: "description",
        content: "Portfolio of Vansal Nagrale (@one.shal) — memer, reel creator and viral content maker. 50M+ views, 850K+ followers.",
      },
      { property: "og:title", content: "Vansal Nagrale — Memer Portfolio" },
      { property: "og:description", content: "Internet chaos, one meme at a time." },
    ],
  }),
});
