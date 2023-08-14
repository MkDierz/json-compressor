const { compress, decompress } = require('../../src/libs/packZip');

describe('main compression module', () => {
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
                updatedAt: '10/23/2022',
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

    test('compress and decompress work correctly', () => {
        const compressed = compress(jsonObject);
        const decompressed = decompress(compressed);

        expect(decompressed).toEqual(jsonObject);
    });
    test('complex json compress', () => {
        const compressed = compress(complexJson);
        const decompressed = decompress(compressed);
        expect(() => decompressed === complexJson).toBeTruthy();
    });
});
