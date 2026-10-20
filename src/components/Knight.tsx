/** The shrugging knight, defined once as an SVG symbol and reused via <Knight />. */
export function KnightDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <symbol id="knight" viewBox="-1 -4 66 68">
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 45 L10 50 L6 37" stroke="#4f5768" strokeWidth="8.5" />
          <path d="M21 45 L10 50 L6 37" stroke="#b7bfcc" strokeWidth="5.5" />
          <path d="M43 45 L54 50 L58 37" stroke="#4f5768" strokeWidth="8.5" />
          <path d="M43 45 L54 50 L58 37" stroke="#b7bfcc" strokeWidth="5.5" />
        </g>
        <ellipse cx="6" cy="33" rx="5" ry="4.2" fill="#ffcc4d" stroke="#b77a10" strokeWidth="1.4" />
        <ellipse cx="58" cy="33" rx="5" ry="4.2" fill="#ffcc4d" stroke="#b77a10" strokeWidth="1.4" />
        <path d="M20 41 H44 L47.5 62.5 H16.5 Z" fill="#c8343b" stroke="#6f1a1f" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M30 45.5 h4 v5 h5 v4 h-5 v8 h-4 v-8 h-5 v-4 h5 z" fill="#f2c14e" stroke="#9a6a00" strokeWidth=".8" />
        <ellipse cx="20" cy="42.5" rx="6.5" ry="4.3" fill="#c3cad6" stroke="#4f5768" strokeWidth="1.6" />
        <ellipse cx="44" cy="42.5" rx="6.5" ry="4.3" fill="#c3cad6" stroke="#4f5768" strokeWidth="1.6" />
        <g transform="rotate(-9 32 24)">
          <path d="M33 7.5 C34.5 1 45 -1.5 52 2.5 C45.5 2.8 41.5 5.5 38.5 10.5 Z" fill="#d6403f" stroke="#6f1a1f" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M15 37.5 V20 C15 10 22.5 5 32 5 C41.5 5 49 10 49 20 V37.5 C43 41.5 21 41.5 15 37.5 Z" fill="#c9d0db" stroke="#4f5768" strokeWidth="1.7" />
          <path d="M40.5 7.6 C45.6 10.2 49 14.6 49 20 V37.5 C47.2 38.7 44.8 39.6 42 40.2 C44.4 32 44.6 15.4 40.5 7.6 Z" fill="#9ea7b8" />
          <rect x="20.5" y="16.5" width="23" height="20.5" rx="6.5" fill="#ffcc4d" stroke="#4f5768" strokeWidth="1.5" />
          <rect x="18.5" y="11.5" width="27" height="6.5" rx="3.2" fill="#8e97a8" stroke="#4f5768" strokeWidth="1.5" />
          <path d="M23 14.8 H41" stroke="#353b47" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M24 23 Q26.6 20.2 29.4 21.6" fill="none" stroke="#5c3608" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M34.6 21.4 Q37.4 19.4 40 21.2" fill="none" stroke="#5c3608" strokeWidth="1.7" strokeLinecap="round" />
          <ellipse cx="26.8" cy="26" rx="1.7" ry="2.2" fill="#3d2a0a" />
          <ellipse cx="37.2" cy="25.6" rx="1.7" ry="2.2" fill="#3d2a0a" />
          <path d="M26.5 32 Q29.5 30.6 32 32 T38 31.4" fill="none" stroke="#3d2a0a" strokeWidth="1.7" strokeLinecap="round" />
        </g>
      </symbol>
    </svg>
  );
}

export function Knight() {
  return (
    <svg className="knight" aria-hidden="true">
      <use href="#knight" />
    </svg>
  );
}
