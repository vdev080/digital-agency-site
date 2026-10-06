"use client";

import { useState } from "react";

export default function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      type="button"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      className={`hamburger ${isOpen ? "is-active" : ""}`}
      onClick={() => setIsOpen((open) => !open)}
    >
      <span className="line" />
      <span className="line" />
      <span className="line" />
    </button>
  );
}
