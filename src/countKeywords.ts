import { scoreArea } from './scoreArea'

export const countKeywords = (
  parameters: { area: string, keywords: string[], labels: string[], assignees: string[] }[],
  content: string
): string => {

  let potentialAreas: Map<string, number> = new Map();
  let issueWords = content.split(" ");
  let usedKeywords: string[] = [];
  let dataContainer = {potentialAreas, usedKeywords}

  // Count keywords in each area by looking at each word in content and counting it to an area if it is a keyword of that area
  issueWords.forEach(content => {
    dataContainer = scoreArea(content, parameters, dataContainer.potentialAreas, dataContainer.usedKeywords);
  })

  // Determine which area has the most matches
  let winningArea = '';
  let max = 0;
  for (let area of potentialAreas.entries()) {
    if (area[1] > max) {
      winningArea = area[0]
      max = area[1]
    }
  }

  return winningArea;
}