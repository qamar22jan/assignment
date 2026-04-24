import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ClipboardList,
  KeyRound,
  LogOut,
  Save,
  Search,
  Server,
  ShieldCheck,
  Users,
} from 'lucide-react';

interface AdminPageProps {
  onBack: () => void;
}

type AdminTab = 'api' | 'logs' | 'activity' | 'security';

interface ApiSettings {
  baseUrl: string;
  primaryModel: string;
  fallbackModel: string;
  maxTokens: number;
  temperature: number;
  enableLongForm: boolean;
  enableRateGuard: boolean;
}

interface LogItem {
  id: string;
  level: 'info' | 'warn' | 'error';
  source: string;
  message: string;
  timestamp: string;
}

interface UserActivity {
  id: string;
  user: string;
  action: string;
  page: string;
  durationSec: number;
  createdAt: string;
}

const TEST_ADMIN = {
  username: 'admin',
  password: 'Admin@123',
};

const defaultSettings: ApiSettings = {
  baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
  primaryModel: 'llama-3.1-8b-instant',
  fallbackModel: 'llama-3.3-70b-versatile',
  maxTokens: 8192,
  temperature: 0.3,
  enableLongForm: true,
  enableRateGuard: true,
};

const seedLogs: LogItem[] = [
  { id: 'l-1', level: 'info', source: 'assignment', message: 'Long-form generation request accepted', timestamp: '2026-04-25 09:14:12' },
  { id: 'l-2', level: 'warn', source: 'create', message: 'User near rate threshold for model llama-3.3-70b', timestamp: '2026-04-25 09:02:41' },
  { id: 'l-3', level: 'error', source: 'api', message: '429 from upstream provider; fallback model engaged', timestamp: '2026-04-25 08:57:03' },
  { id: 'l-4', level: 'info', source: 'security', message: 'Admin session created from localhost', timestamp: '2026-04-25 08:43:29' },
];

const seedActivity: UserActivity[] = [
  { id: 'u-1', user: 'student_102', action: 'Generated assignment', page: '/assignment-maker', durationSec: 312, createdAt: '2026-04-25 09:20:50' },
  { id: 'u-2', user: 'student_056', action: 'Switched create mode', page: '/create/presentation', durationSec: 94, createdAt: '2026-04-25 09:11:15' },
  { id: 'u-3', user: 'student_201', action: 'Downloaded document', page: '/assignment-maker', durationSec: 28, createdAt: '2026-04-25 09:05:02' },
  { id: 'u-4', user: 'student_056', action: 'Updated prompt and re-ran', page: '/create/document', durationSec: 147, createdAt: '2026-04-25 08:58:19' },
  { id: 'u-5', user: 'student_071', action: 'Opened create workspace', page: '/create/chat', durationSec: 63, createdAt: '2026-04-25 08:44:36' },
];

