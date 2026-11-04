export const ROUTES=Object.freeze(['home','practice','history','plans','auth']);
export function normalizeRoute(hash=''){
  const route=String(hash).replace(/^#/,'');
  return ROUTES.includes(route)?route:'home';
}
