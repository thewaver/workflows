export const focusableElementNames = [
  "button",
  "[href]",
  "input",
  "select",
  "textarea",
  "li",
  "a",
  '[tabindex]:not([tabindex="-1"])',
];

export const getFocusableChildren = (element: HTMLElement) => {
  return element.querySelectorAll(focusableElementNames.join(":not(:disabled), "));
};
