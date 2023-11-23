import request from '@/utils/request'
import { IStaffData } from './types'

export const defaultStaffData: IStaffData = {
  id: 0,
  username: '',
  name: '',
  phone: '',
  email: '',
  avatar: '',
  sex: '',
  status: 0,
  createTime: '',
  updateTime: '',
  roles: []
}
export const getStaffs = (params: any) =>
  request({
    url: '/employee/page',
    method: 'get',
    params
  })

export const getStaff = (params: number) =>
  request({
    url: '/employee/' + params.toString(),
    method: 'get' 
  })  
