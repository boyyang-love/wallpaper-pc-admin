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
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
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
    }>

    type ImageInfoList = Common.PaginatingQueryRecord<ImageInfo>

    type ImageInfoUpdateParams = Pick<ImageInfo, 'file_name' | 'type' | 'status'> & { id: string }

    type ImageUploadParams = {
      file: File,
      file_name: string
      root_dir: string
      dir: string
      type: string
      bucket_name: string
      quality: number
      status: number
    }

    type ImageUploadInfo = {
      file_name: string
      path: string
      origin_path: string
    }
  }
}
