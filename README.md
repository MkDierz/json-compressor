# json-compressor

A module for compressing and decompressing JSON data using Gzip compression algorithm and HPack compression algorithm.

## Installation

Use the package manager [npm](http://npmjs.org/) to install json-pack-gzip.

```bash
npm install @mkdierz/json-compressor
```
## Usage

```javascript
const jsonPackGzip = require('json-compressor');

// Compress JSON data
const compressedData = jsonPackGzip.compress(jsonObject);

// Decompress JSON data
const decompressedData = jsonPackGzip.decompress(jsonBuffer);

// Calculate byte length of data
const byteLength = jsonPackGzip.calculateSize(data);
```

## API

### ```compress(jsonObject, debug = false)```

Compresses a JSON object using Gzip compression algorithm. The input JSON object is first packed into a homogeneous array and then stringified before compression.

- ```jsonObject```(Array): The JSON object to be compressed.
- ```debug```(Boolean): options for debugging, defaults to false.

Returns a compressed data as a Buffer object.

### ```decompress(jsonBuffer, debug = false)```
Decompresses a Buffer object to a JSON object using Gzip decompression algorithm. The decompressed data is first parsed from a homogeneous array into a list of objects.

- ```jsonBuffer``` (Buffer): The Buffer object to be decompressed.
- ```debug```(Boolean): options for debugging, defaults to false.

Returns a decompressed and unpacked JSON object as a list of objects.

### ```calculateSize(data)```
Calculates the byte length of the input data. It supports data types: String, Buffer, Array, and Object. For non-buffer objects, the function first stringifies them before calculating the size.

- ```data``` (String|Buffer|Object|Array): The data to be size-calculated.

Returns the byte length of the input data.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

This module is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License