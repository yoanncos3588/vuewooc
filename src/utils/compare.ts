import { UrlParams } from "../types/apiParams";

/**
 * test if params already exist in an array
 * @param source : list of previously called params
 * @param compare : param to be called
 * @returns {boolean} true if param exist in the source list
 */
export function sameParams(source: UrlParams[], compare: UrlParams): boolean {
  const result = source.find((param) => {
    const keySource = Object.keys(param)[0];
    const keyCompare = Object.keys(compare)[0];

    return keySource === keyCompare && param[keySource] === compare[keyCompare];
  });

  return result ? true : false;
}
