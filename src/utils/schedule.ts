import type { ScheduleSettings } from '../types';

export const getCurrentTimeStatus = (schedule: ScheduleSettings) => {
  if (!schedule.enabled) {
    return { status: 'none', message: '' };
  }

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const currentMinutes = convertToMinutes(currentTime);
  
  // 출근 가능 시간 확인
  const canWork = schedule.workStartTime && schedule.workEndTime ? 
    isTimeInRange(currentTime, schedule.workStartTime, schedule.workEndTime) : false;
  // 퇴근 가능 시간 확인
  const canLeave = schedule.leaveStartTime && schedule.leaveEndTime ? 
    isTimeInRange(currentTime, schedule.leaveStartTime, schedule.leaveEndTime) : false;
  const isActivityTime = schedule.activityStartTime && schedule.activityEndTime ? 
    isTimeInRange(currentTime, schedule.activityStartTime, schedule.activityEndTime) : false;
  
  // 퇴근까지 남은 시간 계산
  const getTimeUntilLeave = () => {
    if (!schedule.leaveStartTime) return null;
    
    const leaveMinutes = convertToMinutes(schedule.leaveStartTime);
    let timeUntil = leaveMinutes - currentMinutes;
    
    // 다음날 퇴근 시간인 경우
    if (timeUntil <= 0) {
      timeUntil = (24 * 60) + timeUntil;
    }
    
    const hours = Math.floor(timeUntil / 60);
    const minutes = timeUntil % 60;
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분 후`;
    } else {
      return `${minutes}분 후`;
    }
  };
  
  // 출근까지 남은 시간 계산  
  const getTimeUntilWork = () => {
    if (!schedule.workStartTime) return null;
    
    const workMinutes = convertToMinutes(schedule.workStartTime);
    let timeUntil = workMinutes - currentMinutes;
    
    // 다음날 출근 시간인 경우
    if (timeUntil <= 0) {
      timeUntil = (24 * 60) + timeUntil;
    }
    
    const hours = Math.floor(timeUntil / 60);
    const minutes = timeUntil % 60;
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분 후`;
    } else {
      return `${minutes}분 후`;
    }
  };
  
  if (canWork) {
    const timeUntilLeave = getTimeUntilLeave();
    return {
      status: 'canWork' as const,
      message: '출근 시간',
      timeUntil: timeUntilLeave ? `${timeUntilLeave} 퇴근` : null,
      type: 'work'
    };
  }
  
  if (canLeave) {
    const timeUntilWork = getTimeUntilWork();
    return {
      status: 'canLeave' as const,
      message: '퇴근 시간',
      timeUntil: timeUntilWork ? `${timeUntilWork} 출근` : null,
      type: 'work'
    };
  }
  
  if (isActivityTime) {
    // 활동 시간에는 다음 출근 또는 퇴근 시간 중 더 가까운 것을 표시
    const timeUntilWork = getTimeUntilWork();
    const timeUntilLeave = getTimeUntilLeave();
    
    let nextTimeUntil = null;
    if (timeUntilWork && timeUntilLeave) {
      // 둘 다 있으면 더 가까운 것 선택 (분 단위로 비교)
      const workMinutes = convertToMinutes(schedule.workStartTime!) - currentMinutes;
      const leaveMinutes = convertToMinutes(schedule.leaveStartTime!) - currentMinutes;
      
      // 음수면 다음날로 계산
      const adjustedWorkMinutes = workMinutes <= 0 ? (24 * 60) + workMinutes : workMinutes;
      const adjustedLeaveMinutes = leaveMinutes <= 0 ? (24 * 60) + leaveMinutes : leaveMinutes;
      
      if (adjustedWorkMinutes <= adjustedLeaveMinutes) {
        nextTimeUntil = `${timeUntilWork} 출근`;
      } else {
        nextTimeUntil = `${timeUntilLeave} 퇴근`;
      }
    } else if (timeUntilWork) {
      nextTimeUntil = `${timeUntilWork} 출근`;
    } else if (timeUntilLeave) {
      nextTimeUntil = `${timeUntilLeave} 퇴근`;
    }
    
    return {
      status: 'activity' as const,
      message: '활동 시간',
      timeUntil: nextTimeUntil,
      type: 'activity'
    };
  }
  
  // 휴식 시간에는 출근까지 남은 시간 표시
  const timeUntilWork = getTimeUntilWork();
  return {
    status: 'rest' as const,
    message: '휴식 시간',
    timeUntil: timeUntilWork ? `${timeUntilWork} 출근` : null,
    type: 'rest'
  };
};

