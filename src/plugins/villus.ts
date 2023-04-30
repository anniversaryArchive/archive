import { createClient, defaultPlugins, FetchOptions } from 'villus';

const host: string = 'http://localhost:3000/graphql';

function authPlugin({ opContext }: { opContext: FetchOptions }) {
  const token: string | null = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY);
  if (token) { opContext.headers.Authorization = `Bearer ${token}`; }
}

const client = createClient({
  url: host,
  use: [authPlugin, ...defaultPlugins()],
});

export default client;
