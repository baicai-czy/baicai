// ── 表单验证规则集（Element Plus FormRules 格式） ──

// ── 正则常量 ──

/** 中国大陆手机号：1 开头，第二位 3-9，共 11 位 */
export const PHONE_REGEX = /^1[3-9]\d{9}$/

/** 通用邮箱格式 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** URL 格式（http/https 协议） */
export const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i

/** 纯中文姓名（2-20 个汉字） */
export const CHINESE_NAME_REGEX = /^[一-龥]{2,20}$/

/** 身份证号（18 位，含末位 X） */
export const ID_CARD_REGEX = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/

/** 验证码（6 位数字） */
export const CAPTCHA_REGEX = /^\d{6}$/

// ── 单规则工厂 ──

/** 创建必填规则 */
export function requiredRule(label: string, trigger: string | string[] = 'blur') {
  return {
    required: true,
    message: `${label}不能为空`,
    trigger,
  }
}

/** 创建最小长度规则 */
export function minLengthRule(
  min: number,
  label: string,
  trigger: string | string[] = 'blur',
) {
  return {
    min,
    message: `${label}长度不能少于${min}个字符`,
    trigger,
  }
}

/** 创建最大长度规则 */
export function maxLengthRule(
  max: number,
  label: string,
  trigger: string | string[] = 'blur',
) {
  return {
    max,
    message: `${label}长度不能超过${max}个字符`,
    trigger,
  }
}

/** 创建正则匹配规则 */
export function patternRule(
  pattern: RegExp,
  message: string,
  trigger: string | string[] = 'blur',
) {
  return {
    pattern,
    message,
    trigger,
  }
}

// ── 常用字段规则 ──

/** 手机号校验规则 */
export function phoneRules(label = '手机号') {
  return [
    requiredRule(label, 'blur'),
    patternRule(PHONE_REGEX, `请输入正确的${label}`, 'blur'),
  ]
}

/** 邮箱校验规则 */
export function emailRules(label = '邮箱') {
  return [
    requiredRule(label, 'blur'),
    patternRule(EMAIL_REGEX, `请输入正确的${label}地址`, 'blur'),
  ]
}

/** 验证码校验规则 */
export function captchaRules(label = '验证码') {
  return [
    requiredRule(label, 'blur'),
    patternRule(CAPTCHA_REGEX, `请输入6位${label}`, 'blur'),
  ]
}

/** URL 校验规则 */
export function urlRules(label = '链接地址') {
  return [
    { required: false, trigger: 'blur' },
    patternRule(URL_REGEX, `请输入正确的${label}`, 'blur'),
  ]
}

// ── 组合表单校验规则 ──

import type { FormRules } from 'element-plus'

/**
 * 联系表单校验规则
 * 对应 ContactFormData 字段
 */
export const contactFormRules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  company: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  phone: phoneRules('手机号'),
  email: emailRules('邮箱'),
  description: [
    { required: true, message: '请输入描述信息', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度在 10 到 500 个字符', trigger: 'blur' },
  ],
  captchaCode: captchaRules('验证码'),
}

/**
 * 服务申请表单校验规则
 * 对应 ServiceFormData 字段
 */
export const serviceFormRules: FormRules = {
  companyName: [
    { required: true, message: '请输入公司名称', trigger: 'blur' },
  ],
  contactName: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  phone: phoneRules('手机号'),
  email: emailRules('邮箱'),
  serviceType: [
    { required: true, message: '请选择服务类型', trigger: 'change' },
  ],
  description: [
    { required: true, message: '请输入需求描述', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度在 10 到 500 个字符', trigger: 'blur' },
  ],
  captchaCode: captchaRules('验证码'),
}
