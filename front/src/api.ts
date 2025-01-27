export const isValidResponse = (status: number): boolean => {
  return status >= 200 && status < 300;
};

export const queryFunctionFactory = (apiUrl: string) => {
  return async () => {
    const resp = await fetch(apiUrl);
    const res = await resp.json();

    if (res.status && isValidResponse(res.status)) {
      throw new Error();
    }

    return res;
  };
};
