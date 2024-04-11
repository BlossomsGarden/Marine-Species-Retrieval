import request from '@/utils/request'

const utilityApi = {
    UploadImage:'/uploadImage'
}


/**
 * @func 上传单张图片 
 * @param formData{image:'文件流'}
 * @return 公网访问链接
 */
export function uploadImage (formData) {
    return request({
        url: utilityApi.UploadImage,
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData
    })
}
