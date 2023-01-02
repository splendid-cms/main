import { useEffect, useState } from "react";
import type { Serie } from "@nivo/line";

export const apiUrl = {
  traffic: {
    complete: "/api/analytics/traffic/complete",
    weekly: "/api/analytics/traffic/weekly",
  },
  security: {
    blocked: "/api/analytics/security/ips/blocked",
    whitelisted: "/api/analytics/security/ips/whitelisted",
    block: "/api/analytics/security/ips/block",
    whitelist: "/api/analytics/security/ips/whitelist",
    unblock: "/api/analytics/security/ips/unblock",
    unwhitelist: "/api/analytics/security/ips/unwhitelist",
  },
};

// Count the number of occurrences of each ip in an array
const count = (ip: string[]): Count =>
  ip.reduce((a, b) => ({ ...a, [b]: (a[b] || 0) + 1 }), {});

// Get duplicates from a count object
// Yes, dictionary is a better name, but I'm not a fan of it
const duplicates = (dict: Count): string[] =>
  Object.keys(dict).filter((a) => dict[a] > 100);

export const useTraffic = (): UseTraffic => {
  const [data, setData] = useState<Serie[]>([]);
  const [traffic, setTraffic] = useState<Traffic.Return>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const fetchChangeLog = async () => {
      try {
        const completeTraffic: Response = await fetch(apiUrl.traffic.complete);
        const completeData: any = await completeTraffic.json();

        const weeklyTraffic: Response = await fetch(apiUrl.traffic.weekly);
        const weeklyData: any = await weeklyTraffic.json();

        setData(() => [
          {
            id: "All",
            color: "#000000",
            data: weeklyData.map((item: Traffic.Parsed, index: number) => ({
              x: days[index],
              y: item.length,
            })),
          },
          {
            id: "Unique",
            color: "#FFFFFF",
            data: weeklyData.map((item: Traffic.Parsed, index: number) => ({
              x: days[index],
              y: item.unique.length,
            })),
          },
        ]);
        setTraffic({
          complete: completeData,
          weekly: weeklyData,
        });
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchChangeLog();
  }, []);

  return [data, traffic, loading, error];
};

export const useSecurity = (): UseSecurity => {
  const [_, traffic, trafficLoading, trafficError] = useTraffic();
  const [loading, setLoading] = useState<boolean>(trafficLoading);
  const [error, setError] = useState<boolean>(trafficError);
  const [suspects, setSuspects] = useState<string[]>([]);

  useEffect(() => {
    try {
      if (!traffic) return;
      traffic.weekly.forEach((item) => {
        const ips: string[] = item.traffic.map((traffic) => traffic.ip);
        const cleanIPs: string[] = ips.filter((ip) => ip !== "127.0.0.1");
        const duplicateIPs: string[] = duplicates(count(cleanIPs));
        setSuspects((suspects) => [...suspects, ...duplicateIPs]);
      });
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setSuspects((suspects) =>
        suspects.filter((item, index) => suspects.indexOf(item) === index)
      );
      setLoading(false);
    }
  }, [trafficLoading]);

  return [suspects, loading, error];
};

export const useIPs = (): UseIPs => {
  const [blocked, setBlocked] = useState<string[]>([]);
  const [whitelisted, setWhitelisted] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const block = async (ips: string[]): Promise<void> => {
    const response: Response = await fetch(apiUrl.security.block, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ips),
    });
    const data: any = await response.json();
    if (data?.statusCode === 400) {
      setError(true);
      return;
    }
    const dataMap: string[] = data.map((ip: any) => ip.ip);
    const blockedIPs: string[] = [...blocked, ...dataMap];
    setBlocked(() =>
      blockedIPs.filter((ip, i) => blockedIPs.indexOf(ip) === i)
    );
  };

  const unblock = async (ips: string[]): Promise<void> => {
    const response: Response = await fetch(apiUrl.security.unblock, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ips),
    });
    const data: any = await response.json();
    if (data?.statusCode === 400) {
      setError(true);
      return;
    }
    setBlocked((blocked) => blocked.filter((ip) => !ips.includes(ip)));
  };

  const whitelist = async (ips: string[]): Promise<void> => {
    const response: Response = await fetch(apiUrl.security.whitelist, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ips),
    });
    const data: any = await response.json();
    if (data?.statusCode === 400) {
      setError(true);
      return;
    }
    const dataMap: string[] = data.map((ip: any) => ip.ip);
    const whitelistedIPs: string[] = [...whitelisted, ...dataMap];
    setWhitelisted(() =>
      whitelistedIPs.filter((ip, i) => whitelistedIPs.indexOf(ip) === i)
    );
  };

  const unwhitelist = async (ips: string[]): Promise<void> => {
    const response: Response = await fetch(apiUrl.security.unwhitelist, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ips),
    });
    const data: any = await response.json();
    if (data?.statusCode === 400) {
      setError(true);
      return;
    }
    setWhitelisted((whitelisted) =>
      whitelisted.filter((ip) => !ips.includes(ip))
    );
  };

  useEffect(() => {
    const fetchIPs = async () => {
      try {
        const blocked: Response = await fetch(apiUrl.security.blocked);
        const blockedData: any = await blocked.json();

        const whitelisted: Response = await fetch(apiUrl.security.whitelisted);
        const whitelistedData: any = await whitelisted.json();

        setBlocked(blockedData.map((ip: any) => ip.ip));
        setWhitelisted(whitelistedData.map((ip: any) => ip.ip));
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchIPs();
  }, []);

  return [
    block,
    unblock,
    whitelist,
    unwhitelist,
    blocked,
    whitelisted,
    loading,
    error,
  ];
};
