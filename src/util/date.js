/**
 * Converts a Unix timestamp (in milliseconds) to a human-readable date string.
 * @param {number} timestamp The timestamp to convert.
 * @returns {string} A formatted date string.
 */
 export const toDateString = (timestamp) => {
    if (!timestamp) {
        return null;
    }
    const date = new Date(timestamp);
    // You can customize the date format here.
    return date.toLocaleString();
};
