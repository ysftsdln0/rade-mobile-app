// MonitoringProvider.ts
// Sunucu / hosting kaynak kullanımı & metric toplama servis soyutlaması
// Gerçek implementasyonda: Prometheus / custom agent API / 3rd party provider

export interface ServerMetricSnapshot {
  timestamp: number; // ms epoch
  cpuUsage: number; // 0-100
  ramUsage: number; // 0-100
  diskUsage: number; // 0-100
  networkIn: number; // kB/s
  networkOut: number; // kB/s
  uptime: number; // seconds
}

export interface LiveMonitoringStreamOptions {
  intervalMs?: number;
  onData: (snapshot: ServerMetricSnapshot) => void;
}

export interface IMonitoringProvider {
  getLatest(serverId: string): Promise<ServerMetricSnapshot>;
  getHistory(serverId: string, from: number, to: number): Promise<ServerMetricSnapshot[]>;
  stream(serverId: string, options: LiveMonitoringStreamOptions): { stop: () => void };
}

class MockMonitoringProvider implements IMonitoringProvider {
  private generate(serverId: string): ServerMetricSnapshot {
    const base = serverId.charCodeAt(0) % 40; // deterministic-ish
    return {
      timestamp: Date.now(),
      cpuUsage: Math.min(100, base + Math.random() * 60),
      ramUsage: Math.min(100, 30 + Math.random() * 50),
      diskUsage: Math.min(100, 50 + Math.random() * 30),
      networkIn: Math.random() * 500,
      networkOut: Math.random() * 500,
      uptime: Math.floor(Math.random() * 86400),
    };
  }

  async getLatest(serverId: string): Promise<ServerMetricSnapshot> {
    return this.generate(serverId);
  }

  async getHistory(serverId: string, from: number, to: number): Promise<ServerMetricSnapshot[]> {
    const points: ServerMetricSnapshot[] = [];
    const step = Math.max(60000, Math.floor((to - from) / 30));
    for (let t = from; t <= to; t += step) {
      const snap = this.generate(serverId);
      snap.timestamp = t;
      points.push(snap);
    }
    return points;
  }

  stream(serverId: string, options: LiveMonitoringStreamOptions) {
    const interval = options.intervalMs || 5000;
    const id = setInterval(() => {
      options.onData(this.generate(serverId));
    }, interval);
    return { stop: () => clearInterval(id) };
  }
}

export const monitoringProvider: IMonitoringProvider = new MockMonitoringProvider();
