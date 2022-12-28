import { useEffect, useState } from "react";
import type { Serie } from "@nivo/line";

export const completeTrafficApiUrl = "/api/analytics/traffic/complete/get";
export const weeklyTrafficApiUrl = "/api/analytics/traffic/weekly/get";

export declare namespace Traffic {
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

export interface UseTraffic {
  data: Serie[];
  traffic: Traffic.Return;
  loading: boolean;
  error: boolean;
}

export const useTraffic = (): UseTraffic => {
  const [data, setData] = useState<Serie[]>([]);
  const [traffic, setTraffic] = useState<Traffic.Return>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const fetchChangeLog = async () => {
      try {
        const completeTraffic: Response = await fetch(completeTrafficApiUrl);
        const completeData: any = await completeTraffic.json();

        const weeklyTraffic: Response = await fetch(weeklyTrafficApiUrl);
        const weeklyData: any = await weeklyTraffic.json();

        setData(() => [
          {
            id: "All",
            color: "#000000",
            data: weeklyData.map((item: any, index: number) => ({
              x: days[index],
              y: item.length
            }))
          },
          {
            id: "Unique",
            color: "#FFFFFF",
            data: weeklyData.map((item: any, index: number) => ({
              x: days[index],
              y: item.unique.length
            }))
          }
        ]);
        setTraffic({
          complete: completeData,
          weekly: weeklyData
        });
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchChangeLog();
  }, []);

  return { data, traffic, loading, error };
};