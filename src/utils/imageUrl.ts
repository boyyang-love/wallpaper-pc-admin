const imageUrl = (path: string): string => {

  return `${import.meta.env.VITE_IMAGE_PREFIX}${path}`
}

export {
  imageUrl,
}
