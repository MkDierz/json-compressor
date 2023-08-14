const {
    pack, stringify, unpack, parse,
} = require('../../src/libs/hpack');

describe('hpack', () => {
    let jsonObject;
    let complexJson;

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
                updatedAt: Date(),
            },
            {
                id: 2,
                content: null,
                createdAt: '3/12/2023',
                updatedAt: Date(),
            },
        ];
        complexJson = {
            products: [
                {
                    id: 11,
                    title: 'perfume Oil',
                    price: 13,
                },
                {
                    id: 12,
                    title: 'Brown Perfume',
                    price: 40,
                },
                {
                    id: 13,
                    title: 'Fog Scent Xpressio Perfume',
                    price: 13,
                },
                {
                    id: 14,
                    title: 'Non-Alcoholic Concentrated Perfume Oil',
                    price: 120,
                },
                {
                    id: 15,
                    title: 'Eau De Perfume Spray',
                    price: 30,
                },
                {
                    id: 16,
                    title: 'Hyaluronic Acid Serum',
                    price: 19,
                },
                {
                    id: 17,
                    title: 'Tree Oil 30ml',
                    price: 12,
                },
                {
                    id: 18,
                    title: 'Oil Free Moisturizer 100ml',
                    price: 40,
                },
                {
                    id: 19,
                    title: 'Skin Beauty Serum.',
                    price: 46,
                },
                {
                    id: 20,
                    title: 'Freckle Treatment Cream- 15gm',
                    price: 70,
                },
            ],
            total: 100,
            skip: 10,
            limit: 10,
        };
    });
    test('pack and unpack work correctly', () => {
        const packed = pack(jsonObject);
        const unpacked = unpack(packed);

        expect(unpacked).toEqual(jsonObject);
    });
    test('parse and stringify work correctly', () => {
        const stringified = stringify(jsonObject);
        const parsed = parse(stringified);

        expect(parsed).toEqual(jsonObject);
    });
    test('pack and unpack work correctly on complex json', () => {
        const packed = pack(complexJson);
        const unpacked = unpack(packed);

        expect(unpacked).toEqual(complexJson);
    });
    test('parse and stringify work correctly  on complex json', () => {
        const stringified = stringify(complexJson);
        const parsed = parse(stringified);

        expect(parsed).toEqual(complexJson);
    });
    test('pack and unpack work correctly on complex json with debug', () => {
        const packed = pack(complexJson, null, true);
        const unpacked = unpack(packed, null, true);

        expect(unpacked).toEqual(complexJson);
    });
});
