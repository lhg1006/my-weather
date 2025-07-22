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
  
  // 로마자 표기법 변형들 (매큔-라이샤워 표기법 등)
  'Kwangmyŏng': '광명',
  'Kwangmyong': '광명',
  'Sŏngnam': '성남',
  'Songnam': '성남',
  'P'yŏngtaek': '평택',
  'Pyongtaek': '평택',
  'Inch'ŏn': '인천',
  'Inchon': '인천',
  'Taegu': '대구',
  'Taejon': '대전',
  'Kwangju': '광주',
  'Pusan': '부산',
  'Ch'ŏnju': '천안',
  'Chonju': '천안',
  'Suwŏn': '수원',
  'Ch'angwŏn': '창원',
  'Changwon': '창원',
  
  // 추가 한국 도시들 (더 많은 시/군/구)
  'Gimcheon': '김천',
  'Gumi': '구미',
  'Gyeongju': '경주',
  'Andong': '안동',
  'Yeongju': '영주',
  'Yeongcheon': '영천',
  'Sangju': '상주',
  'Mungyeong': '문경',
  'Gyeongsan': '경산',
  'Gunsan': '군산',
  'Iksan': '익산',
  'Mokpo': '목포',
  'Yeosu': '여수',
  'Suncheon': '순천',
  'Gwangyang': '광양',
  'Naju': '나주',
  'Boryeong': '보령',
  'Asan': '아산',
  'Seosan': '서산',
  'Nonsan': '논산',
  'Gongju': '공주',
  'Buyeo': '부여',
  'Hongseong': '홍성',
  'Yesan': '예산',
  'Dangjin': '당진',
  'Cheonan': '천안',
  'Jecheon': '제천',
  'Chungju': '충주',
  'Eumseong': '음성',
  'Jincheon': '진천',
  'Goesan': '괴산',
  'Cheongwon': '청원',
  'Boeun': '보은',
  'Okcheon': '옥천',
  'Yeongdong': '영동',
  'Cheonan': '천안',
  'Hwaseong': '화성',
  'Osan': '오산',
  'Anseong': '안성',
  'Icheon': '이천',
  'Yeoju': '여주',
  'Pyeongtaek': '평택',
  'Gwangju': '광주', // 경기도 광주
  'Gwangju-si': '광주시', // 경기도 광주시
  'Yangpyeong': '양평',
  'Gapyeong': '가평',
  'Yeoncheon': '연천',
  'Pocheon': '포천',
  'Dongducheon': '동두천',
  'Gwangmyeong': '광명',
  'Gunpo': '군포',
  'Uiwang': '의왕',
  'Hanam': '하남',
  'Gwacheon': '과천',
  'Yangju': '양주',
  'Guri': '구리',
  'Namyangju': '남양주',
  'Uijeongbu': '의정부',
  'Paju': '파주',
  'Gimpo': '김포',
  'Siheung': '시흥',
  'Gunsan': '군산',
  
  // 강원도 도시들
  'Chuncheon': '춘천',
  'Wonju': '원주',
  'Gangneung': '강릉',
  'Donghae': '동해',
  'Taebaek': '태백',
  'Sokcho': '속초',
  'Samcheok': '삼척',
  'Hongcheon': '홍천',
  'Hoengseong': '횡성',
  'Yeongwol': '영월',
  'Pyeongchang': '평창',
  'Jeongseon': '정선',
  'Cheorwon': '철원',
  'Hwacheon': '화천',
  'Yanggu': '양구',
  'Inje': '인제',
  'Goseong': '고성',
  'Yangyang': '양양',
  
  // 제주도
  'Jeju-si': '제주시',
  'Seogwipo-si': '서귀포시',
  
  // 부산 구/군
  'Haeundae': '해운대구',
  'Busanjin': '부산진구',
  'Dong': '동구',
  'Nam': '남구',
  'Buk': '북구',
  'Sasang': '사상구',
  'Suyeong': '수영구',
  'Yeonje': '연제구',
  'Saha': '사하구',
  'Gijang': '기장군',
  
  // 대구 구/군
  'Dalseong': '달성군',
  'Dalseo': '달서구',
  'Seo': '서구',
  
  // 인천 구/군
  'Ganghwa': '강화군',
  'Ongjin': '옹진군',
  'Michuhol': '미추홀구',
  'Namdong': '남동구',
  'Bupyeong': '부평구',
  'Gyeyang': '계양구',
  
  // 기타 변형 표기들
  'Seoul-si': '서울시',
  'Busan-si': '부산시',
  'Daegu-si': '대구시',
  'Incheon-si': '인천시',
  'Daejeon-si': '대전시',
  'Gwangju-si': '광주시',
  'Ulsan-si': '울산시',
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