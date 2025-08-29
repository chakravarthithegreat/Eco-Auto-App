import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Volume2, 
  Play, 
  Upload, 
  Settings,
  Bell,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useNotificationSound } from '../../hooks/useNotificationSound';
import { getPredefinedSounds } from '../../utils/notificationSoundUtils';

const NotificationSoundTest = () => {
  const [customSound, setCustomSound] = useState(null);
  const [testSettings, setTestSettings] = useState({
    enabled: true,
    volume: 70,
    sound: 'chime'
  });
  
  const { playSound, playSoundByName, playCustomSound } = useNotificationSound(testSettings);

  const predefinedSounds = getPredefinedSounds();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomSound(url);
    }
  };

  const playSelectedSound = () => {
    if (customSound) {
      playCustomSound(customSound);
    } else {
      playSoundByName(testSettings.sound);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
          Notification Sound Test
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Test different notification sounds and settings
        </p>
      </div>

      <Card className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-glass-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-light-primary dark:text-dark-primary" />
            Sound Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable Sound */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-light-text dark:text-dark-text">Enable Sounds</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Toggle notification sounds on/off
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={testSettings.enabled}
                onChange={(e) => setTestSettings({...testSettings, enabled: e.target.checked})}
              />
              <div className="w-11 h-6 bg-light-bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-light-primary/20 rounded-full peer dark:bg-dark-bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-checked:bg-light-primary"></div>
            </label>
          </div>

          {/* Volume Control */}
          <div>
            <div className="flex justify-between mb-2">
              <p className="font-medium text-light-text dark:text-dark-text">Volume</p>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {testSettings.volume}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={testSettings.volume}
              onChange={(e) => setTestSettings({...testSettings, volume: parseInt(e.target.value)})}
              className="w-full h-2 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Sound Selection */}
          <div>
            <p className="font-medium text-light-text dark:text-dark-text mb-2">Predefined Sounds</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(predefinedSounds).map(([key, sound]) => (
                <button
                  key={key}
                  onClick={() => setTestSettings({...testSettings, sound: key})}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    testSettings.sound === key
                      ? 'bg-light-primary text-white dark:bg-dark-primary'
                      : 'bg-light-bg-secondary text-light-text hover:bg-light-bg-secondary/80 dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:bg-dark-bg-secondary/80'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  {sound.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Sound Upload */}
          <div>
            <p className="font-medium text-light-text dark:text-dark-text mb-2">Custom Sound</p>
            <div className="flex items-center gap-2">
              <label className="flex-1 px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-bg-secondary dark:border-dark-bg-secondary rounded-lg text-light-text dark:text-dark-text text-sm cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {customSound ? 'Custom sound loaded' : 'Upload sound file'}
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {customSound && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomSound(null)}
                >
                  Clear
                </Button>
              )}
            </div>
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
              Upload your own notification sound (MP3, WAV, OGG)
            </p>
          </div>

          {/* Test Button */}
          <div className="pt-4">
            <Button
              onClick={playSelectedSound}
              className="w-full flex items-center justify-center gap-2"
              disabled={!testSettings.enabled}
            >
              <Play className="w-4 h-4" />
              Play Notification Sound
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-glass-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-light-primary dark:text-dark-primary" />
            How to Use
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-light-primary/10 dark:bg-dark-primary/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-light-primary dark:text-dark-primary" />
              </div>
              <div>
                <h3 className="font-medium text-light-text dark:text-dark-text">Test Sounds</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Select a predefined sound or upload your own, then click "Play Notification Sound"
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-light-primary/10 dark:bg-dark-primary/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-light-primary dark:text-dark-primary" />
              </div>
              <div>
                <h3 className="font-medium text-light-text dark:text-dark-text">Volume Control</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Adjust the volume slider to control sound level (0-100%)
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-light-primary/10 dark:bg-dark-primary/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-light-primary dark:text-dark-primary" />
              </div>
              <div>
                <h3 className="font-medium text-light-text dark:text-dark-text">Global Settings</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  These settings will be applied globally in the Admin Settings under Notifications
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSoundTest;