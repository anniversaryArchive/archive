import { createClient, defaultPlugins, FetchOptions } from 'villus';

const host: string = `${import.meta.env.VITE_API_URL}/graphql`;

function authPlugin({ opContext }: { opContext: FetchOptions }) {
  const token: string | null = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY);
  if (token) { opContext.headers.Authorization = `Bearer ${token}`; }
}

const client = createClient({
  url: host,
  use: [authPlugin, ...defaultPlugins()],
});

export default client;
