import "./Marquee.css";

const DEFAULT_ITEMS = [
  "Youth Voices", "◆", "Community Arts", "◆", "Mental Wellness", "◆",
  "Environmental Action", "◆", "Digital Bridge", "◆", "The Mosaic Foundation", "◆",
  "Teen-Led", "◆", "18 Cities", "◆", "2,400+ Lives", "◆", "Est. 2023", "◆",
];

export default function Marquee({ items = DEFAULT_ITEMS, speed = 40, reverse = false, accent = "var(--coral)" }) {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-track ${reverse ? "reverse" : ""}`} style={{"--speed": `${speed}s`, "--accent": accent}}>
      <div className="marquee-inner">
        {doubled.map((item, i) => (
          <span key={i} className={item === "◆" ? "marquee-sep" : "marquee-item"}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
