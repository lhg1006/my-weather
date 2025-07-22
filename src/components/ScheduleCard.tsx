import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { getCurrentTimeStatus, getNextScheduleEvent } from '../utils/schedule';
import { Card } from './ui';
import { Clock, Briefcase, Activity, Coffee } from 'lucide-react';

export const ScheduleCard = () => {
  const { settings } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 1초마다 업데이트 (실시간 카운트다운)

    return () => clearInterval(timer);
  }, []);

  // 스케줄 설정이 없거나 비활성화된 경우
  if (!settings?.schedule?.enabled) {
    return null;
  }

  // currentTime이 변경될 때마다 재계산
  const timeStatus = getCurrentTimeStatus(settings.schedule);
  const nextEvent = getNextScheduleEvent(settings.schedule);

  const getStatusIcon = () => {
    switch (timeStatus.status) {
      case 'canWork':
        return <Briefcase className="w-5 h-5" />;
      case 'canLeave':
        return <Clock className="w-5 h-5" />;
      case 'activity':
        return <Activity className="w-5 h-5" />;
      case 'rest':
        return <Coffee className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    switch (timeStatus.status) {
      case 'canWork':
        return 'text-blue-600 dark:text-blue-400';
      case 'canLeave':
        return 'text-purple-600 dark:text-purple-400';
      case 'activity':
        return 'text-green-600 dark:text-green-400';
      case 'rest':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getStatusBg = () => {
    switch (timeStatus.status) {
      case 'canWork':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'canLeave':
        return 'bg-purple-100 dark:bg-purple-900/20';
      case 'activity':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'rest':
        return 'bg-orange-100 dark:bg-orange-900/20';
      default:
        return 'bg-slate-100 dark:bg-slate-700/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <Card variant="glass" className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getStatusBg()}`}>
            <div className={getStatusColor()}>
              {getStatusIcon()}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-white">
              {timeStatus.message || '스케줄 활성화됨'}
            </h3>
            
            {timeStatus.timeUntil && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {timeStatus.timeUntil}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-medium text-slate-900 dark:text-white">
            {currentTime.toLocaleTimeString('ko-KR', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {currentTime.toLocaleDateString('ko-KR', { 
              month: 'short', 
              day: 'numeric',
              weekday: 'short'
            })}
          </div>
        </div>
      </div>
      
      {/* 스케줄 요약 */}
      <div className="mt-4 space-y-2 text-xs">
        <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <span className="text-slate-600 dark:text-slate-400">출근</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {settings.schedule.workStartTime} - {settings.schedule.workEndTime}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <span className="text-slate-600 dark:text-slate-400">퇴근</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {settings.schedule.leaveStartTime} - {settings.schedule.leaveEndTime}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <span className="text-slate-600 dark:text-slate-400">활동</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {settings.schedule.activityStartTime} - {settings.schedule.activityEndTime}
          </span>
        </div>
      </div>
      </Card>
    </motion.div>
  );
};