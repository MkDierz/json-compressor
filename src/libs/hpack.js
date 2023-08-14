const { debugWrapper } = require('../utils/debug');

const ObjectKeys = Object.keys;
const { isArray } = Array;
const jsonStringify = JSON.stringify;
const jsonParse = JSON.parse;

const arr = [];
const { concat } = arr;
const { map } = arr;

function iteratingWith(method) {
    return function iterate(item) {
        let current = item;
        const path = this;
        const { length } = path;
        for (let i = 0; i < length; i += 1) {
            const k = path[i];
            const tmp = current[k];
            if (isArray(tmp)) {
                const j = i + 1;
                current[k] = j < length
                    ? map.call(tmp, method, path.slice(j))
                    : method(tmp);
            }
            current = current[k];
        }
        return item;
    };
}

function packOrUnpack(method) {
    return ((o, schema) => {
        const wasArray = isArray(o);
        let result = concat.call(arr, o);
        const path = concat.call(arr, schema);
        const { length } = path;
        for (let i = 0; i < length; i += 1) {
            result = map.call(result, method, path[i].split('.'));
        }
        return wasArray ? result : result[0];
    });
}

function hpack(obj, debug = false) {
    const [startDebug, endDebug, errorDebug] = debugWrapper('hpack');

    try {
        if (debug) {
            startDebug();
        }

        if (isArray(obj)) {
            const { length } = obj;
            const keys = ObjectKeys(length ? obj[0] : {});
            const klength = keys.length;
            const result = Array(length * klength);
            let j = 0;
            for (let i = 0; i < length; i += 1) {
                const o = obj[i];
                for (let ki = 0; ki < klength; ki += 1) {
                    let value = o[keys[ki]];
                    if ((typeof value === 'object' && value !== null) && (!(value instanceof Date))) {
                        value = isArray(value) ? value.map((x) => hpack(x)) : hpack(value);
                    }
                    result[j] = value;
                    j += 1;
                }
            }
            const returnValue = concat.call([klength], keys, result);
            if (debug) {
                endDebug(obj, returnValue);
            }
            return returnValue;
        } if (typeof obj === 'object' && obj !== null) {
            const keys = ObjectKeys(obj);
            const returnValue = keys.reduce((res, key) => {
                res[key] = isArray(obj[key]) ? hpack(obj[key]) : obj[key];
                return res;
            }, {});
            if (debug) {
                endDebug(obj, returnValue);
            }
            return returnValue;
        }

        if (debug) {
            endDebug(obj, obj);
        }
        return obj;
    } catch (error) {
        return errorDebug(error);
    }
}

function hunpack(packedObj, debug = false) {
    const [startDebug, endDebug, errorDebug] = debugWrapper('hunpack');

    try {
        if (debug) {
            startDebug();
        }

        if (isArray(packedObj)) {
            const { length } = packedObj;
            const klength = packedObj[0];
            const result = Array(((length - klength - 1) / klength) || 0);
            let j = 0;
            for (let i = 1 + klength; i < length;) {
                const o = {};
                for (let ki = 0; ki < klength; ki += 1) {
                    let value = packedObj[i];
                    if (isArray(value)) {
                        value = value.map((item) => (isArray(item) ? hunpack(item) : item));
                    } else if (typeof value === 'object' && value !== null) {
                        value = hunpack(value);
                    }
                    o[packedObj[ki + 1]] = value;
                    i += 1;
                }
                result[j] = o;
                j += 1;
            }
            if (debug) {
                endDebug(result, packedObj);
            }
            return result;
        } if (typeof packedObj === 'object' && packedObj !== null) {
            const result = ObjectKeys(packedObj).reduce((res, key) => {
                res[key] = isArray(packedObj[key]) ? hunpack(packedObj[key]) : packedObj[key];
                return res;
            }, {});
            if (debug) {
                endDebug(result, packedObj);
            }
            return result;
        }

        if (debug) {
            endDebug(packedObj, packedObj);
        }

        return packedObj;
    } catch (error) {
        return errorDebug(error);
    }
}

const packSchema = packOrUnpack(iteratingWith(hpack));
const unpackSchema = packOrUnpack(iteratingWith(hunpack));

/**
 * Packs a list of objects into a homogeneous array, according to a schema.
 *
 * @function pack
 * @param {Object[]} list - The list of objects to pack.
 * @param {string[]} [schema] - The schema to use for packing.
 * @param {boolean} [debug=false] - Optional parameter that defaults to false. If set to true,
 * it will measure the performance and size of the compressed data and log these details.
 * @returns {Array} - The packed array.
 */
function pack(list, schema, debug = false) {
    return schema ? packSchema(list, schema) : hpack(list, debug);
}

/**
 * Unpacks a homogeneous array into a list of objects, according to a schema.
 *
 * @function unpack
 * @param {Array} hlist - The homogeneous array to unpack.
 * @param {string[]} [schema] - The schema to use for unpacking.
 * @param {boolean} [debug=false] - Optional parameter that defaults to false. If set to true,
 * it will measure the performance and size of the compressed data and log these details.
 * @returns {Object[]} - The unpacked list of objects.
 */
function unpack(hlist, schema, debug = false) {
    return schema ? unpackSchema(hlist, schema) : hunpack(hlist, debug);
}

/**
 * Packs a list of objects into a homogeneous array and then stringifies it, according to a schema.
 *
 * @function stringify
 * @param {Object[]} list - The list of objects to stringify.
 * @param {Function} [replacer] - A function that alters the behavior of the
 * stringification process.
 * @param {string|number} [space] - A String or Number object that's used to
 *  insert white space into the output JSON string for readability purposes.
 * @param {string[]} [schema] - The schema to use for packing.
 * @returns {string} - The JSON string.
 */
function stringify(list, replacer, space, schema) {
    return jsonStringify(pack(list, schema), replacer, space);
}

/**
 * Parses a JSON string into a homogeneous array
 * and then unpacks it into a list of objects, according to a schema.
 *
 * @function parse
 * @param {string} hlist - The JSON string to parse.
 * @param {Function} [reviver] - A function that prescribes how the value originally
 * produced by parsing is transformed, before being returned.
 * @param {string[]} [schema] - The schema to use for unpacking.
 * @returns {Object[]} - The parsed list of objects.
 */
function parse(hlist, reviver, schema) {
    return unpack(jsonParse(hlist, reviver), schema);
}

module.exports = {
    pack,
    parse,
    stringify,
    unpack,
};
