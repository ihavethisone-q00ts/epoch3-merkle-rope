// export const fetcher = <T>(...args: any[]) => fetch([...args]).then((res) => res.json());

export async function fetcher<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  return await response.json();
}
