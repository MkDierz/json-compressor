/* eslint-disable no-underscore-dangle */
const httpMocks = require('node-mocks-http');
const { compress } = require('../../src/libs/packZip');
const { pack } = require('../../src/libs/hpack');
const { gzip } = require('../../src');
const { jsonCompressorMiddleware } = require('../../src/utils/middleware');

describe('compression middleware', () => {
    let mockData;
    let mockDataCompressed;
    let mockDataPacked;
    let mockDataZipped;
    let res;
    let next;
    let req;

    beforeEach(() => {
        mockData = [
            {
                id: 1,
                content: 'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi',
                createdAt: '3/12/2023',
                updatedAt: '10/23/2022',
            },
            {
                id: 2,
                content: 'Duis bibendum, felis sed sinterdum venenatis, turpis enim sblandit mis',
                createdAt: '3/12/2023',
                updatedAt: '10/23/2022',
            },
        ];
        mockDataCompressed = compress(mockData);
        mockDataPacked = pack(mockData);
        mockDataZipped = gzip(JSON.stringify(mockData));
        res = httpMocks.createResponse();
        next = jest.fn();
        req = httpMocks.createRequest({
            headers: {
                'compressed-request': 'none',
                'compressed-response': 'none',
            },
            body: mockData,
        });
    });

    test('no compression on request and response', () => {
        jsonCompressorMiddleware(req, res, next);
        res.send(mockData);
        const responseData = res._getData();

        expect(req.body).toEqual(mockData);
        expect(next).toHaveBeenCalled();
        expect(res.get('Compressed-Response')).toEqual('none');
        expect(res.get('Compressed-Request')).toEqual('none');

        expect(responseData).toBe(mockData);
    });

    test('full compress on response', () => {
        req._setHeadersVariable('compressed-response', 'full');
        jsonCompressorMiddleware(req, res, next);
        res.send(mockData);
        const responseData = res._getData();

        expect(req.body).toEqual(mockData);
        expect(res.get('Compressed-Request')).toEqual('none');
        expect(res.get('Compressed-Response')).toEqual('full');
        expect(next).toHaveBeenCalled();

        expect(responseData).toStrictEqual(mockDataCompressed);
    });

    test('hpack compress on response', () => {
        req._setHeadersVariable('compressed-response', 'hpack');
        jsonCompressorMiddleware(req, res, next);
        res.send(mockData);
        const responseData = res._getData().toString();

        expect(req.body).toEqual(mockData);
        expect(res.get('Compressed-Request')).toEqual('none');
        expect(res.get('Compressed-Response')).toEqual('hpack');
        expect(next).toHaveBeenCalled();

        expect(responseData).toBe(mockDataPacked.toString());
    });

    test('gzip compress on response', () => {
        req._setHeadersVariable('compressed-response', 'gzip');
        jsonCompressorMiddleware(req, res, next);
        res.send(mockData);
        const responseData = res._getData();

        expect(req.body).toEqual(mockData);
        expect(res.get('Compressed-Request')).toEqual('none');
        expect(res.get('Compressed-Response')).toEqual('gzip');
        expect(next).toHaveBeenCalled();

        expect(responseData).toStrictEqual(mockDataZipped);
    });

    test('full compression on request', () => {
        req._setHeadersVariable('compressed-request', 'full');
        req._setBody(mockDataCompressed);
        jsonCompressorMiddleware(req, res, next);
        res.send(mockData);
        const responseData = res._getData();

        expect(req.body).toEqual(mockData);
        expect(next).toHaveBeenCalled();
        expect(res.get('Compressed-Response')).toEqual('none');
        expect(res.get('Compressed-Request')).toEqual('full');

        expect(responseData).toBe(mockData);
    });

    test('hpack compression on request', () => {
        req._setHeadersVariable('compressed-request', 'hpack');
        req._setBody(mockDataPacked);
        jsonCompressorMiddleware(req, res, next);
        res.send(mockData);
        const responseData = res._getData();

        expect(req.body).toEqual(mockData);
        expect(next).toHaveBeenCalled();
        expect(res.get('Compressed-Response')).toEqual('none');
        expect(res.get('Compressed-Request')).toEqual('hpack');

        expect(responseData).toBe(mockData);
    });

    test('gzip compression on request', () => {
        req._setHeadersVariable('compressed-request', 'gzip');
        req._setBody(mockDataZipped);
        jsonCompressorMiddleware(req, res, next);
        res.send(mockData);
        const responseData = res._getData();

        expect(req.body).toEqual(mockData);
        expect(next).toHaveBeenCalled();
        expect(res.get('Compressed-Response')).toEqual('none');
        expect(res.get('Compressed-Request')).toEqual('gzip');

        expect(responseData).toBe(mockData);
    });
});
