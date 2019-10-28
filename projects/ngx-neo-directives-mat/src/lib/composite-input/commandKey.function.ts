/**
 * Boolean function that check if the keyboard event is not a normal key but a command like key
 * Will return boolean if the key is Alt, Shift , Control, Delete, Tab, Backspace, Arrows, Home, End, PageUp and PageDown.
 *
 * @export
 * @param e
 */
export function isCommandKey(e: KeyboardEvent): boolean {
    return e.key === 'Delete' || e.key === 'Tab' || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'Left' ||
    e.altKey || e.ctrlKey || e.key === 'Home' || e.key === 'End' || e.key === 'PageDown' || e.key === 'PageUp' ||
    e.key === 'ArrowRight' || e.key === 'Right'  || e.key === 'Control' || e.key === 'Alt'  || e.key === 'Shift';
  }
  