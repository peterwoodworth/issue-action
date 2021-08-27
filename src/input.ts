import * as core from '@actions/core';



export class Input {
  public token: string;
  public similarity: number
  public bodyValue: number

  constructor() {
    this.token = core.getInput("github-token");
    this.similarity = +core.getInput("similarity", {required: false})
    this.bodyValue = +core.getInput("body-value", {required: false})
  }
}