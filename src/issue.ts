import * as core from "@actions/core";
import levenshtein from 'js-levenshtein';
import { IParameter } from './input'

export class Issue {
  private title: string;
  private body: string;

  constructor(content: string[]) {
    this.title = content[0];
    this.body = content[1];

    const excluded: string[] = core.getInput("excluded-expressions", {required: false}).replace(/\[|\]/gi, '').split('|');
    excluded.forEach(ex => {
      this.title.replace(ex, '');
      this.body.replace(ex, '')
    });
  }

  public determineArea(parameters: IParameter[], similarity: number, bodyValue: number): string {
    let titleIssueWords = this.title.split(/ |\./);
    let bodyIssueWords = this.body.split(/ |\./)
    let titleValue: number = 1
    let x: number = 1;
    let potentialAreas: Map<string, number> = new Map()
      
    // For each word in the title, check if it matches any keywords. If it does, add decreasing score based on inverse function to the area keyword is in.
    titleIssueWords.forEach(content => {
      potentialAreas = this.scoreArea(content, parameters, potentialAreas, titleValue, similarity);
      ++x
      titleValue = (2/(1+x))
    })
      
    // Add static value to area keyword is in if keyword is found in body
    bodyIssueWords.forEach(content => {
      potentialAreas = this.scoreArea(content, parameters, potentialAreas, bodyValue, similarity);
    })
      
    console.log(...potentialAreas)

    let winningArea = '';
    let winners: Map<string,number> = new Map();
    for (let area of potentialAreas.entries()) {
      if(winners.size === 0) {
        winners.set(area[0], area[1]);
      } else if (area[1] > winners.values().next().value) {
        winners = new Map();
        winners.set(area[0], area[1]);
      } else if (area[1] === winners.values().next().value) {
        winners.set(area[0], area[1]);
      }
    }
    // tiebreaker goes to the area with more *exact* keyword matches
    if(winners.size > 1 && similarity !== 0) {
      winningArea = this.determineArea(parameters, 0, bodyValue);
    } else if (winners.size > 0) {
      winningArea = winners.keys().next().value;
    } 
      
    winningArea = winners.keys().next().value;
      
    return winningArea;
  }

  private scoreArea(content: string, parameters: IParameter[], potentialAreas: Map<string, number>, reducedValue, similarity: number): Map<string, number> {
    parameters.forEach(obj => {
      obj.keywords.forEach(keyword => {
        if(this.similarStrings(content, keyword, similarity)) {
          potentialAreas.has(obj.area) ?
            potentialAreas.set(obj.area, potentialAreas.get(obj.area)+reducedValue) :
            potentialAreas.set(obj.area, reducedValue);
        }    
      })
    })    
    return potentialAreas;
  }

  private similarStrings(str1: string, str2: string, similarity: number = 0): boolean {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
        
    // Regex for removing punctuation and replacing with empty string
    str1 = str1.replace(/ |_|-|\(|\)|:|\[|\]|	|\./gi, '');
    str2 = str2.replace(/ |_|-|\(|\)|:|\[|\]|	|\./gi, '');
      
    // levenshtein returns a value between 0 and the length of the strings being compared. This
    // represents the number of character differences between compared strings. We compare this
    // with a set percentage of the average length of said strings
    if(levenshtein(str1, str2) <= ((str1.length + str2.length) / 2) * similarity)
      return true;
    else
      return false;
  }
}