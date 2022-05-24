export function isEmptyObject(object:any){
  for (const e in object) {
    if(object[e]){
      return false;
    }
  };
  return true;
}