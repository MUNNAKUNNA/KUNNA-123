import React, { useState } from 'react';
import { 
  Smartphone, 
  Youtube, 
  Camera, 
  Clock, 
  Calculator, 
  Compass, 
  Settings2, 
  Bell, 
  Volume2, 
  Sun, 
  Wifi, 
  Bluetooth, 
  Moon, 
  Battery, 
  CheckCircle, 
  AlertTriangle,
  PlayCircle,
  ExternalLink
} from 'lucide-react';
import { DeviceApp, DeviceNotification } from '../types';

interface DeviceSimulatorProps {
  onSpeak: (text: string) => void;
  onExecuteDeviceCommand: (command: string) => void;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  onSpeak,
  onExecuteDeviceCommand,
}) => {
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [dndOn, setDndOn] = useState(false);
  const [volume, setVolume] = useState(75);
  const [brightness, setBrightness] = useState(85);
  const [activeApp, setActiveApp] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<DeviceNotification[]>([
    {
      id: 'notif-1',
      app: 'Calendar',
      title: 'Reminder: Code Review',
      message: 'Android Kotlin Compose architecture sync at 4:00 PM',
      time: '12m ago',
      unread: true,
    },
    {
      id: 'notif-2',
      app: 'YouTube',
      title: 'New AI Video',
      message: 'Gemini 3 and Android On-Device Models released!',
      time: '1h ago',
      unread: false,
    },
  ]);

  const apps: DeviceApp[] = [
    { id: 'youtube', name: 'YouTube', icon: 'youtube', category: 'media', actionUrl: 'https://youtube.com', description: 'Watch videos and tutorials' },
    { id: 'camera', name: 'Camera', icon: 'camera', category: 'system', description: 'Take photos and scan' },
    { id: 'clock', name: 'Clock / Alarm', icon: 'clock', category: 'system', description: 'Alarms and timers' },
    { id: 'calculator', name: 'Calculator', icon: 'calculator', category: 'productivity', description: 'Quick math calculations' },
    { id: 'maps', name: 'Maps', icon: 'compass', category: 'productivity', actionUrl: 'https://maps.google.com', description: 'Navigation and places' },
    { id: 'settings', name: 'Device Settings', icon: 'settings', category: 'system', description: 'Android configurations' },
  ];

  const handleLaunchApp = (app: DeviceApp) => {
    setActiveApp(app.name);
    onSpeak(`Opening ${app.name} on device.`);
    if (app.actionUrl) {
      window.open(app.actionUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleReadNotification = (notif: DeviceNotification) => {
    onSpeak(`Notification from ${notif.app}: ${notif.title}. ${notif.message}`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            Device Assistant & Android Bridge
          </h2>
          <p className="text-xs text-slate-400">
            Simulate and interact with device actions, supported apps, system controls, and notifications.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
          <Battery className="w-4 h-4 text-emerald-400" />
          <span>92% Battery</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-medium">Charging</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Device Controls & System Toggles */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-emerald-400" /> Quick System Settings
            </h3>

            {/* Wireless & Toggles */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setWifiOn(!wifiOn)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all ${
                  wifiOn
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <Wifi className="w-4 h-4" />
                <span className="text-[11px] font-medium">Wi-Fi: {wifiOn ? 'On' : 'Off'}</span>
              </button>

              <button
                type="button"
                onClick={() => setBluetoothOn(!bluetoothOn)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all ${
                  bluetoothOn
                    ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <Bluetooth className="w-4 h-4" />
                <span className="text-[11px] font-medium">BT: {bluetoothOn ? 'On' : 'Off'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDndOn(!dndOn)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all ${
                  dndOn
                    ? 'bg-amber-600/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-[11px] font-medium">DND: {dndOn ? 'On' : 'Off'}</span>
              </button>
            </div>

            {/* Sliders */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-slate-400" /> Volume
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-slate-400" /> Brightness
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            {/* Permissions summary */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Android Permissions
              </span>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Microphone (Speech)</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5" /> Granted
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Notifications</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5" /> Granted
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Foreground Services</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5" /> Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Drawer */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-400" /> Notifications ({notifications.length})
              </h3>
            </div>
            <div className="space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-800 transition-all text-left space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-400">{notif.app}</span>
                    <span className="text-slate-500">{notif.time}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-200">{notif.title}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{notif.message}</p>
                  <button
                    type="button"
                    onClick={() => handleReadNotification(notif)}
                    className="mt-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    <PlayCircle className="w-3 h-3" /> MAYRA, read notification
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Supported Applications Launcher */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" /> Supported Applications
              </h3>
              <span className="text-[11px] text-slate-400">1-Tap or Voice Trigger</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Ask MAYRA "Open YouTube" or tap below. MAYRA maps natural device commands to supported capabilities.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {apps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => handleLaunchApp(app)}
                  className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-900 group-hover:bg-emerald-500/20 border border-slate-800 group-hover:border-emerald-500/40 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 mb-2">
                    {app.id === 'youtube' && <Youtube className="w-4 h-4 text-rose-400" />}
                    {app.id === 'camera' && <Camera className="w-4 h-4 text-cyan-400" />}
                    {app.id === 'clock' && <Clock className="w-4 h-4 text-amber-400" />}
                    {app.id === 'calculator' && <Calculator className="w-4 h-4 text-emerald-400" />}
                    {app.id === 'maps' && <Compass className="w-4 h-4 text-blue-400" />}
                    {app.id === 'settings' && <Settings2 className="w-4 h-4 text-purple-400" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                      {app.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-emerald-400" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{app.description}</p>
                </button>
              ))}
            </div>

            {/* Quick Command triggers */}
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Voice / Text Triggers:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "MAYRA, open YouTube",
                  "MAYRA, what's my battery percentage?",
                  "MAYRA, read my latest notification",
                  "MAYRA, turn on Do Not Disturb",
                  "MAYRA, set volume to 50%",
                ].map((cmd, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onExecuteDeviceCommand(cmd)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-emerald-300 transition-colors text-left"
                  >
                    "{cmd}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
