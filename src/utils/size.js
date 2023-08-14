/**
 * Calculate the byte length of the input data.
 * It supports data types: String, Buffer, Array, and Object.
 * For non-buffer objects, the function first stringifies them before calculating the size.
 *
 * @param {String|Buffer|Object|Array} data - The data to be size-calculated.
 * @returns {Number} The byte length of the input data.
 */
function calculateSize(data) {
    if (typeof data === 'string' || data instanceof String || data instanceof Buffer) {
        return Buffer.byteLength(data);
    }

    if (typeof data === 'object') {
        return Buffer.byteLength(JSON.stringify(data));
    }
    return 0;
}

module.exports = { calculateSize };
