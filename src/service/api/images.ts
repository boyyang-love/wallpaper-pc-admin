import {request} from '../request'

export function fetchImageInfoList(params: Api.Image.ImageListSearchParams) {
  return request<Api.Image.ImageInfoList>({
    url: '/image/info',
    params,
  })
}

export function fetchImageInfoUpdate(data: Api.Image.ImageInfoUpdateParams) {
  return request({
    url: '/image/update',
    method: 'post',
    data,
  })
}

export function fetchImageUpload(data: Api.Image.ImageUploadParams) {
  const formData = new FormData()
  formData.append('file_name', data.file_name)
  formData.append('root_dir', data.root_dir)
  formData.append('dir', data.dir)
  formData.append('bucket_name', data.bucket_name)
  formData.append('quality', String(data.quality))
  formData.append('file', data.file)
  formData.append('status', String(data.status))
  formData.append('type', data.type)
  formData.append(`tags`, data.tags.join(','))

  return request<Api.Image.ImageUploadInfo>({
    url: '/image/upload',
    method: 'post',
    data: formData,
  })
}

export function fetchImageDel(data: { id: string, paths: string[], bucket_name: string }) {

  return request({
    url: '/image/delete',
    method: 'post',
    data: data,
  })
}

