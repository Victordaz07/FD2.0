/**
 * Boolean conversion helper
 * Safely converts various types to boolean, handling strings "true"/"false" correctly
 * 
 * @param v - Value to convert (can be boolean, string, number, null, undefined)
 * @param fallback - Default value if conversion is not possible (default: false)
 * @returns boolean
 * 
 * @example
 * toBool("true") // true
 * toBool("false") // false
 * toBool("1") // true
 * toBool("0") // false
 * toBool(1) // true
 * toBool(0) // false
 * toBool(true) // true
 * toBool(false) // false
 * toBool(null) // false (fallback)
 * toBool(undefined) // false (fallback)
 */
export function toBool(v: unknown, fallback = false): boolean {
    if (typeof v === 'boolean') return v;

    if (typeof v === 'string') {
        const s = v.trim().toLowerCase();
        if (s === 'true' || s === '1') return true;
        if (s === 'false' || s === '0' || s === '') return false;
        return fallback;
    }

    if (typeof v === 'number') {
        return v === 1 ? true : v === 0 ? false : fallback;
    }

    return fallback;
}

