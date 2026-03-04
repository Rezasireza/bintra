// src/utils/imageUtils.ts
export const processAndCropImage = async (
    file: File,
    targetRatioStr: string // e.g., '16:9', '4:5', '1:1'
): Promise<File> => {
    return new Promise((resolve, reject) => {
        // Validate ratio
        let targetRatio = 1;
        const parts = targetRatioStr.split(':');
        if (parts.length === 2) {
            targetRatio = parseInt(parts[0], 10) / parseInt(parts[1], 10);
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas context not available'));

                const srcWidth = img.width;
                const srcHeight = img.height;
                const srcRatio = srcWidth / srcHeight;

                let cropWidth = srcWidth;
                let cropHeight = srcHeight;

                // Auto center-crop based on ratio
                if (srcRatio > targetRatio) {
                    // Image is wider than target ratio
                    cropWidth = srcHeight * targetRatio;
                } else {
                    // Image is taller than target ratio
                    cropHeight = srcWidth / targetRatio;
                }

                const cropX = (srcWidth - cropWidth) / 2;
                const cropY = (srcHeight - cropHeight) / 2;

                // Set optimal canvas size to avoid huge outputs (max 1920 on longest edge)
                let outputWidth = cropWidth;
                let outputHeight = cropHeight;
                const MAX_SIZE = 1920;

                if (cropWidth > MAX_SIZE || cropHeight > MAX_SIZE) {
                    if (cropWidth > cropHeight) {
                        outputWidth = MAX_SIZE;
                        outputHeight = MAX_SIZE / targetRatio;
                    } else {
                        outputHeight = MAX_SIZE;
                        outputWidth = MAX_SIZE * targetRatio;
                    }
                }

                canvas.width = outputWidth;
                canvas.height = outputHeight;

                // Draw cropped area
                ctx.drawImage(
                    img,
                    cropX, cropY, cropWidth, cropHeight, // Source
                    0, 0, outputWidth, outputHeight      // Destination
                );

                // Export as WebP
                canvas.toBlob(
                    (blob) => {
                        if (!blob) return reject(new Error('Canvas to Blob failed'));
                        const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + '.webp', {
                            type: 'image/webp',
                            lastModified: Date.now(),
                        });
                        resolve(newFile);
                    },
                    'image/webp',
                    0.85 // quality
                );
            };
            img.onerror = () => reject(new Error('Image load failed'));
            // Only set src if result exists
            if (e.target?.result) {
                img.src = e.target.result as string;
            }
        };
        reader.onerror = () => reject(new Error('File read failed'));
        reader.readAsDataURL(file);
    });
};
