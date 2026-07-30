-- ============================================
-- 城际云门户网站 — 数据库初始化
-- 容器首次启动时自动执行
-- ============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ──────────────────────────────────────
-- 1. 站点全局配置
-- ──────────────────────────────────────
CREATE TABLE site_config (
  id              INT PRIMARY KEY DEFAULT 1,
  site_name       VARCHAR(100)   DEFAULT '城际云（江苏）科技有限公司',
  logo            VARCHAR(255)   DEFAULT '/logo.png',
  icp             VARCHAR(100)   DEFAULT '苏ICP备XXXXXXXX号',
  copyright       VARCHAR(255)   DEFAULT '© 2024 城际云（江苏）科技有限公司 All Rights Reserved',
  seo_title       VARCHAR(255)   DEFAULT '城际云（江苏）科技有限公司 — 专业的数字化转型服务商',
  seo_description VARCHAR(500)    DEFAULT '城际云致力于为政企客户提供云计算、大数据、人工智能等数字化转型解决方案',
  seo_keywords    VARCHAR(255)   DEFAULT '城际云,云计算,大数据,数字化转型,智慧城市',
  contact_phone   VARCHAR(50)    DEFAULT '400-XXX-XXXX',
  contact_email   VARCHAR(100)   DEFAULT 'contact@chengjiyun.com',
  address         VARCHAR(255)   DEFAULT '江苏省南京市XX区XX路XX号',
  created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO site_config (id) VALUES (1);

-- ──────────────────────────────────────
-- 2. Banner 轮播图
-- ──────────────────────────────────────
CREATE TABLE banners (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  image_url   VARCHAR(255)  NOT NULL,
  title       VARCHAR(255)  NOT NULL,
  subtitle    VARCHAR(255)  DEFAULT '',
  link        VARCHAR(255)  DEFAULT '',
  sort_order  INT           DEFAULT 0,
  is_active   TINYINT(1)    DEFAULT 1,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- 3. 新闻资讯
-- ──────────────────────────────────────
CREATE TABLE news (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255)   NOT NULL,
  summary      TEXT,
  content      LONGTEXT,
  category     ENUM('company','industry','notice') DEFAULT 'company',
  cover_image  VARCHAR(255)   DEFAULT '',
  source       VARCHAR(100)   DEFAULT '本站',
  author       VARCHAR(50)    DEFAULT '',
  view_count   INT            DEFAULT 0,
  is_pinned    TINYINT(1)     DEFAULT 0,
  is_published TINYINT(1)     DEFAULT 1,
  tags         JSON           DEFAULT (JSON_ARRAY()),
  attachments  JSON           DEFAULT (JSON_ARRAY()),
  publish_time DATETIME       DEFAULT CURRENT_TIMESTAMP,
  created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_published_time (is_published, publish_time),
  INDEX idx_pinned_time (is_pinned, publish_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- 4. 产品 / 服务
-- ──────────────────────────────────────
CREATE TABLE products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  icon        VARCHAR(255)  DEFAULT '',
  title       VARCHAR(255)  NOT NULL,
  description TEXT,
  link        VARCHAR(255)  DEFAULT '',
  features    JSON          DEFAULT (JSON_ARRAY()),
  category    VARCHAR(50)   DEFAULT '',
  sort_order  INT           DEFAULT 0,
  is_active   TINYINT(1)    DEFAULT 1,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- 5. 解决方案
-- ──────────────────────────────────────
CREATE TABLE solutions (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  title            VARCHAR(255)  NOT NULL,
  target_customer  VARCHAR(100)  DEFAULT '',
  description      TEXT,
  image_url        VARCHAR(255)  DEFAULT '',
  detail           LONGTEXT,
  is_active        TINYINT(1)    DEFAULT 1,
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- 6. 合作伙伴
-- ──────────────────────────────────────
CREATE TABLE partners (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255)  NOT NULL,
  logo_url   VARCHAR(255)  DEFAULT '',
  website    VARCHAR(255)  DEFAULT '',
  sort_order INT           DEFAULT 0,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- 7. 数据亮点指标
-- ──────────────────────────────────────
CREATE TABLE stats (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  label      VARCHAR(100)  NOT NULL,
  value      DECIMAL(12,2) NOT NULL,
  suffix     VARCHAR(20)   DEFAULT '',
  prefix     VARCHAR(20)   DEFAULT '',
  decimals   TINYINT       DEFAULT 0,
  sort_order INT           DEFAULT 0,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- 8. 联系我们 / 咨询提交
-- ──────────────────────────────────────
CREATE TABLE contacts (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  type          ENUM('consult','service-request') NOT NULL,
  name          VARCHAR(100)  DEFAULT '',
  company       VARCHAR(255)  DEFAULT '',
  phone         VARCHAR(50)   DEFAULT '',
  email         VARCHAR(100)  DEFAULT '',
  description   TEXT,
  service_type  VARCHAR(50)   DEFAULT '',
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- 9. 后台管理员
-- ──────────────────────────────────────
CREATE TABLE admin_users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(50)   NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL COMMENT 'bcrypt hashed',
  avatar      VARCHAR(255)  DEFAULT '',
  role        VARCHAR(50)   DEFAULT 'admin',
  permissions JSON          DEFAULT (JSON_ARRAY()),
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- 10. 友情链接
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS links (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  url        VARCHAR(255)  DEFAULT '',
  sort_order INT           DEFAULT 0,
  is_active  TINYINT(1)    DEFAULT 1,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- 11. 操作日志
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(100)  DEFAULT '',
  action      VARCHAR(50)   DEFAULT '',
  module      VARCHAR(100)  DEFAULT '',
  detail      VARCHAR(500)  DEFAULT '',
  ip          VARCHAR(50)   DEFAULT '',
  create_time TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- 12. CMS 通用内容页（公司简介/企业文化/组织架构等）
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms_pages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  slug       VARCHAR(100)  NOT NULL UNIQUE COMMENT '唯一标识: about-profile/about-culture/about-structure',
  title      VARCHAR(255)  DEFAULT '',
  content    LONGTEXT      COMMENT 'HTML富文本正文',
  meta       JSON          DEFAULT (JSON_OBJECT()) COMMENT '扩展字段(使命/愿景/价值观/组织树等)',
  updated_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- 13. 发展历程事件
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS timeline_events (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  year        VARCHAR(10)   NOT NULL,
  month       VARCHAR(10)   DEFAULT '',
  title       VARCHAR(255)  NOT NULL,
  description TEXT,
  sort_order  INT           DEFAULT 0,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- 14. 资质荣誉
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS honors (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(255)  NOT NULL,
  category          VARCHAR(50)   DEFAULT '' COMMENT '资质/专利/奖项/认证',
  image_url         VARCHAR(255)  DEFAULT '',
  issue_date        VARCHAR(20)   DEFAULT '',
  issuing_authority VARCHAR(255)  DEFAULT '',
  sort_order        INT           DEFAULT 0,
  created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 示例数据
-- ============================================

-- 默认管理员: admin / admin123
INSERT INTO admin_users (username, password, role, permissions) VALUES
('admin', '$2a$10$tdJXI1aJzyutznvVzLccteiZYJLpo2JUtIWv7Ppu/b7tqy.hVN55m', 'admin',
 '["news:manage","products:manage","solutions:manage","banners:manage","contacts:view"]');

-- 首页轮播
INSERT INTO banners (image_url, title, subtitle, link, sort_order) VALUES
('/images/banner-1.jpg', '城际云 — 数字化转型专家', '为政企客户提供安全可靠的云计算与大数据解决方案', '/solutions', 1),
('/images/banner-2.jpg', '智慧城市解决方案', '用科技赋能城市治理，构建数字化未来', '/solutions/1', 2),
('/images/banner-3.jpg', '数据驱动决策', '让每一份数据都成为您的核心竞争力', '/products/data-analytics', 3);

-- 新闻资讯
INSERT INTO news (title, summary, content, category, cover_image, source, author, view_count, is_pinned, is_published, tags, publish_time) VALUES
('城际云与江苏省大数据管理中心达成战略合作',
 '双方将在数据治理、数据安全、数据开放共享等领域展开深度合作',
 '<p>近日，城际云（江苏）科技有限公司与江苏省大数据管理中心正式签署战略合作协议...</p>',
 'company', '/images/news-1.jpg', '本站', '管理员', 1520, 1, 1, '["合作","大数据","战略"]', '2024-12-01 09:00:00'),

('城际云发布新一代数据中台产品 v3.0',
 '全新的数据中台产品在数据接入、数据治理、数据服务三个层面进行了全面升级',
 '<h2>产品亮点</h2><p>新一代数据中台产品引入了AI驱动的数据质量自动检测...</p>',
 'company', '/images/news-2.jpg', '本站', '产品部', 980, 1, 1, '["产品发布","数据中台","AI"]', '2024-11-28 14:00:00'),

('国务院印发《数字中国建设整体布局规划》',
 '规划提出到2025年，基本形成横向打通、纵向贯通、协调有力的一体化推进格局',
 '<p>新华社北京电 近日，中共中央、国务院印发了《数字中国建设整体布局规划》...</p>',
 'industry', '/images/news-3.jpg', '新华社', '', 3200, 0, 1, '["政策","数字中国","规划"]', '2024-11-20 08:30:00'),

('城际云荣获2024年度江苏省瞪羚企业称号',
 '凭借在云计算和大数据领域的技术创新和高速增长获得认可',
 '<p>2024年12月，江苏省科技厅正式公布了2024年度江苏省瞪羚企业名单...</p>',
 'company', '/images/news-4.jpg', '本站', '行政部', 650, 0, 1, '["荣誉","瞪羚企业","创新"]', '2024-12-15 10:00:00'),

('2024中国云计算产业峰会在南京成功举办',
 '来自全国各地的500余家云计算企业代表参加了本次峰会',
 '<p>12月10日，2024中国云计算产业峰会在南京国际博览中心隆重开幕...</p>',
 'industry', '/images/news-5.jpg', '中国信通院', '', 2100, 0, 1, '["峰会","云计算","产业"]', '2024-12-10 13:00:00'),

('公司顺利完成CMMI 3级认证评估',
 '标志着公司在软件研发过程管理和服务质量方面达到国际先进水平',
 '<p>经过为期一周的严格评估，城际云公司正式通过CMMI 3级认证...</p>',
 'company', '/images/news-6.jpg', '本站', '技术部', 430, 0, 1, '["认证","CMMI","质量管理"]', '2024-12-08 16:00:00'),

('关于2025年春节放假安排的通知',
 '根据国务院办公厅通知精神，结合公司实际情况，现将2025年春节放假安排通知如下',
 '<p>一、放假时间：2025年1月28日（农历除夕）至2月4日（农历正月初七），共8天...</p>',
 'notice', '', '本站', '人事部', 890, 0, 1, '["通知","放假","春节"]', '2025-01-15 09:00:00'),

('城际云获得ISO 27001信息安全管理体系认证',
 '这标志着公司在信息安全管理和客户数据保护方面达到了国际标准水平',
 '<p>近日，城际云（江苏）科技有限公司正式通过ISO 27001信息安全管理体系认证...</p>',
 'company', '/images/news-7.jpg', '本站', '安全部', 780, 0, 1, '["认证","信息安全","ISO27001"]', '2024-11-15 11:00:00'),

('数字政府建设进入深水区，数据共享成关键',
 '专家指出，打破数据壁垒、实现跨部门数据共享是当前数字政府建设的核心挑战',
 '<p>随着数字政府建设深入推进，各地在政务数据共享方面仍面临诸多挑战...</p>',
 'industry', '/images/news-8.jpg', '人民日报', '', 1800, 0, 1, '["数字政府","数据共享","政务"]', '2024-11-10 07:00:00'),

('公司组织2024年度技术能力提升培训',
 '全面提升员工在云计算、大数据、人工智能等前沿技术的专业水平',
 '<p>为持续提升团队技术能力，公司于12月初组织了为期两周的技术能力提升培训...</p>',
 'company', '', '本站', '人事部', 320, 0, 1, '["培训","技术","团队"]', '2024-12-05 10:00:00'),

('工信部发布《云计算发展三年行动计划》',
 '明确提出到2027年云计算市场规模突破万亿元的目标',
 '<p>工业和信息化部近日印发《云计算发展三年行动计划（2025-2027年）》...</p>',
 'industry', '/images/news-9.jpg', '工信部', '', 2800, 0, 1, '["政策","云计算","行动计划"]', '2024-10-25 09:00:00'),

('城际云与南京大学共建大数据联合实验室',
 '双方将在人才培养、技术研发、成果转化等方面开展全方位合作',
 '<p>12月18日，城际云与南京大学计算机科学与技术系签署协议...</p>',
 'company', '/images/news-10.jpg', '本站', '技术部', 560, 0, 1, '["合作","校企","实验室"]', '2024-12-18 15:00:00');

-- 产品 / 服务
INSERT INTO products (icon, title, description, features, category, sort_order) VALUES
('CloudServer', '云服务器 ECS', '高性能、安全稳定的云端计算服务，弹性伸缩，按需付费', '["弹性伸缩","秒级部署","99.95% SLA","7×24运维支持"]', 'cloud', 1),
('CloudStorage', '对象存储 OSS', '海量、安全、低成本的云端存储服务，支持任意类型数据', '["海量空间","数据加密","CDN加速","版本管理"]', 'cloud', 2),
('CloudDB', '云数据库 RDS', '即开即用的稳定可靠云数据库服务，支持多种引擎', '["MySQL/PostgreSQL","自动备份","读写分离","性能监控"]', 'cloud', 3),
('DataAnalytics', '数据分析平台', '一站式数据接入、处理、分析、可视化平台', '["拖拽式分析","AI辅助洞察","实时大屏","多数据源接入"]', 'data', 4),
('DataCenter', '数据中台', '企业级数据治理与资产管理平台，打通数据孤岛', '["数据治理","数据资产","数据服务","质量管理"]', 'data', 5),
('AIModel', 'AI 模型平台', '提供模型训练、部署、推理全流程服务', '["预训练模型","自动调参","在线推理","模型管理"]', 'ai', 6),
('DigitalGov', '数字政务平台', '面向政府的一体化数字政务服务解决方案', '["一网通办","数据共享","智能审批","移动政务"]', 'gov', 7),
('SmartCity', '智慧城市大脑', '城市运行态势感知与智能决策指挥平台', '["城市运行仪表盘","事件预警","应急指挥","民生分析"]', 'gov', 8);

-- 解决方案
INSERT INTO solutions (title, target_customer, description, image_url, detail) VALUES
('智慧政务解决方案', '各级政府机构',
 '以数据驱动政务流程再造，实现一网通办、跨域协同、智能决策的现代化治理体系',
 '/images/solution-gov.jpg',
 '<h2>方案概述</h2><p>面向各级政府机构，提供从顶层设计到落地实施的全套智慧政务解决方案。</p><h3>核心能力</h3><ul><li>一体化在线政务服务平台</li><li>数据共享交换平台</li><li>政务服务移动端</li><li>智能审批系统</li></ul>'),

('企业数字化转型解决方案', '中大型企业',
 '帮助企业构建数字化底座，实现业务流程再造与智能化升级',
 '/images/solution-enterprise.jpg',
 '<h2>方案概述</h2><p>面向制造业、金融业、零售业等传统行业企业，提供数字化转型全生命周期服务。</p>'),

('智慧教育解决方案', '教育机构',
 '构建智慧校园信息生态，实现教学、管理、科研、服务的全面数字化',
 '/images/solution-education.jpg',
 '<h2>方案概述</h2><p>面向高等院校和职业院校，提供智慧校园整体解决方案。</p>'),

('数据安全与合规解决方案', '政企客户',
 '帮助客户构建数据安全防护体系，满足等保、GDPR等合规要求',
 '/images/solution-security.jpg',
 '<h2>方案概述</h2><p>提供从数据分类分级、安全防护、审计溯源到合规评估的全方位数据安全服务。</p>'),

('智慧医疗解决方案', '医疗卫生机构',
 '以大数据和AI技术赋能精准医疗、智慧管理和便民服务',
 '/images/solution-medical.jpg',
 '<h2>方案概述</h2><p>面向医院、卫健委等机构，提供智慧医院和区域健康大数据平台。</p>'),

('智慧园区解决方案', '产业园区管委会',
 '以IoT+大数据为核心，实现园区运营管理的全面感知与智能决策',
 '/images/solution-park.jpg',
 '<h2>方案概述</h2><p>面向高新技术产业园区，提供智慧园区运营管理平台。</p>');

-- 合作伙伴
INSERT INTO partners (name, logo_url, website, sort_order) VALUES
('华为云', '/images/partners/huawei.png', 'https://www.huaweicloud.com', 1),
('阿里云', '/images/partners/alibaba.png', 'https://www.aliyun.com', 2),
('腾讯云', '/images/partners/tencent.png', 'https://cloud.tencent.com', 3),
('中国电信', '/images/partners/chinatelecom.png', 'https://www.chinatelecom.com.cn', 4),
('南京大学', '/images/partners/nju.png', 'https://www.nju.edu.cn', 5),
('江苏省大数据管理中心', '/images/partners/jsbigdata.png', '', 6);

-- 首页数据指标
INSERT INTO stats (label, value, suffix, prefix, decimals, sort_order) VALUES
('服务客户数', 500, '+', '', 0, 1),
('平台交易规模', 128, '亿+', '', 0, 2),
('数据覆盖城市', 320, '+', '', 0, 3),
('系统可用率', 99.95, '%', '', 2, 4);

-- 关于我们 — 公司简介
INSERT INTO cms_pages (slug, title, content) VALUES
('about-profile', '公司简介',
 '<p>城际云（江苏）科技有限公司是南京大数据集团的全资子公司，注册资本4000万元人民币。公司肩负着建设与运营南京城市云平台、为江苏省各行业提供关键节点资源的重要使命，同时围绕城市关键基础设施布局，建设并运营国资企业云。</p>
  <p>公司秉持"自主可控、集约高效、安全可靠"的发展原则，以成为最懂行业的云服务公司为使命愿景，坚持实心关爱行业客户价值，为企业客户提供专业贴心的云与数据价值服务，并以此为基础逐步成为企业数字化转型的长期合作伙伴。</p>
  <p>公司业务范围涵盖云基础设施的建设与运维、国资云的建设和运营、信息化系统集成及相关服务等。公司立足南京大数据集团，辐射南京、江苏、安徽乃至全国。通过未来5-10年的持续努力，将成长为全国有重要影响力的云服务商及企业数字化转型服务商提供者。</p>'),

('about-culture', '企业文化', '',
 JSON_OBJECT('mission', '成为最懂行业的云服务公司',
            'vision', '用科技赋能每一个组织，让数据成为核心竞争力',
            'values', '自主可控、集约高效、安全可靠；实心关爱、专业贴心、持续创新')),

('about-structure', '组织架构', '',
 JSON_OBJECT('tree', JSON_ARRAY(
   JSON_OBJECT('name','CEO/总经理','children',JSON_ARRAY(
     JSON_OBJECT('name','技术研发部','children',JSON_ARRAY('云平台组','AI智算组','数据平台组')),
     JSON_OBJECT('name','运营运维部','children',JSON_ARRAY('7x24监控中心','运维服务组','安全合规组')),
     JSON_OBJECT('name','市场销售部','children',JSON_ARRAY('政企客户组','商业客户组','方案咨询组')),
     JSON_OBJECT('name','行政管理部','children',JSON_ARRAY('人力资源','财务','行政'))
   ))
 )));

-- 发展历程
INSERT INTO timeline_events (year, month, title, description, sort_order) VALUES
('2024', '12', '荣获江苏省瞪羚企业称号', '凭借在云计算和大数据领域的技术创新和高速增长获得认可', 1),
('2024', '10', 'CloudMatrix 3.0 平台发布', '新一代云管理平台正式发布，全面支持混合云与多云管理', 2),
('2024', '06', '与南京大学共建大数据联合实验室', '双方在人才培养、技术研发、成果转化等方面开展全方位合作', 3),
('2023', '08', '通过 ISO 27001 信息安全管理认证', '信息安全管理和客户数据保护达到国际标准水平', 4),
('2023', '03', '成为江苏省首批国资云服务商', '获江苏省国资委认证，成为省级国资云服务提供商', 5),
('2022', '10', '公司正式成立', '城际云（江苏）科技有限公司注册成立，注册资本4000万元', 6);

-- 资质荣誉
INSERT INTO honors (name, category, image_url, issue_date, issuing_authority, sort_order) VALUES
('ISO 27001 信息安全管理体系认证', '认证', '/images/honors/iso27001.jpg', '2023-08', '国际标准化组织(ISO)', 1),
('CMMI 3级认证', '认证', '/images/honors/cmmi3.jpg', '2024-12', 'CMMI Institute', 2),
('江苏省瞪羚企业', '奖项', '/images/honors/gazelle.jpg', '2024-12', '江苏省科技厅', 3),
('国家高新技术企业', '资质', '/images/honors/high-tech.jpg', '2024-06', '江苏省科技厅', 4),
('2024年度最佳云服务商', '奖项', '/images/honors/best-cloud.jpg', '2024-07', '中国云计算产业联盟', 5);

SET FOREIGN_KEY_CHECKS = 1;
