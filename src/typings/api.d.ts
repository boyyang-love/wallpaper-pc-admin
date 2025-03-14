/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      page: number;
      /** page size */
      limit: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'page' | 'limit'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: string;
      /** record create */
      created: string;
      /** record update */
      updated: string;
    } & T;

  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      token: string;
      user_info: UserInfo
    }

    interface UserInfo {
      address: string;
      avatar: string;
      cover: string;
      email: string;
      gitHub: string;
      id: string;
      motto: string;
      qq: string;
      role: string;
      tel: string;
      username: string;
      wechat: string;
    }
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }

  namespace Image {

    type ImageListSearchParams = CommonType.RecordNullable<Pick<ImageInfo, 'file_name' | 'type' | 'status'> & Common.CommonSearchParams>

    type ImageInfo = Common.CommonRecord<{
      hash: string;
      file_name: string;
      origin_file_size: number;
      file_size: number;
      origin_type: string;
      file_type: string;
      origin_file_path: string;
      file_path: string;
      type: string;
      w: number;
      h: number;
      status: number;
      user_id: string;
      tags: Tag.TagInfo[];
      category: Category.CategoryInfo[];
      recommend: Recommend.RecommendInfo[];
    }>

    type ImageInfoList = Common.PaginatingQueryRecord<ImageInfo>

    type ImageInfoUpdateParams = Pick<ImageInfo, 'file_name' | 'type' | 'status'> & {
      id: string,
      tags: string[],
      category: string[],
      recommend: string[]
    }

    type ImageUploadParams = {
      file: File,
      file_name: string
      root_dir: string
      dir: string
      type: string
      bucket_name: string
      quality: number
      status: number
      tags: string[],
      category: string[],
      recommend: string[],
    }

    type ImageUploadInfo = {
      file_name: string
      path: string
      origin_path: string
    }
  }

  namespace Tag {
    type TagListSearchParams = CommonType.RecordNullable<Pick<TagInfo, 'name' | 'type'> & Common.CommonSearchParams>

    type TagInfoList = Common.PaginatingQueryRecord<TagInfo>

    type TagCareateParams = Pick<TagInfo, 'name' | 'type' | 'sort'>

    type TagUpdateParams = Pick<TagInfo, 'id' | 'name' | 'type' | 'sort'>

    type TagRemoveParms = Pick<TagInfo, 'id'>

    type TagSortParams = { sort_data: Array<Pick<TagInfo, 'id' | 'sort'>> }

    type TagInfo = Common.CommonRecord<{
      name: string,
      type: string,
      sort: number
      user_id: string
    }>
  }

  namespace Category {
    type CategoryListSearchParams = CommonType.RecordNullable<Pick<CategoryInfo, 'name'> & Common.CommonSearchParams>

    type CategoryCareateParams = Pick<CategoryInfo, 'name' | 'sort'>

    type CategoryUpdateParams = Pick<CategoryInfo, 'id' | 'name' | 'sort'>

    type CategoryRemoveParms = Pick<CategoryInfo, 'id'>

    type CategorySortParams = { sort_data: Array<Pick<CategoryInfo, 'id' | 'sort'>> }

    type CategoryInfoList = Common.PaginatingQueryRecord<CategoryInfo>

    type CategoryInfo = Common.CommonRecord<{
      name: string,
      sort: number
    }>
  }

  namespace Recommend {
    type RecommendListSearchParams = CommonType.RecordNullable<Pick<RecommendInfo, 'name'> & Common.CommonSearchParams>

    type RecommendCareateParams = Pick<RecommendInfo, 'name' | 'sort'>

    type RecommendUpdateParams = Pick<RecommendInfo, 'id' | 'name' | 'sort'>

    type RecommendRemoveParms = Pick<RecommendInfo, 'id'>

    type RecommendSortParams = { sort_data: Array<Pick<RecommendInfo, 'id' | 'sort'>> }


    type RecommendInfoList = Common.PaginatingQueryRecord<RecommendInfo>

    type RecommendInfo = Common.CommonRecord<{
      name: string,
      sort: number
    }>
  }

}
