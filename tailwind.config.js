/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ './notes.html' ],
  safelist: [
    // Note elem
    'flex',
    'items-center',
    'justify-between',
    'px-2',
    'py-1',
    'hover:bg-yellow-200',
    'hover:cursor-pointer',
    // Note elem svg
    'h-5',
    'w-5',
    'text-yellow-500',
    // Note span elem
    'text-sm',
    'text-yellow-900',
    'select-none',
    'truncate',
    // tempnoteelem listener
    'bg-yellow-200',
    'hover:cursor-default',
    'hover:cursor-pointer',
    //'hover:bg-yellow-200'
    'italic'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
