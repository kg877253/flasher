import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Dropdown({ trigger, label, children }) {
  
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const getItems = () =>
    menuRef.current ? [...menuRef.current.querySelectorAll('[role="menuitem"]')] : [];

  const close = (refocus) => {
    setOpen(false);
    if (refocus) buttonRef.current.focus();
  };

  // When the menu opens, move the focus to the first item
  useEffect(() => {
    if (open) getItems()[0]?.focus();
  }, [open]);

  // Click anywhere outside closes the menu
  useEffect(() => {
    if (!open) return;

    const handleClick = (event) => {
      if (!wrapRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Arrow Down on the button opens the menu
  const handleButtonKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
    }
  };

  // Keyboard control inside the menu
  const handleMenuKeyDown = (event) => {
    const items = getItems();
    const index = items.indexOf(document.activeElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(index + 1) % items.length].focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length].focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0].focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1].focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  // Clicking any menu item closes the menu
  const handleMenuClick = (event) => {
    if (event.target.closest('[role="menuitem"]')) setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className="group flex cursor-pointer items-center gap-2 rounded-full p-1 pr-2 hover:bg-white/10 aria-expanded:bg-white/10"
      >
        {trigger}
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          onKeyDown={handleMenuKeyDown}
          onClick={handleMenuClick}
          className="menu-in absolute right-0 top-full z-30 mt-2 w-60 origin-top-right rounded-xl bg-neutral-900 p-1 shadow-lg ring-1 ring-white/10"
        >
          {children}
        </div>
      )}
    </div>
  );
}

// One row of the menu: a page link (to) or a button (onClick)
export function DropdownItem({ to, onClick, icon: Icon, danger = false, children }) {
  const className = `flex h-9 w-full cursor-pointer items-center gap-3 rounded-md px-2 text-left text-sm focus:outline-none ${
    danger
      ? "text-red-400 hover:bg-red-500/10 focus-visible:bg-red-500/10"
      : "text-gray-200 hover:bg-white/10 focus-visible:bg-white/10"
  }`;

  const content = (
    <>
      {Icon && <Icon size={18} />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} role="menuitem" tabIndex={-1} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" role="menuitem" tabIndex={-1} onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export function DropdownSeparator() {
  return <div role="separator" className="my-1 h-px bg-white/10" />;
}