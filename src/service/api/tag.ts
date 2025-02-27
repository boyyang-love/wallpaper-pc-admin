import {request} from '../request'

export function fetchTagInfoList(params: Api.Tag.TagListSearchParams) {
  return request<Api.Tag.TagInfoList>({
    url: '/tag/info',
    method: 'get',
    params,
  })
}

export function fetchTagCreate(data: Api.Tag.TagCareateParams) {
  return request({
    url: '/tag/create',
    method: 'post',
    data,
  })
}

export function fetchTagUpdate(data: Api.Tag.TagUpdateParams) {
  return request({
    url: '/tag/update',
    method: 'post',
    data,
  })
}

export function fetchTagRemove(data: Api.Tag.TagRemoveParms) {
  return request({
    url: '/tag/remove',
    method: 'post',
    data,
  })
}
