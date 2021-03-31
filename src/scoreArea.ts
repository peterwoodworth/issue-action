export const scoreArea = (
    content: string,
    parameters: { area: string, keywords: string[], labels: string[], assignees: string[] }[],
    potentialAreas,
    usedKeywords
): { potentialAreas: Map<string, number>, usedKeywords: string[] } => {
  
  const POINT: number = 1
  const DEVALUE: number = .75;
  
  
  // Count keywords in each area by looking at each word in content and counting it to an area if it is a keyword of that area
  parameters.forEach(obj => {
    obj.keywords.forEach(keyword => {
      // TODO adjust (word === keyword) to be less picky (similar word library, regex, toLower, keyword in word)
      if(content === keyword && usedKeywords.includes(keyword)) {
        potentialAreas.has(obj.area) ?
          potentialAreas.set(obj.area, potentialAreas.get(obj.area)+DEVALUE) :
          potentialAreas.set(obj.area, POINT);
        return { potentialAreas, usedKeywords };
      } else if(content === keyword) {
        usedKeywords.push(content)
        potentialAreas.has(obj.area) ?
          potentialAreas.set(obj.area, potentialAreas.get(obj.area)+POINT) :
          potentialAreas.set(obj.area, POINT);
        return { potentialAreas, usedKeywords };
      }
    })
  })

  return { potentialAreas, usedKeywords };
}