const { Buffer } = require('buffer');
const { debugWrapper } = require('../utils/debug');
const { gzip, gunzip } = require('./gzip');
const { stringify, parse } = require('./hpack');

/**
 * Compresses a JSON object using the Gzip compression algorithm. This is accomplished by first
 * stringifying the JSON object, and then compressing it into a Buffer object. If the debug
 * parameter is set to true, the function measures and logs the performance and the size
 * of the compressed data.
 *
 * @function compress
 * @param {Object} jsonObject - The JSON object that needs to be compressed.
 * @param {boolean} [debug=false] - Optional parameter that defaults to false. If set to true,
 * it will measure the performance and size of the compressed data and log these details.
 * @returns {Buffer} The compressed data as a Buffer object. If an error occurs during
 * compression, an Error is thrown.
 * @throws {Error} If an error occurs during the compression process.
 */
function compress(jsonObject, debug = false) {
    const [startDebug, endDebug, errorDebug] = debugWrapper('compress');
    try {
        if (debug) {
            startDebug();
        }

        const hPacked = stringify(jsonObject);
        const bufferOriginal = Buffer.from(hPacked, 'utf-8');
        const gzipped = gzip(bufferOriginal);

        if (debug) {
            endDebug(jsonObject, gzipped);
        }

        return gzipped;
    } catch (error) {
        return errorDebug(error);
    }
}

/**
 * Decompresses a Buffer object into a JSON object using the Gzip decompression algorithm.
 * This is accomplished by first decompressing the Buffer object and then parsing it into
 * a JSON object. If the debug parameter is set to true, the function measures and logs the
 * performance and the size of the decompressed data.
 *
 * @function decompress
 * @param {Buffer} jsonBuffer - The Buffer object that needs to be decompressed.
 * @param {boolean} [debug=false] - Optional parameter that defaults to false. If set to true,
 * it will measure the performance and size of the decompressed data and log these details.
 * @returns {Object} The decompressed and parsed JSON object. If an error occurs during
 * decompression, the original Buffer object is returned.
 * @throws {Error} If the decompression process fails, an error is logged, but not thrown.
 */
function decompress(jsonBuffer, debug = false) {
    const [startDebug, endDebug, errorDebug] = debugWrapper('decompress');

    try {
        if (debug) {
            startDebug();
        }

        const bufferDecompressed = gunzip(jsonBuffer);
        const jsonUnpacked = parse(bufferDecompressed);

        if (debug) {
            endDebug(jsonUnpacked, jsonBuffer);
        }

        return jsonUnpacked;
    } catch (error) {
        return errorDebug(error);
    }
}

module.exports = {
    compress,
    decompress,
};
