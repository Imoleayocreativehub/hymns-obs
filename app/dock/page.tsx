"use client";
import React, { useEffect, useRef, useState } from "react";

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

  const searchRef = useRef<HTMLInputElement | null>(null);

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

  // Open or update a named window called "hymns_display" (so it can be reused)
  const sendToDisplay = (hymn: any, slide: number) => {
    const params = new URLSearchParams({
      number: String(hymn.number),
      theme,
      view,
      fontSize,
      align,
      bgImage,
      slide: String(slide),
    });
    // Try to reuse an existing window with name 'hymns_display'
    let w: Window | null = null;
    try {
      w = window.open("", "hymns_display");
    } catch (e) {
      w = null;
    }
    if (!w || w.closed) {
      window.open(`/display?${params.toString()}`, "hymns_display", "noopener");
    } else {
      w.location.href = `/display?${params.toString()}`;
      w.focus();
    }
  };

  // Hotkeys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === "f") {
          e.preventDefault();
          searchRef.current?.focus();
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((s) => Math.min(s + 1, Math.max(0, filtered.length - 1)));
        setCurrentSlide(0);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((s) => Math.max(s - 1, 0));
        setCurrentSlide(0);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentSlide((s) => {
          const next = s + 1;
          if (filtered[selectedIndex]) sendToDisplay(filtered[selectedIndex], next);
          return next;
        });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentSlide((s) => {
          const prev = Math.max(s - 1, 0);
          if (filtered[selectedIndex]) sendToDisplay(filtered[selectedIndex], prev);
          return prev;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) sendToDisplay(filtered[selectedIndex], currentSlide);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [filtered, selectedIndex, currentSlide, theme, view, fontSize, align, bgImage]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Celestial Hymns — Dock</h2>

      <div className="mb-3 flex gap-2">
        <input
          ref={searchRef}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Search by number, Yoruba or English text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={theme} onChange={(e) => setTheme(e.target.value)} className="border rounded p-2">
          <option value="celestial">Celestial</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="projector">Projector</option>
        </select>

        <select value={view} onChange={(e) => setView(e.target.value)} className="border rounded p-2">
          <option value="both">Both</option>
          <option value="yoruba">Yoruba</option>
          <option value="english">English</option>
        </select>
      </div>

      <div className="mb-3 flex gap-2 flex-wrap">
        <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="border rounded p-2">
          <option value="lg">Small</option>
          <option value="xl">Medium</option>
          <option value="3xl">Large</option>
          <option value="5xl">XL</option>
        </select>

        <select value={align} onChange={(e) => setAlign(e.target.value)} className="border rounded p-2">
          <option value="center">Center</option>
          <option value="left">Left</option>
          <option value="justify">Justify</option>
        </select>

        <input
          className="border rounded px-3 py-2 flex-1 min-w-[200px]"
          placeholder="Background image URL (optional)"
          value={bgImage}
          onChange={(e) => setBgImage(e.target.value)}
        />

        <button
          onClick={() => {
            if (filtered[selectedIndex]) sendToDisplay(filtered[selectedIndex], currentSlide);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Display (Open/Update window)
        </button>
      </div>

      <div className="border rounded p-2 max-h-[60vh] overflow-auto">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-600">No hymns found. Try clearing the search.</p>
        ) : (
          filtered.map((hymn: any, i: number) => (
            <div
              key={hymn.number}
              className={`p-3 rounded mb-2 flex justify-between items-center ${i === selectedIndex ? "ring-2 ring-blue-400" : "bg-white/5"}`}
              onClick={() => {
                setSelectedIndex(i);
                setCurrentSlide(0);
              }}
            >
              <div>
                <div className="font-bold">Hymn {hymn.number}</div>
                <div className="text-sm text-gray-300">{hymn.english?.[0] || hymn.yoruba?.[0] || "(Reserved)"}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => sendToDisplay(hymn, Math.max(0, currentSlide - 1))}
                  className="px-3 py-1 border rounded"
                >
                  ◀
                </button>
                <button onClick={() => sendToDisplay(hymn, currentSlide)} className="px-3 py-1 bg-green-600 text-white rounded">
                  Send
                </button>
                <button
                  onClick={() => sendToDisplay(hymn, currentSlide + 1)}
                  className="px-3 py-1 border rounded"
                >
                  ▶
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3">Hotkeys: ↑/↓ select hymn, ←/→ slide, Enter send, Ctrl/Cmd+F focus search</p>
    </div>
  );
}
