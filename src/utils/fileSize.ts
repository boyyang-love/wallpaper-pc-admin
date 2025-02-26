
const fileSize = (size: number): string => {
  const kb = size / 1024
  if (kb < 1024){
    return  `${kb.toFixed(2)}KB`
  }
  return `${(kb/1024).toFixed(2)}M`
}

export {
  fileSize
}
