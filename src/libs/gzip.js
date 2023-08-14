const { gzipSync, gunzipSync } = require('zlib');
const { Buffer } = require('buffer');
const { debugWrapper } = require('../utils/debug');

/**
 * Compresses a JSON object using Gzip compression algorithm.
 *
 * @param {string} string - The JSON object to be compressed.
 * @param {boolean} [debug=false] - Optional parameter that defaults to false. If set to true,
 * it will measure the performance and size of the compressed data and log these details.
 * @returns {Buffer} - The compressed data as a Buffer object.
 */
function gzip(string, debug = false) {
    const [startDebug, endDebug, errorDebug] = debugWrapper('gzip');
    try {
        if (debug) {
            startDebug();
        }
        const bufferOriginal = Buffer.from(string.toString(), 'utf-8');
        const gzipped = gzipSync(bufferOriginal);
        if (debug) {
            endDebug(string, gzipped);
        }
        return gzipped;
    } catch (error) {
        return errorDebug(error);
    }
}

/**
   * Decompresses a Buffer object to a JSON object using Gzip decompression algorithm.
   *
   * @param {Buffer} buffer - The Buffer object to be decompressed.
   * @param {boolean} [debug=false] - Optional parameter that defaults to false. If set to true,
   * it will measure the performance and size of the compressed data and log these details.
   * @returns {string} - The decompressed JSON object as a string.
   */
function gunzip(buffer, debug = false) {
    const [startDebug, endDebug, errorDebug] = debugWrapper('gunzip');
    try {
        if (debug) {
            startDebug();
        }
        const bufferDecompressed = gunzipSync(buffer);
        const gunzipped = bufferDecompressed.toString('utf-8');
        if (debug) {
            endDebug(gunzipped, buffer);
        }
        return gunzipped;
    } catch (error) {
        return errorDebug(error);
    }
}

module.exports = {
    gzip,
    gunzip,
};
