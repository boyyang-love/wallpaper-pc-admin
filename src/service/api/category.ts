import {request} from '../request'

export function fetchCategoryCreate(data: Api.Category.CategoryCareateParams) {
  return request({
    url: '/category/create',
    method: 'post',
    data,
  })
}

export function fetchCategoryList(params: Api.Category.CategoryListSearchParams) {
  return request<Api.Category.CategoryInfoList>({
    url: '/category/info',
    method: 'get',
    params,
  })
}

export function fetchCategoryUpdate(data: Api.Category.CategoryUpdateParams) {
  return request({
    url: '/category/update',
    method: 'post',
    data,
  })
}

export function fetchCategoryRemove(data: Api.Category.CategoryRemoveParms) {
  return request({
    url: '/category/remove',
    method: 'post',
    data,
  })
}

export function fetchCategorySort(data: Api.Category.CategorySortParams) {
  return request({
    url: '/category/sort',
    method: 'post',
    data,
  })
}
