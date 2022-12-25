import { useEffect, useState } from "react";

export const changeLogApiUrl = "/api/dashboard/changelog/get";
export const overviewApiUrl = "/api/dashboard/overview/get";

export interface UseChangeLog {
  changeLog: ChangeLog[];
  loading: boolean;
  error: boolean;
}

export interface ChangeLog {
  name: string;
  body: {
    markdown: string;
    html: string;
  };
}

export const useChangeLog = (): UseChangeLog => {
  const [changeLog, setChangeLog] = useState<ChangeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchChangeLog = async () => {
      try {
        const response: Response = await fetch(changeLogApiUrl);
        const data: any = await response.json();

        setChangeLog(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchChangeLog();
  }, []);

  return { changeLog, loading, error };
};

export interface UseOverview {
  overview: Overview;
  loading: boolean;
  error: boolean;
}

export interface Overview {
  body: {
    markdown: string;
    html: string;
  };
}

export const useOverview = (): UseOverview => {
  const [overview, setOverview] = useState<Overview>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response: Response = await fetch(overviewApiUrl);
        const data: any = await response.json();
        setOverview(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      };
    };
    fetchOverview();
  }, []);

  return { overview, loading, error };
};