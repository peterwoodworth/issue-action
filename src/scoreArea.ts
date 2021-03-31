export const scoreArea = (
    content: string,
    parameters: { area: string, keywords: string[], labels: string[], assignees: string[] }[],
    potentialAreas
): Map<string, number> => {

    const POINT = 1;

    parameters.forEach(obj => {
      obj.keywords.forEach(keyword => {
        // TODO adjust (word === keyword) to be less picky (similar word library, regex, toLower)
        if(content === keyword) {
          potentialAreas.has(obj.area) ?
            potentialAreas.set(obj.area, potentialAreas.get(obj.area)+POINT) :
            potentialAreas.set(obj.area, POINT);
          return potentialAreas;
        }    
      })
    })

    return potentialAreas;
}