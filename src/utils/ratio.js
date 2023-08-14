function compressionRatio(originalSize, compressedSize) {
    const difference = originalSize - compressedSize;
    const ratio = (difference / originalSize) * 100;
    const rounded = Math.abs(ratio.toFixed(2));
    return [difference, rounded];
}
module.exports = { compressionRatio };
