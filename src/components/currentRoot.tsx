import type { CurrentRootResponse } from "../util/types";
import { Card } from "./card";
import { fetcher } from "../util/helper";
import useSWR from "swr";

const ApiData = (): JSX.Element => {
  const { data, error } = useSWR<CurrentRootResponse>(
    "/api/current-root",
    fetcher
  );
  if (error) {
    console.error(error);
    return <>Failed to load</>;
  }
  if (!data) return <>Loading...</>;

  return <>{data.currentRoot}</>;
};

export const CurrentRoot = (): JSX.Element => {
  return (
    <Card name="Current Root" mobileHidden>
      <ApiData />
    </Card>
  );
};
