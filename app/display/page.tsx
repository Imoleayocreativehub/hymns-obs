"use client";
import { useState, useEffect } from "react";

async function loadHymns() {
  const res = await fetch("/ccc_hymns_full.json");
  return res.json();
}

export default function Display() {
  const [hymn, setHymn] = useState<any>(null);
  const [theme, setTheme] = useState("celestial");
  const [view, setView] = useState("both");
  const [fontSize, setFontSize] = useState("xl");
  const [align, setAlign] = useState("center");
  const [bgImage, setBgImage] = useState("");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const number = parseInt(params.get("number") || "0", 10);
    setTheme(params.get("theme") || "celestial");
    setView(params.get("view") || "both");
    setFontSize(params.get("fontSize") || "xl");
    setAlign(params.get("align") || "center");
    setBgImage(params.get("bgImage") || "");
    setSlide(parseInt(params.get("slide") || "0", 10));

    if (number) {
      loadHymns().then((all: any[]) => {
        const match = all.find((h: any) => h.number === number);
        setHymn(match);
      });
    }
  }, []);

  if (!hymn) return <div className="p-8 text-center">Loading hymn...</div>;
  if (hymn.status === "reserved")
    return <div className="p-8 text-center text-xl">Hymn {hymn.number} is reserved</div>;

  const themes: Record<string, string> = {
    celestial: "bg-gradient-to-b from-white via-blue-200 to-yellow-100 text-blue-900",
    dark: "bg-black text-white",
    light: "bg-white text-black",
    projector: "bg-black text-white",
  };

  const alignment: Record<string, string> = {
    center: "text-center",
    left: "text-left",
    justify: "text-justify",
  };

  // Break hymn into slides (Yoruba + English grouped by lines)
  const slides: { yoruba?: string; english?: string }[] = [];
  const maxLines = Math.max(hymn.yoruba?.length || 0, hymn.english?.length || 0);
  for (let i = 0; i < maxLines; i++) {
    slides.push({
      yoruba: hymn.yoruba?.[i],
      english: hymn.english?.[i],
    });
  }

  const current = slides[slide] || {};

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen p-8 transition-opacity duration-700 opacity-100 ${themes[theme]}`}
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-3xl font-bold mb-4 bg-black/40 px-4 py-2 rounded">
        Hymn {hymn.number}
      </h1>

      {view === "both" && (
        <div className={`grid grid-cols-2 gap-8 w-full ${alignment[align]} text-${fontSize}`}>
          <div>{current.yoruba}</div>
          <div>{current.english}</div>
        </div>
      )}
      {view === "yoruba" && (
        <div className={`w-full ${alignment[align]} text-${fontSize}`}>{current.yoruba}</div>
      )}
      {view === "english" && (
        <div className={`w-full ${alignment[align]} text-${fontSize}`}>{current.english}</div>
      )}
    </div>
  );
}