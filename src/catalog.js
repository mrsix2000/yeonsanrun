export const AREAS = Object.freeze([
  {id:'natural',name:'자연수 연산',count:5},
  {id:'fraction',name:'분수 연산',count:6},
  {id:'decimal',name:'소수 연산',count:4},
  {id:'signed',name:'음수·유리수',count:5},
  {id:'powers',name:'거듭제곱·제곱근',count:4},
  {id:'algebra',name:'문자식 연산',count:4},
  {id:'equations',name:'방정식',count:3},
  {id:'factoring',name:'전개·인수분해',count:4}
]);
export const TOTAL_TYPES = AREAS.reduce((sum,area)=>sum+area.count,0);
