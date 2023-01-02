declare namespace Traffic {
  interface Data {
    timestamp: Date;
    ip: string;
    path: string;
  }

  interface Parsed {
    length: number;
    traffic: Data[];
    unique: {
      length: number;
      visitors: number;
      traffic: Data[];
    };
  }

  interface Return {
    complete: Parsed;
    weekly: Parsed[];
  }
}

type UseTraffic = [
  Serie[],
  Traffic.Return,
  boolean,
  boolean
]

interface Count {
  [key: string]: number;
}

type UseSecurity = [
  string[],
  boolean,
  boolean
]

type UseIPs = [
  (ips: string[]) => Promise<void>,
  (ips: string[]) => Promise<void>,
  (ips: string[]) => Promise<void>,
  (ips: string[]) => Promise<void>,
  string[],
  string[],
  boolean,
  boolean
]