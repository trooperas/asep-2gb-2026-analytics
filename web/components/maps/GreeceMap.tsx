"use client";

import { useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";

const GEO_URL = "/data/geo/greece.geojson";

// Mapping από GeoJSON names → ελληνικά ονόματα περιφερειών (όπως στα δεδομένα μας)
const PERIFEREIES_MAPPING: Record<string, string[]> = {
  // Αττική - χωρίζεται σε 7 υπο-περιφέρειες
  Attiki: [
    "ΚΕΝΤΡΙΚΟΥ ΤΟΜΕΑ ΑΘΗΝΩΝ",
    "ΒΟΡΕΙΟΥ ΤΟΜΕΑ ΑΘΗΝΩΝ",
    "ΝΟΤΙΟΥ ΤΟΜΕΑ ΑΘΗΝΩΝ",
    "ΔΥΤΙΚΟΥ ΤΟΜΕΑ ΑΘΗΝΩΝ",
    "ΑΝΑΤΟΛΙΚΗΣ ΑΤΤΙΚΗΣ",
    "ΔΥΤΙΚΗΣ ΑΤΤΙΚΗΣ",
    "ΠΕΙΡΑΙΩΣ",
  ],
  // Κεντρική Μακεδονία - 7 περιφερειακές ενότητες
  "Kentriki Makedonia": [
    "ΘΕΣΣΑΛΟΝΙΚΗΣ",
    "ΗΜΑΘΙΑΣ",
    "ΚΙΛΚΙΣ",
    "ΠΕΛΛΑΣ",
    "ΠΙΕΡΙΑΣ",
    "ΣΕΡΡΩΝ",
    "ΧΑΛΚΙΔΙΚΗΣ",
  ],
  // Δυτική Μακεδονία - 4 περιφερειακές ενότητες
  "Dytiki Makedonia": [
    "ΓΡΕΒΕΝΩΝ",
    "ΚΑΣΤΟΡΙΑΣ",
    "ΚΟΖΑΝΗΣ",
    "ΦΛΩΡΙΝΑΣ",
  ],
  // Ανατολική Μακεδονία και Θράκη - 5 περιφερειακές ενότητες
  "Anatoliki Makedonia kai Thraki": [
    "ΔΡΑΜΑΣ",
    "ΕΒΡΟΥ",
    "ΚΑΒΑΛΑΣ",
    "ΞΑΝΘΗΣ",
    "ΡΟΔΟΠΗΣ",
  ],
  // Ήπειρος - 4 περιφερειακές ενότητες
  Ipeiros: [
    "ΑΡΤΑΣ",
    "ΘΕΣΠΡΩΤΙΑΣ",
    "ΙΩΑΝΝΙΝΩΝ",
    "ΠΡΕΒΕΖΑΣ",
  ],
  // Θεσσαλία - 5 περιφερειακές ενότητες
  Thessalia: [
    "ΚΑΡΔΙΤΣΑΣ",
    "ΛΑΡΙΣΑΣ",
    "ΜΑΓΝΗΣΙΑΣ",
    "ΤΡΙΚΑΛΩΝ",
    "ΣΠΟΡΑΔΩΝ",
  ],
  // Ιόνια Νησιά - 5 περιφερειακές ενότητες
  "Ionioi Nisoi": [
    "ΖΑΚΥΝΘΟΥ",
    "ΚΕΡΚΥΡΑΣ",
    "ΚΕΦΑΛΛΗΝΙΑΣ",
    "ΛΕΥΚΑΔΑΣ",
    "ΙΘΑΚΗΣ",
  ],
  // Δυτική Ελλάδα - 3 περιφερειακές ενότητες
  "Dytiki Ellada": [
    "ΑΙΤΩΛΟΑΚΑΡΝΑΝΙΑΣ",
    "ΑΧΑΪΑΣ",
    "ΗΛΕΙΑΣ",
  ],
  // Στερεά Ελλάδα - 5 περιφερειακές ενότητες
  "Stereá Elláda": [
    "ΒΟΙΩΤΙΑΣ",
    "ΕΥΒΟΙΑΣ",
    "ΕΥΡΥΤΑΝΙΑΣ",
    "ΦΘΙΩΤΙΔΑΣ",
    "ΦΩΚΙΔΑΣ",
  ],
  // Πελοπόννησος - 5 περιφερειακές ενότητες
  Peloponnisos: [
    "ΑΡΓΟΛΙΔΑΣ",
    "ΑΡΚΑΔΙΑΣ",
    "ΚΟΡΙΝΘΙΑΣ",
    "ΛΑΚΩΝΙΑΣ",
    "ΜΕΣΣΗΝΙΑΣ",
  ],
  // Βόρειο Αιγαίο - 3 περιφερειακές ενότητες
  "Voreio Aigaio": [
    "ΛΕΣΒΟΥ",
    "ΣΑΜΟΥ",
    "ΧΙΟΥ",
  ],
  // Νότιο Αιγαίο - 2 περιφερειακές ενότητες
  "Notio Aigaio": [
    "ΚΥΚΛΑΔΩΝ",
    "ΔΩΔΕΚΑΝΗΣΟΥ",
  ],
  // Κρήτη - 4 περιφερειακές ενότητες
  Kriti: [
    "ΗΡΑΚΛΕΙΟΥ",
    "ΛΑΣΙΘΙΟΥ",
    "ΡΕΘΥΜΝΗΣ",
    "ΧΑΝΙΩΝ",
  ],
};

// Κανονικοποίηση (lowercase + αφαίρεση τόνων)
function normalize(text: string): string {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

interface CityGeo {
  lat: number;
  lng: number;
  name: string;
}

interface Position {
  kod_thesis: string;
  eidikotita: string;
  foreas: string;
  perifereia: string;
  edra: string;
  theseis: number;
}

interface GreeceMapProps {
  positions: Position[];
  citiesGeo: Record<string, CityGeo>;
  onSelectPerifereia?: (perifereia: string) => void;
}

export default function GreeceMap({
  positions,
  citiesGeo,
  onSelectPerifereia,
}: GreeceMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [, setSelected] = useState<string | null>(null);

  // State για Zoom & Pan
  const [position, setPosition] = useState<{
    coordinates: [number, number];
    zoom: number;
  }>({
    coordinates: [23.5, 38.5],
    zoom: 1,
  });

  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.35 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: Math.max(1, pos.zoom / 1.35) }));
  }

  function handleReset() {
    setPosition({ coordinates: [23.5, 38.5], zoom: 1 });
  }

  // Group by perifereia
  const byPerifereia = useMemo(() => {
    const acc: Record<
      string,
      { count: number; theseis: number; positions: Position[] }
    > = {};
    for (const p of positions) {
      if (!p.perifereia) continue;
      if (!acc[p.perifereia]) {
        acc[p.perifereia] = { count: 0, theseis: 0, positions: [] };
      }
      acc[p.perifereia].count++;
      acc[p.perifereia].theseis += p.theseis;
      acc[p.perifereia].positions.push(p);
    }
    return acc;
  }, [positions]);

  const maxCount = Math.max(
    ...Object.values(byPerifereia).map((d) => d.count),
    1
  );

  function getColor(count: number): string {
    if (count === 0) return "#1a1f2e";
    const intensity = Math.min(count / maxCount, 1);
    return `rgba(0, 229, 255, ${0.15 + intensity * 0.75})`;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "650px",
        position: "relative",
        background: "rgba(10, 14, 26, 0.5)",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid var(--border)",
      }}
    >
      {/* Zoom Controls Buttons */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={handleZoomIn}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "8px",
            background: "rgba(10, 14, 26, 0.85)",
            border: "1px solid var(--border)",
            color: "#00E5FF",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
          title="Μεγέθυνση (+)"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "8px",
            background: "rgba(10, 14, 26, 0.85)",
            border: "1px solid var(--border)",
            color: "#00E5FF",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
          title="Σμίκρυνση (-)"
        >
          -
        </button>
        <button
          type="button"
          onClick={handleReset}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "8px",
            background: "rgba(10, 14, 26, 0.85)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
          title="Επαναφορά (Reset)"
        >
          ⟲
        </button>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 3200,
          center: [23.5, 38.5],
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={(pos) => {
            if (pos.coordinates) {
              setPosition({
                coordinates: pos.coordinates as [number, number],
                zoom: pos.zoom || position.zoom,
              });
            }
          }}
          minZoom={1}
          maxZoom={4.5}
        >
          {/* Map regions */}
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoName = geo.properties?.name || "";

                // Πάρε τις ελληνικές περιφέρειες από το mapping
                const greekNames = PERIFEREIES_MAPPING[geoName] || [];

                // Βρες ΟΛΕΣ τις θέσεις που ανήκουν σε αυτές τις περιφέρειες
                const matchedKeys = Object.keys(byPerifereia).filter((k) =>
                  greekNames.some(
                    (gn) =>
                      normalize(k).includes(normalize(gn)) ||
                      normalize(gn).includes(normalize(k))
                  )
                );

                // Άθροισε τα δεδομένα από όλες τις matched περιφέρειες
                const totalCount = matchedKeys.reduce(
                  (sum, k) => sum + (byPerifereia[k]?.count || 0),
                  0
                );

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getColor(totalCount)}
                    stroke="#0a0e1a"
                    strokeWidth={0.5 / position.zoom}
                    onMouseEnter={() => setHovered(geoName)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                      if (matchedKeys.length > 0) {
                        setSelected(geoName);
                        onSelectPerifereia?.(geoName);
                      }
                    }}
                    style={{
                      default: { outline: "none", transition: "all 0.2s" },
                      hover: {
                        fill: "#00E5FF",
                        outline: "none",
                        cursor: matchedKeys.length > 0 ? "pointer" : "default",
                      },
                      pressed: { outline: "none" },
                    } as any}
                  />
                );
              })
            }
          </Geographies>

          {/* City markers */}
          {Object.entries(citiesGeo).map(([perifereia, city]) => {
            const data = byPerifereia[perifereia];
            if (!data) return null;

            return (
              <Marker
                key={perifereia}
                coordinates={[city.lng, city.lat]}
                onClick={() => {
                  setSelected(perifereia);
                  onSelectPerifereia?.(perifereia);
                }}
              >
                <circle
                  r={8 / Math.sqrt(position.zoom)}
                  fill="#FF006E"
                  opacity={0.75}
                  stroke="#fff"
                  strokeWidth={2 / Math.sqrt(position.zoom)}
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                />
                <text
                  textAnchor="middle"
                  y={-14 / Math.sqrt(position.zoom)}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: `${Math.max(9, 11 / Math.sqrt(position.zoom))}px`,
                    fill: "#E8ECF4",
                    fontWeight: 600,
                    pointerEvents: "none",
                  }}
                >
                  {data.count}
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered &&
          (() => {
            const greekNames = PERIFEREIES_MAPPING[hovered] || [];
            const matchedKeys = Object.keys(byPerifereia).filter((k) =>
              greekNames.some(
                (gn) =>
                  normalize(k).includes(normalize(gn)) ||
                  normalize(gn).includes(normalize(k))
              )
            );
            const totalCount = matchedKeys.reduce(
              (sum, k) => sum + (byPerifereia[k]?.count || 0),
              0
            );

            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  background: "rgba(10, 14, 26, 0.95)",
                  border: "1px solid var(--primary)",
                  backdropFilter: "blur(20px)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "var(--text)",
                  pointerEvents: "none",
                  boxShadow: "0 0 30px rgba(0, 229, 255, 0.3)",
                  zIndex: 20,
                }}
              >
                {hovered}: {totalCount} θέσεις
              </motion.div>
            );
          })()}
      </AnimatePresence>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "16px",
          borderRadius: "10px",
          background: "rgba(10, 14, 26, 0.9)",
          border: "1px solid var(--border)",
          fontSize: "0.75rem",
          zIndex: 10,
        }}
      >
        <div
          style={{
            color: "var(--text-muted)",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 600,
          }}
        >
          Θέσεις
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              background: "rgba(0, 229, 255, 0.15)",
              borderRadius: "3px",
            }}
          />
          <span>Λίγες</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              background: "rgba(0, 229, 255, 0.9)",
              borderRadius: "3px",
            }}
          />
          <span>Πολλές</span>
        </div>
      </div>
    </div>
  );
}