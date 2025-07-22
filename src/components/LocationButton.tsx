import { motion } from 'framer-motion';
import { Button } from './ui';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTranslation } from 'react-i18next';
import { MapPin, Loader2 } from 'lucide-react';

export const LocationButton = () => {
  const { t } = useTranslation();
  const { 
    requestLocation, 
    isLocationLoading, 
    locationError,
    hasLocation 
  } = useGeolocation();

  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <Button
        onClick={requestLocation}
        isLoading={isLocationLoading}
        variant={hasLocation ? 'secondary' : 'primary'}
        leftIcon={isLocationLoading ? <Loader2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
        className="w-full"
      >
        {hasLocation ? t('location.current') : t('location.getLocation')}
      </Button>
      
      {locationError && (
        <p className="mt-2 text-sm text-ios-red text-center">
          {locationError}
        </p>
      )}
    </motion.div>
  );
};