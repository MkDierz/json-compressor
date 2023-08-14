const { gzip, gunzip } = require('../../src');

describe('gzip', () => {
    let jsonObject;
    let jsonString;

    beforeEach(() => {
        jsonObject = [
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
        jsonString = JSON.stringify(jsonObject);
    });
    test('gzip and gunzip work correctly', () => {
        const bufferOriginal = Buffer.from(jsonString);
        const gzipped = gzip(bufferOriginal);
        const gunzipped = gunzip(gzipped);

        expect(gunzipped.toString()).toEqual(bufferOriginal.toString());
    });
});
