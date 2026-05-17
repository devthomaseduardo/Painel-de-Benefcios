export interface PaginationParams {
  page?: number;
  limit?: number;
}

export const getPagination = (params: PaginationParams) => {
  const page = params.page ? parseInt(params.page.toString()) : 1;
  const limit = params.limit ? parseInt(params.limit.toString()) : 10;
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    page,
    limit
  };
};
