import React from "react";

export default function DarkModeToggle({ darkMode, toggleDarkMode }) {
  return (
    <button
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleDarkMode}
      className={`fixed top-4 right-4 z-50 p-2 rounded bg-gray-200 ${!darkMode ? 'dark:bg-gray-700 text-gray-800' : 'dark:text-gray-100'} shadow`}
      tabIndex={0}
    >
      {darkMode ? "🌙" : "☀️"}
    </button>
  );
}