const tabs: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'api', label: 'API Settings', icon: Server },
  { id: 'logs', label: 'System Logs', icon: ClipboardList },
  { id: 'activity', label: 'User Activity', icon: Users },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [tab, setTab] = useState<AdminTab>('api');
  const [settings, setSettings] = useState<ApiSettings>(defaultSettings);
  const [savedBanner, setSavedBanner] = useState('');
  const [logQuery, setLogQuery] = useState('');
  const [activityQuery, setActivityQuery] = useState('');

  const [logs] = useState<LogItem[]>(seedLogs);
  const [activity] = useState<UserActivity[]>(seedActivity);

  const filteredLogs = useMemo(() => {
    const q = logQuery.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter((l) =>
      `${l.source} ${l.level} ${l.message} ${l.timestamp}`.toLowerCase().includes(q)
    );
  }, [logs, logQuery]);

  const filteredActivity = useMemo(() => {
    const q = activityQuery.trim().toLowerCase();
    if (!q) return activity;
    return activity.filter((row) =>
      `${row.user} ${row.action} ${row.page} ${row.createdAt}`.toLowerCase().includes(q)
    );
  }, [activity, activityQuery]);

  const onLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (username === TEST_ADMIN.username && password === TEST_ADMIN.password) {
      setIsAuth(true);
      setAuthError('');
      return;
    }
    setAuthError('Invalid admin credentials. Use the test credentials shown below.');
  };

  const saveSettings = () => {
    setSavedBanner('Settings saved locally for this session.');
    window.setTimeout(() => setSavedBanner(''), 2200);
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#e9ecef] bg-white p-6 shadow-[0_16px_42px_rgba(0,0,0,0.08)]">
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[#6c757d] hover:bg-[#f1f3f5]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-2xl font-bold text-[#1a1a1c]">Admin Access</h1>
          <p className="mt-1 text-sm text-[#6c757d]">Sign in to manage API handling, logs, and user activity.</p>

          <form className="mt-6 space-y-4" onSubmit={onLogin}>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6c757d]">Username</label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="h-11 w-full rounded-xl border border-[#e9ecef] px-3 text-sm outline-none focus:border-[#984eff]"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6c757d]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-xl border border-[#e9ecef] px-3 text-sm outline-none focus:border-[#984eff]"
                placeholder="Enter password"
              />
            </div>

            {authError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-[#1a1a1c] text-sm font-semibold text-white hover:bg-black"
            >
              Login
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-[#e9ecef] bg-[#f8f9fa] p-3 text-xs text-[#495057]">
            <p className="font-semibold">Test Credentials</p>
            <p className="mt-1">Username: admin</p>
            <p>Password: Admin@123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header className="sticky top-0 z-20 border-b border-[#e9ecef] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} className="rounded-lg p-2 text-[#6c757d] hover:bg-[#f1f3f5]">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <p className="text-sm font-semibold text-[#1a1a1c]">Admin Console</p>
              <p className="text-xs text-[#6c757d]">Control API behavior, logs, and user activity</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAuth(false)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e9ecef] px-3 py-1.5 text-xs font-semibold text-[#495057] hover:bg-[#f1f3f5]"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-5 px-4 py-5 md:grid-cols-[240px_minmax(0,1fr)] md:px-6">
        <aside className="rounded-xl border border-[#e9ecef] bg-white p-2">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = item.id === tab;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  active ? 'bg-[#f4ebf9] text-[#7c2ef4] font-semibold' : 'text-[#495057] hover:bg-[#f8f9fa]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </aside>

        <main className="rounded-xl border border-[#e9ecef] bg-white p-4 md:p-5">
          {tab === 'api' && (
            <div>
              <h2 className="text-lg font-bold text-[#1a1a1c]">API Handling</h2>
              <p className="mt-1 text-sm text-[#6c757d]">Central place for provider endpoint, model strategy, and generation policies.</p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-[#6c757d]">Base URL</label>
                  <input
                    value={settings.baseUrl}
                    onChange={(event) => setSettings((s) => ({ ...s, baseUrl: event.target.value }))}
                    className="h-10 w-full rounded-lg border border-[#e9ecef] px-3 text-sm outline-none focus:border-[#984eff]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-[#6c757d]">Primary Model</label>
                  <input
                    value={settings.primaryModel}
                    onChange={(event) => setSettings((s) => ({ ...s, primaryModel: event.target.value }))}
                    className="h-10 w-full rounded-lg border border-[#e9ecef] px-3 text-sm outline-none focus:border-[#984eff]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-[#6c757d]">Fallback Model</label>
                  <input
                    value={settings.fallbackModel}
                    onChange={(event) => setSettings((s) => ({ ...s, fallbackModel: event.target.value }))}
                    className="h-10 w-full rounded-lg border border-[#e9ecef] px-3 text-sm outline-none focus:border-[#984eff]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-[#6c757d]">Max Tokens</label>
                  <input
                    type="number"
                    value={settings.maxTokens}
                    onChange={(event) => setSettings((s) => ({ ...s, maxTokens: Number(event.target.value || 0) }))}
                    className="h-10 w-full rounded-lg border border-[#e9ecef] px-3 text-sm outline-none focus:border-[#984eff]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-[#6c757d]">Temperature ({settings.temperature.toFixed(2)})</label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={settings.temperature}
                    onChange={(event) => setSettings((s) => ({ ...s, temperature: Number(event.target.value) }))}
                    className="w-full accent-[#984eff]"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-[#495057]">
                  <input
                    type="checkbox"
                    checked={settings.enableLongForm}
                    onChange={(event) => setSettings((s) => ({ ...s, enableLongForm: event.target.checked }))}
                  />
                  Enable long-form continuation
                </label>
                <label className="flex items-center gap-2 text-sm text-[#495057]">
                  <input
                    type="checkbox"
                    checked={settings.enableRateGuard}
                    onChange={(event) => setSettings((s) => ({ ...s, enableRateGuard: event.target.checked }))}
                  />
                  Enable rate-limit guard
                </label>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={saveSettings}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1a1a1c] px-4 py-2 text-sm font-semibold text-white hover:bg-black"
                >
                  <Save className="h-4 w-4" />
                  Save Settings
                </button>
                {savedBanner && <span className="text-xs text-emerald-600">{savedBanner}</span>}
              </div>
            </div>
          )}

          {tab === 'logs' && (
            <div>
              <h2 className="text-lg font-bold text-[#1a1a1c]">System Logs</h2>
              <p className="mt-1 text-sm text-[#6c757d]">Inspect runtime events and generation issues.</p>

              <div className="mt-4 relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#adb5bd]" />
                <input
                  value={logQuery}
                  onChange={(event) => setLogQuery(event.target.value)}
                  placeholder="Search logs by level, source, or message"
                  className="h-10 w-full rounded-lg border border-[#e9ecef] pl-9 pr-3 text-sm outline-none focus:border-[#984eff]"
                />
              </div>

              <div className="mt-4 overflow-x-auto rounded-lg border border-[#e9ecef]">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-[#f8f9fa] text-xs uppercase tracking-wide text-[#6c757d]">
                    <tr>
                      <th className="px-3 py-2">Time</th>
                      <th className="px-3 py-2">Level</th>
                      <th className="px-3 py-2">Source</th>
                      <th className="px-3 py-2">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-t border-[#eef0f2]">
                        <td className="px-3 py-2 text-[#495057]">{log.timestamp}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              log.level === 'error'
                                ? 'bg-red-100 text-red-700'
                                : log.level === 'warn'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {log.level}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-[#495057]">{log.source}</td>
                        <td className="px-3 py-2 text-[#212529]">{log.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'activity' && (
            <div>
              <h2 className="text-lg font-bold text-[#1a1a1c]">Users Activity</h2>
              <p className="mt-1 text-sm text-[#6c757d]">Monitor how users interact with Create and Assignment tools.</p>

              <div className="mt-4 relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#adb5bd]" />
                <input
                  value={activityQuery}
                  onChange={(event) => setActivityQuery(event.target.value)}
                  placeholder="Search by user, action, or page"
                  className="h-10 w-full rounded-lg border border-[#e9ecef] pl-9 pr-3 text-sm outline-none focus:border-[#984eff]"
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                {filteredActivity.map((row) => (
                  <div key={row.id} className="rounded-lg border border-[#e9ecef] p-3">
                    <p className="text-sm font-semibold text-[#1a1a1c]">{row.user}</p>
                    <p className="mt-1 text-sm text-[#495057]">{row.action}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#6c757d]">
                      <span className="rounded-full bg-[#f1f3f5] px-2 py-0.5">{row.page}</span>
                      <span>{row.durationSec}s</span>
                      <span>{row.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div>
              <h2 className="text-lg font-bold text-[#1a1a1c]">Security</h2>
              <p className="mt-1 text-sm text-[#6c757d]">Credentials, token handling, and admin session controls.</p>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-[#e9ecef] bg-[#f8f9fa] p-4">
                  <KeyRound className="h-5 w-5 text-[#7c2ef4]" />
                  <p className="mt-2 text-sm font-semibold text-[#1a1a1c]">API Keys</p>
                  <p className="mt-1 text-xs text-[#6c757d]">Rotation policy every 30 days (test policy).</p>
                </div>
                <div className="rounded-lg border border-[#e9ecef] bg-[#f8f9fa] p-4">
                  <Activity className="h-5 w-5 text-[#7c2ef4]" />
                  <p className="mt-2 text-sm font-semibold text-[#1a1a1c]">Audit Trail</p>
                  <p className="mt-1 text-xs text-[#6c757d]">All admin writes logged with timestamp and origin.</p>
                </div>
                <div className="rounded-lg border border-[#e9ecef] bg-[#f8f9fa] p-4">
                  <ShieldCheck className="h-5 w-5 text-[#7c2ef4]" />
                  <p className="mt-2 text-sm font-semibold text-[#1a1a1c]">Session Guard</p>
                  <p className="mt-1 text-xs text-[#6c757d]">Auto logout after 15 minutes idle (planned backend rule).</p>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-[#e9ecef] p-3 text-xs text-[#495057]">
                <p className="font-semibold">Current Test Credentials</p>
                <p className="mt-1">Username: admin</p>
                <p>Password: Admin@123</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
