import request from "../utils/request";
import store from "../store";
import { adminLogin } from "@/api/login";
import type { UserInfo } from "@/store/types";

/**
 * `blob`或者`file`转读取路径
 * @param target 目标对象 
 */
function blobOrFileToUrl(target: File | Blob) {
  let url = "";
  if (window.URL) {
    url = window.URL.createObjectURL(target);
  } else if (window.webkitURL) {
    url = window.webkitURL.createObjectURL(target);
  }
  return url;
}

/**
 * 上传文件
 * @param formData 图片`FormData`
 */
export function uploadFile(formData: FormData) {
  // 模拟上传
  const file = formData.get("file") as File;
  return new Promise<Api.Result<{ url: string }>>(function (resolve) {
    setTimeout(function () {
      resolve({
        code: 1,
        data: {
          url: blobOrFileToUrl(file)
        },
        msg: "上传成功"
      })
    }, 500);
  });
  // return request("POST", "/uploadFile", formData, {
  //   onProgress
  // });
}

/**
 * 获取天气预报数据
 * @param city 城市名
 */
export function getWeather(city: string) {
  return request("GET", "/free/day", {
    appid: "56761788",
    appsecret: "ti3hP8y9",
    city: encodeURIComponent(city)
  },
  {
    headers: {
      // TODO: 天气预报的接口不可以携带 请求头 authorization 字段，所以这里清空
      authorization: ""
    }
  })
}


/**
 * 登录
 * @param params 登录信息
 */
interface LoginParams {
  username: string
  password: string
  code_id: string
  answer: string
}


export async function login(params: LoginParams): Promise<Api.Result> {
  try {
    const res = await adminLogin(params)

    if (res.token) {
      const info: UserInfo = {
        id: '', 
        name: '', 
        type: '', 
        token: res.token,
        avatar: '', 
        account: params.username,
        password: params.password
      }

      store.user.update(info)

      return {
        code: 1,
        msg: res.message || '登录成功',
        data: info
      }
    } else {
      return {
        code: -1,
        msg: res.message || '登录失败',
        data: null
      }
    }
  } catch (error: any) {
    return {
      code: -1,
      msg: error?.message || '请求失败',
      data: null
    }
  }
}

