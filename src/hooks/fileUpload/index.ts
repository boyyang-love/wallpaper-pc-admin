import {type UploadFileInfo, type UploadInst} from 'naive-ui'
import {ref, shallowReactive} from 'vue'
import {fetchImageUpload} from '@/service/api'


export declare namespace IUpload {
  interface UploadParams extends Api.Image.ImageUploadParams {
  }
}

export const useUpload = (cb?: () => void) => {

  const uploadRef = ref<UploadInst | null>(null)
  const fileInfo = shallowReactive<{
    fileList: (UploadFileInfo & { base64: string })[],
  }>({
    fileList: [],
  })

  const onChange = (options: { file: UploadFileInfo, fileList: Array<UploadFileInfo>, event?: Event }) => {
    Promise.all(options.fileList.map(async (item) => {
      const base64 = await fileToBase64(item?.file)
      return {
        base64: base64 as string,
        ...item,
      }
    })).then((res) => {
      fileInfo.fileList = res
      cb && cb()
    })
  }

  const fileToBase64 = (file?: File | null) => {

    return new Promise((resolve) => {
      if (!file) {
        resolve('')
        return
      }
      let base64 = ''
      const blob = new Blob([file], {type: file.type})
      const render = new FileReader()
      render.readAsDataURL(blob)
      render.onload = () => {
        base64 = render.result as string
        resolve(base64)
      }
    })
  }

  const upload = async (uploadParams: IUpload.UploadParams[]) => {
    return await Promise.all(uploadParams.map(async (item) => {
      const {data, error} = await fetchImageUpload(item)

      return {
        data,
        error,
      }
    }))
  }

  const reset = () => {
    fileInfo.fileList = []
  }

  return {
    uploadRef,
    fileInfo,
    onChange,
    upload,
    reset,
  }
}
