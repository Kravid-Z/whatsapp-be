declare module "query-to-mongo" {
  function q2m(query: object): {
    criteria: object;
    options: {
      skip: number;
      limit: number;
      sort: object;
      fields: any;
    };
    links: (
      path: string,
      total: number
    ) => {
      prev?: string;
      next?: string;
      first?: string;
      last?: string;
    };
  };
  export = q2m;
}
