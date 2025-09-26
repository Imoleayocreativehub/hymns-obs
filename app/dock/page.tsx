"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

async function loadHymns() {
  const res = await fetch("/ccc_hymns_full.json");
  return res.json();
}

export default function Dock() {
  const [hymns, setHymns] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [theme, setTheme] = useState("celestial");
  const [view, setView] = useState("both");
  const [fontSize, setFontSize] = useState("xl");
  const [align, setAlign] = useState("center");
  const [bgImage, setBgImage] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadHymns().then(setHymns);
  }, []);

  useEffect(() => {
    if (!search) setFiltered(hymns);
    else {
      const term = search.toLowerCase();
      setFiltered(
        hymns.filter(
          (h: any) =>
            String(h.number).includes(term) ||
            (h.yoruba && h.yoruba.join(" ").toLowerCase().includes(term)) ||
            (h.english && h.english.join(" ").toLowerCase().includes(term))
        )
      );
    }
    setSelectedIndex(0);
    setCurrentSlide(0);
  }, [search, hymns]);

  const sendToDisplay = (hymn: any, slide: number) => {
    const params = new URLSearchParams({
      number: hymn.number,
      theme,
      view,
      fontSize,
      align,
      bgImage,
      slide: String(slide),
    });
    window.open(`/display?${params.toString()}`, "display");
  };

  // 🎹 Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === "f") {
          e.preventDefault();
          searchRef.current?.focus();
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
        setCurrentSlide(0);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        setCurrentSlide(0);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentSlide((prev) => prev + 1);
        if (filtered[selectedIndex]) sendToDisplay(filtered[selectedIndex], currentSlide + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
        if (filtered[selectedIndex]) sendToDisplay(filtered[selectedIndex], Math.max(currentSlide - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) sendToDisplay(filtered[selectedIndex], currentSlide);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filtered, selectedIndex, currentSlide]);

  return (
    <div className="p-4 grid gap-4">
      <div className="grid gap-2">
        <Input
          ref={searchRef}
          placeholder="Search hymn by number, title, or text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="border rounded p-2">
            <option value="celestial">Celestial (White/Blue/Gold)</option>
            <option value="dark">Dark Mode</option>
            <option value="light">Light Mode</option>
            <option value="projector">Projector (Large Text)</option>
          </select>
          <select value={view} onChange={(e) => setView(e.target.value)} className="border rounded p-2">
            <option value="both">Both</option>
            <option value="yoruba">Yoruba Only</option>
            <option value="english">English Only</option>
          </select>
          <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="border rounded p-2">
            <option value="lg">Small</option>
            <option value="xl">Medium</option>
            <option value="3xl">Large</option>
            <option value="5xl">Extra Large</option>
          </select>
          <select value={align} onChange={(e) => setAlign(e.target.value)} className="border rounded p-2">
            <option value="center">Center</option>
            <option value="left">Left</option>
            <option value="justify">Justify</option>
          </select>
          <Input
            placeholder="Background image URL (optional)"
            value={bgImage}
            onChange={(e) => setBgImage(e.target.value)}
          />
        </div>
      </div>

      {/* Hymn List */}
      <div className="grid gap-2 max-h-[70vh] overflow-y-auto">
        {filtered.map((hymn: any, i: number) => (
          <Card key={hymn.number} className={i === selectedIndex ? "border-2 border-blue-500" : ""}>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="font-bold">Hymn {hymn.number}</p>
                <p className="text-sm line-clamp-2">
                  {hymn.english?.[0] || hymn.yoruba?.[0] || "(Reserved)"}
                </p>
              </div>
              <Button onClick={() => sendToDisplay(hymn, currentSlide)}>Display</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}