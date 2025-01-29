export const isValidResponse = (status: number): boolean => {
  return status >= 200 && status < 300;
};

export const fetchApi = async (apiUrl: string, options?: RequestInit) => {
  const resp = await fetch(apiUrl, options);
  const res = await resp.json();

  if (resp.status && !isValidResponse(resp.status)) {
    throw new Error();
  }

  return res;
};

export const queryFunctionFactory = (apiUrl: string) => {
  return async () => await fetchApi(apiUrl);
};
