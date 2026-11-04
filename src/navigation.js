export const ROUTES=Object.freeze(['home','practice','history']);
export function normalizeRoute(hash=''){
  const route=String(hash).replace(/^#/,'');
  return ROUTES.includes(route)?route:'home';
}