export const getNextScheduleEvent = (schedule: ScheduleSettings) => {
  if (!schedule.enabled) return null;
  
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const events = [
    schedule.workStartTime && { time: schedule.workStartTime, type: '출근 가능 시작', label: 'work-start' },
    schedule.workEndTime && { time: schedule.workEndTime, type: '출근 가능 종료', label: 'work-end' },
    schedule.leaveStartTime && { time: schedule.leaveStartTime, type: '퇴근 가능 시작', label: 'leave-start' },
    schedule.leaveEndTime && { time: schedule.leaveEndTime, type: '퇴근 가능 종료', label: 'leave-end' },
    schedule.activityStartTime && { time: schedule.activityStartTime, type: '활동 시작', label: 'activity-start' },
    schedule.activityEndTime && { time: schedule.activityEndTime, type: '활동 종료', label: 'activity-end' },
  ].filter(Boolean) as { time: string; type: string; label: string }[];
  
  const currentMinutes = convertToMinutes(currentTime);
  
  // 오늘 남은 이벤트 찾기
  const upcomingEvents = events
    .map(event => ({
      ...event,
      minutes: convertToMinutes(event.time),
      isToday: convertToMinutes(event.time) > currentMinutes
    }))
    .filter(event => event.isToday)
    .sort((a, b) => a.minutes - b.minutes);
  
  if (upcomingEvents.length > 0) {
    const nextEvent = upcomingEvents[0];
    const timeUntil = nextEvent.minutes - currentMinutes;
    
    return {
      ...nextEvent,
      timeUntil: `${Math.floor(timeUntil / 60)}시간 ${timeUntil % 60}분 후`,
      minutesUntil: timeUntil
    };
  }
  
  // 오늘 남은 이벤트가 없으면 내일 첫 이벤트
  const tomorrowEvents = events
    .sort((a, b) => convertToMinutes(a.time) - convertToMinutes(b.time));
  
  if (tomorrowEvents.length > 0) {
    const nextEvent = tomorrowEvents[0];
    const timeUntil = (24 * 60) - currentMinutes + convertToMinutes(nextEvent.time);
    
    return {
      ...nextEvent,
      timeUntil: `내일 ${nextEvent.time}`,
      minutesUntil: timeUntil,
      isTomorrow: true
    };
  }
  
  return null;
};

// 시간이 범위 안에 있는지 확인
const isTimeInRange = (current: string, start: string, end: string): boolean => {
  const currentMinutes = convertToMinutes(current);
  const startMinutes = convertToMinutes(start);
  const endMinutes = convertToMinutes(end);
  
  if (startMinutes <= endMinutes) {
    // 같은 날 (예: 09:00 - 18:00)
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    // 다음 날로 넘어가는 경우 (예: 22:00 - 06:00)
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
};

// 시간을 분으로 변환
const convertToMinutes = (time: string): number => {
  if (!time || typeof time !== 'string') {
    return 0;
  }
  const parts = time.split(':');
  if (parts.length !== 2) {
    return 0;
  }
  const [hours, minutes] = parts.map(Number);
  return hours * 60 + minutes;
};

// 분을 시간:분 형식으로 변환
export const formatMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};