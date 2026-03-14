import { Review } from '../types'

const AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Bob',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Carol',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Dave',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Eve',
]

const NAMES = ['小明', '学霸君', '吃货少女', '美食猎人', '干饭王', '奶茶控', '深夜食堂', '校园达人', '觅食者', '嘴馋同学']

const REVIEW_TEMPLATES: Record<string, string[]> = {
  r1: [
    '麻辣烫真的很正宗，汤底超香！食材也很新鲜，每次来都要加满。',
    '性价比很高，大份才18块，吃得饱饱的。就是高峰期要排队。',
    '辣度可以自己选，微辣也很好吃，不太能吃辣的同学也可以来。',
    '免费续汤这个太良心了，冬天来一碗暖暖的，幸福感爆棚。',
    '推荐加宽粉和豆皮，吸满汤汁特别入味！',
  ],
  r2: [
    '豚骨汤底真的熬了很久，浓郁醇厚，面条也很有嚼劲。',
    '溏心蛋是限量的，去晚了就没了，建议早点去！',
    '味噌拉面也不错，冬天吃特别暖和。叉烧给得很大方。',
    '环境比较小，但是味道真的没话说，值得排队。',
    '可以免费加面，对于饭量大的同学很友好。',
  ],
  r3: [
    '芝士年糕火锅太好吃了！芝士拉丝超长，拍照也很好看。',
    '石锅拌饭料很足，拌匀了吃特别香，锅巴脆脆的。',
    '小菜可以免费续，泡菜和腌萝卜都很正宗。',
    '装修很有韩式风格，适合和朋友一起来聚餐。',
    '辣炒年糕偏甜辣，喜欢甜口的同学会很喜欢。',
  ],
  r4: [
    '杨枝甘露永远的神！芒果很新鲜，椰汁也很浓。',
    '芋泥波波超好喝，芋泥很细腻，波波Q弹。',
    '第二杯半价，和室友一起买很划算。',
    '可以选糖度和冰度，三分糖刚刚好，不会太甜。',
    '出杯速度挺快的，课间来买也来得及。',
  ],
  r5: [
    '黄焖鸡真的很下饭，酱汁浓郁，鸡肉也很嫩。',
    '米饭免费续，吃到撑才16块，学生党福音。',
    '可以加豆腐和土豆，加了更好吃，汤汁拌饭绝了。',
    '出餐很快，赶时间的时候来这里最合适。',
    '微辣就够了，中辣真的很辣，不太能吃辣的慎选。',
  ],
  r6: [
    '烤五花肉太香了！肥瘦相间，烤得焦焦的，蘸酱吃一绝。',
    '夜宵来这里准没错，啤酒配烤肉，快乐加倍。',
    '牛肉串很嫩，调味也好，10串根本不够吃。',
    '适合聚餐，4-5个人来吃人均50左右，很划算。',
    '营业到凌晨2点，期末复习完来吃夜宵太爽了。',
  ],
  r7: [
    '牛油锅底超正宗，毛肚七上八下涮出来口感绝了。',
    '鸭肠很脆，肥牛也很新鲜，蘸油碟吃特别香。',
    '4人以上打9折，和同学一起来很划算。',
    '自助调料台调料很全，可以自己调喜欢的蘸料。',
    '建议提前预约，周末人很多，不预约要等位。',
  ],
  r8: [
    '奶油培根意面很浓郁，面条煮得刚好，al dente的口感。',
    '环境很好，灯光柔和，适合约会或者安静吃饭。',
    '有WiFi和插座，吃完还能坐一会儿看书。',
    '番茄肉酱意面酸甜可口，肉酱给得很足。',
    '蘑菇浓汤推荐，浓浓的蘑菇香，配面包很搭。',
  ],
  r9: [
    '芒果班戟皮薄馅多，芒果超甜，奶油也不腻。',
    '水果都是当天新鲜的，草莓蛋糕的草莓特别大颗。',
    '下午茶来这里太合适了，环境也很清新。',
    '水果捞料很足，酸奶浇上去拌着吃很爽。',
    '可以预订生日蛋糕，价格比外面便宜，味道也好。',
  ],
  r10: [
    '牛肉拉面汤很清亮，牛肉给得也不少，12块很值。',
    '早上7点就开门了，早课前来吃一碗很方便。',
    '面条是手工拉的，可以选粗细，我喜欢细面。',
    '牛肉饼也推荐，外酥里嫩，配拉面吃很满足。',
    '清真餐厅，环境干净整洁，老板人也很好。',
  ],
}

function generateReviews(restaurantId: string, templates: string[]): Review[] {
  return templates.map((content, i) => ({
    id: `${restaurantId}-rev${i + 1}`,
    restaurantId,
    userId: `u${i + 1}`,
    userName: NAMES[i % NAMES.length],
    userAvatar: AVATARS[i % AVATARS.length],
    rating: 3.5 + Math.random() * 1.5,
    content,
    images: i % 3 === 0 ? [`https://picsum.photos/seed/rev${restaurantId}${i}/200/200`] : [],
    tags: i % 2 === 0 ? ['好吃', '推荐'] : ['性价比高'],
    createdAt: `2025-${String(1 + (i * 2) % 12).padStart(2, '0')}-${String(5 + i * 3).padStart(2, '0')}`,
    likes: Math.floor(Math.random() * 50),
    isVerified: i % 3 !== 2,
  }))
}

// 为没有模板的餐厅生成通用评价
function generateGenericReviews(restaurantId: string, restaurantName: string): Review[] {
  const generic = [
    `${restaurantName}味道不错，经常来吃，推荐给大家。`,
    `性价比很高，分量也足，学生党友好。`,
    `环境还可以，出餐速度也快，午餐高峰期人比较多。`,
    `和朋友一起来的，大家都觉得不错，下次还会来。`,
    `招牌菜确实好吃，其他菜品也都在线，值得一试。`,
  ]
  return generateReviews(restaurantId, generic)
}

export const reviews: Review[] = [
  ...generateReviews('r1', REVIEW_TEMPLATES.r1),
  ...generateReviews('r2', REVIEW_TEMPLATES.r2),
  ...generateReviews('r3', REVIEW_TEMPLATES.r3),
  ...generateReviews('r4', REVIEW_TEMPLATES.r4),
  ...generateReviews('r5', REVIEW_TEMPLATES.r5),
  ...generateReviews('r6', REVIEW_TEMPLATES.r6),
  ...generateReviews('r7', REVIEW_TEMPLATES.r7),
  ...generateReviews('r8', REVIEW_TEMPLATES.r8),
  ...generateReviews('r9', REVIEW_TEMPLATES.r9),
  ...generateReviews('r10', REVIEW_TEMPLATES.r10),
  ...generateGenericReviews('r11', '鸡公煲'),
  ...generateGenericReviews('r12', '寿司小站'),
  ...generateGenericReviews('r13', '螺蛳粉专门店'),
  ...generateGenericReviews('r14', '汉堡王子'),
  ...generateGenericReviews('r15', '粥道'),
  ...generateGenericReviews('r16', '炸鸡少年'),
  ...generateGenericReviews('r17', '咖啡与猫'),
  ...generateGenericReviews('r18', '麻辣香锅'),
  ...generateGenericReviews('r19', '铁板烧'),
  ...generateGenericReviews('r20', '甜蜜蜜奶茶'),
]

export function getReviewsByRestaurant(restaurantId: string): Review[] {
  return reviews.filter(r => r.restaurantId === restaurantId)
}

export function getLatestReviews(count: number = 10): Review[] {
  return [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, count)
}
