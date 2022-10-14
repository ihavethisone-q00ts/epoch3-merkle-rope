import type { RopeLengthResponse } from "../util/types";
import { Card } from "./card";
import { fetcher } from "../util/helper";
import useSWR from "swr";

const ApiData = (): JSX.Element => {
  const { data, error } = useSWR<RopeLengthResponse>(
    "/api/rope-length",
    fetcher
  );
  if (error) {
    console.error(error);
    return <>Failed to load</>;
  }
  if (!data) return <>Loading...</>;

  return <>{data.ropeLength}</>;
};

export const RopeLength = (): JSX.Element => {
  return (
    <Card name="Rope Length">
      <ApiData />
    </Card>
  );
};
