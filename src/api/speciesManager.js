import request from '@/utils/request'

const speciesApi = {
  getAllSpecies: "marineSpecies/getAllByName",
  getAllByTaxonomy: "marineSpecies/getAllByTaxonomy",
  getTaxonomy: "marineSpecies/getTaxonomy",
  newSpecies: "marineSpecies/new",
  editInfoViaDTO: "marineSpecies/editInfoViaDTO",
  editBasicInfo: "marineSpecies/editBasicInfo",
  editImage: "marineSpecies/editImage",
  editTaxonomy: "marineSpecies/editTaxonomy",
  getContributors: "marineSpecies/getContributors",
}


/**
 * 分页获取物种信息，以物种归属类目为查找对象
 */
export function getAllByTaxonomy(pageNo, pageSize, param) {
  return request({
    url: speciesApi.getAllByTaxonomy +
      '?' + 'pageNo=' + pageNo +
      '&' + 'pageSize=' + pageSize,
    method: 'post',
    data: param,
    headers: { 'Content-Type': 'application/json' },
  })
}


/**
 * 分页获取物种信息，以物种名称为查找对象
 */
export function getAllSpecies(pageNo, pageSize, keyword) {
  return request({
    url: speciesApi.getAllSpecies +
      '?' + 'pageNo=' + pageNo +
      '&' + 'pageSize=' + pageSize +
      '&' + 'keyword=' + keyword,
    method: 'get'
  })
}


/**
 * 以字符串列表的格式获取所有分类信息
 */
export function getTaxonomy() {
  return request({
    url: speciesApi.getTaxonomy,
    method: 'get',
  })
}


/**
 * 分页获取贡献者
 */
export function getContributors(speciesId) {
  return request({
    url: speciesApi.getContributors +
      '?' + 'speciesId=' + speciesId,
    method: 'get'
  })
}


/**
 * 新增物种信息
 */
export function newSpecies(param) {
  return request({
    url: speciesApi.newSpecies,
    method: 'post',
    data: param,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * 传入一整个DTO修改物种信息
 */
export function editInfoViaDTO(param) {
  return request({
    url: speciesApi.editInfoViaDTO,
    method: 'post',
    data: param,
    headers: { 'Content-Type': 'application/json' },
  })
}


/**
 * 更改物种基本信息
 */
export function editBasicInfo(param) {
  return request({
    url: speciesApi.editBasicInfo,
    method: 'post',
    data: param,
    headers: { 'Content-Type': 'application/json' },
  })
}


/**
 * 更改物种图片
 */
export function editImage(param) {
  return request({
    url: speciesApi.editImage,
    method: 'post',
    data: param,
    headers: { 'Content-Type': 'application/json' },
  })
}


/**
 * 更改物种归属类目
 */
export function editTaxonomy(param) {
  return request({
    url: speciesApi.editTaxonomy,
    method: 'post',
    data: param,
    headers: { 'Content-Type': 'application/json' },
  })
}
