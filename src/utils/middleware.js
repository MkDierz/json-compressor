const { gunzip, gzip } = require('../libs/gzip');
const { unpack, pack } = require('../libs/hpack');
const { decompress, compress } = require('../libs/packZip');

async function jsonCompressorMiddleware(req, res, next) {
    const requestCompressed = 'compressed-request' in req.headers ? req.headers['compressed-request'] : 'none';
    const responseCompressed = 'compressed-response' in req.headers ? req.headers['compressed-response'] : 'none';
    res.set('Compressed-Request', requestCompressed || 'none');
    res.set('Compressed-Response', responseCompressed || 'none');
    switch (requestCompressed) {
        case 'full':
            req.body = decompress(req.body, true);
            break;

        case 'hpack':
            req.body = unpack(req.body, false, true);
            break;

        case 'gzip':
            req.body = JSON.parse(gunzip(req.body), true);
            break;

        default:
            break;
    }

    const originalSend = res.send;

    res.send = (args) => {
        let newArgs = args;
        if (newArgs instanceof Object) {
            switch (responseCompressed) {
                case 'full':
                    newArgs = compress(newArgs, true);
                    break;

                case 'hpack':
                    newArgs = pack(newArgs, false, true);
                    break;

                case 'gzip':
                    newArgs = gzip(JSON.stringify(newArgs), true);
                    break;

                default:
                    break;
            }
        }
        res.send = originalSend;
        return res.send(newArgs);
    };
    next();
}

module.exports = {
    jsonCompressorMiddleware,
};
