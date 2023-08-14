const { config } = require('dotenv');
const { calculateSize } = require('./utils/size');
const { gunzip, gzip } = require('./libs/gzip');
const { jsonCompressorMiddleware } = require('./utils/middleware');
const {
    unpack, pack, parse, stringify,
} = require('./libs/hpack');
const { compress, decompress } = require('./libs/packZip');

config();

module.exports.compress = compress;
module.exports.decompress = decompress;
module.exports.pack = pack;
module.exports.parse = parse;
module.exports.stringify = stringify;
module.exports.unpack = unpack;
module.exports.gzip = gzip;
module.exports.gunzip = gunzip;
module.exports.calculateSize = calculateSize;
module.exports.jsonCompressorMiddleware = jsonCompressorMiddleware;
