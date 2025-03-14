import {request} from '../request'

export function fetchRecommendCreate(data: Api.Recommend.RecommendCareateParams) {
  return request({
    url: '/recommend/create',
    method: 'post',
    data,
  })
}

export function fetchRecommendList(params: Api.Recommend.RecommendListSearchParams) {
  return request<Api.Recommend.RecommendInfoList>({
    url: '/recommend/info',
    method: 'get',
    params,
  })
}

export function fetchRecommendUpdate(data: Api.Recommend.RecommendUpdateParams) {
  return request({
    url: '/recommend/update',
    method: 'post',
    data,
  })
}

export function fetchRecommendRemove(data: Api.Recommend.RecommendRemoveParms) {
  return request({
    url: '/recommend/remove',
    method: 'post',
    data,
  })
}

export function fetchRecommendSort(data: Api.Recommend.RecommendSortParams) {
  return request({
    url: '/recommend/sort',
    method: 'post',
    data,
  })
}
