import { defineStore } from "pinia";
import { ref } from "vue";
import { getBannerListApi,uploadBannerApi, updateBannerApi,deleteBannerApi  } from "@/api/home/banner";
import { ElMessage } from 'element-plus'   

// Banner 类型定义
export interface Banner {
  id: number;
  name: string;
  image: string;
  status: boolean;
}

//上传用的类型定义
export interface BannerUploadPayload {
  name: string
  image: File
  status: boolean
}

export const useBannerStore = defineStore("banner", () => {
  const banners = ref<Banner[]>([]);

  const getBannerList = async () => {
    const res = await getBannerListApi();
    if (res) {
      console.log(res)
      banners.value = res.bannerList || [];
    }
  };


  // 添加 Banner
const addBanner = async (banner: BannerUploadPayload) => {
  try {
    const formData = new FormData();
    formData.append('name', banner.name);
    formData.append('status', String(banner.status)); // 注意布尔值转字符串
    formData.append('image', banner.image); // 这是 File 类型

    const res = await uploadBannerApi(formData);

    await getBannerList();
  } catch (err) {
    console.error('添加轮播图失败', err);
  }
};


  
  

const deleteBanner = async (id: number) => {
  try {
    await deleteBannerApi(id)

    await getBannerList() // 重新拉取 banner 列表
  } catch (error) {
    console.error('删除失败:', error)
  }
}

  // 更新 Banner

const updateBanner = async (id: number, data: { name: string; image?: File; status: boolean }) => {
  try {
    const formData = new FormData();
    formData.append('id', String(id));
    formData.append('name', data.name);
    formData.append('status', String(data.status));
    if (data.image) {
      formData.append('image', data.image);
    }

    await updateBannerApi(formData);
    await getBannerList(); // 更新本地列表
  } catch (error) {
    console.error('更新 Banner 失败:', error);
    throw error;
  }
};

  

  // 切换状态
  const toggleStatus = (id: number) => {
    const banner = banners.value.find((item) => item.id === id);
    if (banner) {
      banner.status = !banner.status;
    }
  };

  return {
    banners,
    getBannerList,
    addBanner,
    deleteBanner,
    updateBanner,
    toggleStatus,
  };
});
