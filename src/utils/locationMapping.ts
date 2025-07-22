// 영어 도시명을 한국어로 매핑하는 유틸리티
export const CITY_NAME_KR: Record<string, string> = {
  // 주요 한국 도시
  'Seoul': '서울',
  'Busan': '부산',
  'Incheon': '인천',
  'Daegu': '대구',
  'Daejeon': '대전',
  'Gwangju': '광주',
  'Suwon': '수원',
  'Ulsan': '울산',
  'Changwon': '창원',
  'Goyang': '고양',
  'Yongin': '용인',
  'Bucheon': '부천',
  'Ansan': '안산',
  'Cheongju': '청주',
  'Jeonju': '전주',
  'Anyang': '안양',
  'Cheonan': '천안',
  'Namyangju': '남양주',
  'Pohang': '포항',
  'Uijeongbu': '의정부',
  'Siheung': '시흥',
  'Paju': '파주',
  'Gimhae': '김해',
  'Sejong': '세종',
  'Jeju': '제주',
  'Jeju City': '제주시',
  'Seogwipo': '서귀포',
  'Gangneung': '강릉',
  'Sokcho': '속초',
  'Chuncheon': '춘천',
  'Wonju': '원주',
  
  // 주요 국제 도시들
  'New York': '뉴욕',
  'Los Angeles': '로스앤젤레스',
  'San Francisco': '샌프란시스코',
  'Chicago': '시카고',
  'London': '런던',
  'Paris': '파리',
  'Berlin': '베를린',
  'Rome': '로마',
  'Madrid': '마드리드',
  'Tokyo': '도쿄',
  'Osaka': '오사카',
  'Beijing': '베이징',
  'Shanghai': '상하이',
  'Hong Kong': '홍콩',
  'Singapore': '싱가포르',
  'Bangkok': '방콕',
  'Sydney': '시드니',
  'Melbourne': '멜버른',
  'Moscow': '모스크바',
  'Dubai': '두바이',
  'Mumbai': '뭄바이',
  'Delhi': '델리',
  'Cairo': '카이로',
  'Istanbul': '이스탄불',
  'Toronto': '토론토',
  'Vancouver': '밴쿠버',
  'São Paulo': '상파울루',
  'Mexico City': '멕시코시티',
};

export const COUNTRY_NAME_KR: Record<string, string> = {
  'KR': '한국',
  'US': '미국', 
  'JP': '일본',
  'CN': '중국',
  'GB': '영국',
  'FR': '프랑스',
  'DE': '독일',
  'IT': '이탈리아',
  'ES': '스페인',
  'CA': '캐나다',
  'AU': '호주',
  'RU': '러시아',
  'IN': '인도',
  'BR': '브라질',
  'MX': '멕시코',
  'AE': '아랍에미리트',
  'SG': '싱가포르',
  'TH': '태국',
  'EG': '이집트',
  'TR': '터키',
  'HK': '홍콩',
};

/**
 * 영어 도시명을 한국어로 변환
 */
export function getCityNameInKorean(englishName: string): string {
  return CITY_NAME_KR[englishName] || englishName;
}

/**
 * 국가 코드를 한국어 국가명으로 변환
 */
export function getCountryNameInKorean(countryCode: string): string {
  return COUNTRY_NAME_KR[countryCode] || countryCode;
}

/**
 * 위치 정보를 한국어로 포맷팅
 */
export function formatLocationInKorean(city: string, country: string): string {
  const koreanCity = getCityNameInKorean(city);
  const koreanCountry = getCountryNameInKorean(country);
  
  // 한국 도시의 경우 "서울" 만 표시, 해외 도시의 경우 "도시, 국가" 형태로 표시
  if (country === 'KR') {
    return koreanCity;
  } else {
    return `${koreanCity}, ${koreanCountry}`;
  }
}