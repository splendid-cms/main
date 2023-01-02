import { useEffect, useState } from "react";

export const changeLogApiUrl = "/api/dashboard/changelog";
export const overviewApiUrl = "/api/dashboard/overview";

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

  return [ changeLog, loading, error ];
};

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

  return [ overview, loading, error ];
};