export function getImageUrl(image: string) {
  if (!image) {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${import.meta.env.BASE_URL}images/${image}`;
}
