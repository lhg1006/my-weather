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
  
  // 추가 한국 도시들
  'Hwaseong': '화성',
  'Seongnam': '성남',
  'Gimpo': '김포',
  'Pyeongtaek': '평택',
  'Hwaseong-si': '화성시',
  'Seongnam-si': '성남시',
  'Gimpo-si': '김포시',
  'Pyeongtaek-si': '평택시',
  'Gwacheon': '과천',
  'Hanam': '하남',
  'Osan': '오산',
  'Gunpo': '군포',
  'Icheon': '이천',
  'Yangju': '양주',
  'Guri': '구리',
  'Uiwang': '의왕',
  'Pocheon': '포천',
  'Dongducheon': '동두천',
  'Gwangmyeong': '광명',
  'Yeoju': '여주',
  'Yangpyeong': '양평',
  'Gapyeong': '가평',
  'Yeoncheon': '연천',
  
  // 광역시/도 단위
  'Gyeonggi': '경기도',
  'Gyeonggi-do': '경기도',
  'Gangwon': '강원도',
  'Gangwon-do': '강원도',
  'Chungcheong': '충청도',
  'Chungcheongbuk': '충청북도',
  'Chungcheongnam': '충청남도',
  'Jeolla': '전라도',
  'Jeollabuk': '전라북도',
  'Jeollanam': '전라남도',
  'Gyeongsang': '경상도',
  'Gyeongsangbuk': '경상북도',
  'Gyeongsangnam': '경상남도',
  
  // 구/군 단위 (일부)
  'Songpa': '송파구',
  'Gangnam': '강남구',
  'Seocho': '서초구',
  'Mapo': '마포구',
  'Yongsan': '용산구',
  'Jung': '중구',
  'Jongno': '종로구',
  'Seodaemun': '서대문구',
  'Eunpyeong': '은평구',
  'Dobong': '도봉구',
  'Nowon': '노원구',
  'Dongdaemun': '동대문구',
  'Jungnang': '중랑구',
  'Seongdong': '성동구',
  'Gwangjin': '광진구',
  'Gangdong': '강동구',
  
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
  const koreanName = CITY_NAME_KR[englishName];
  
  // 매핑되지 않은 도시명 디버깅
  if (!koreanName) {
    console.warn(`🗺️ 한국어 매핑이 없는 도시: "${englishName}"`);
    console.log('💡 이 도시를 한국어로 추가하려면 locationMapping.ts에 추가하세요');
  }
  
  return koreanName || englishName;
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