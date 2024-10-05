import React from "react";
import { Box, BoxProps } from "@mui/material";

interface Base64ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  base64: string;
  boxProps?: BoxProps; // Props to pass to the Box component
}

export const getImageType = (base64: string): string => {
  const binaryString = atob(base64);
  const firstByte = binaryString.charCodeAt(0);
  const secondByte = binaryString.charCodeAt(1);
  const thirdByte = binaryString.charCodeAt(2);

  // JPEG (0xFF, 0xD8, 0xFF)
  if (firstByte === 0xff && secondByte === 0xd8 && thirdByte === 0xff) {
    return "image/jpeg";
  }

  // PNG (0x89, 0x50, 0x4E, 0x47)
  if (firstByte === 0x89 && secondByte === 0x50 && thirdByte === 0x4e) {
    return "image/png";
  }

  // GIF (0x47, 0x49, 0x46)
  if (firstByte === 0x47 && secondByte === 0x49 && thirdByte === 0x46) {
    return "image/gif";
  }

  // BMP (0x42, 0x4D)
  if (firstByte === 0x42 && secondByte === 0x4d) {
    return "image/bmp";
  }

  // TIFF (0x49, 0x20 or 0x4D, 0x20)
  if (
    (firstByte === 0x49 && secondByte === 0x20) ||
    (firstByte === 0x4d && secondByte === 0x20)
  ) {
    return "image/tiff";
  }

  // If unknown, throw an error
  throw new Error("Unknown image type.");
};

const Base64Image: React.FC<Base64ImageProps> = ({
  base64,
  boxProps,
  ...imgProps
}) => {
  // Get the image type
  const imageType = getImageType(base64);

  // Create the complete base64 image string
  const imageSrc = `${imageType};base64,${base64.split(",")[1]}`;

  return (
    <Box {...boxProps}>
      <img src={imageSrc} alt="Base64 content" {...imgProps} />
    </Box>
  );
};

export default Base64Image;
