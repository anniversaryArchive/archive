import { useQuery, useMutation, MutationResult, BaseQueryApi } from 'villus';
import { DocumentNode } from 'graphql';

export const query = (query: DocumentNode, variables: object = {}, cache: boolean = true): Promise<BaseQueryApi<any, object>> => {
  return new Promise((resolve, reject) => {
    useQuery({
      query,
      variables,
      cachePolicy: cache ? 'cache-first' : 'network-only',
    }).then((resp: BaseQueryApi<any, object>) => {
      resolve(resp);
    }).catch((error: any) => reject(error));
  });
}

export const mutate = async (mutation: DocumentNode, variables: Record<string, any>): Promise<MutationResult<any>> => {
  try {
    const { execute } = useMutation(mutation);
    return execute(variables);
  } catch (e) {
    onNetworkError(e);
    // TODO: Error
    return { data: undefined, error: null };
  }
}

export const onNetworkError = (e: any) => {
  // graphql network에서 문제가 생긴 상황
  console.log('exception json:', JSON.stringify(e));
  // const exception = useExceptionStore();
  // exception.assign(110, 'Network error');
}
