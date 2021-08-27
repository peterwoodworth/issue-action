import * as github from "@actions/github";
import * as core from '@actions/core'
import { IParameter } from './input'

export interface IRepo {
  owner: string;
  repo: string;
}

export class GithubApi {
  private octokit;
  private repo: IRepo
  private issueNumber: number | undefined

  constructor(token: string) {
    this.octokit = new github.GitHub(token)
    this.repo = github.context.repo
    if(github.context.payload.issue) this.issueNumber = github.context.payload.issue.number
      else if (github.context.payload.pull_request) this.issueNumber = github.context.payload.pull_request.number
      else core.setFailed(`Error retrieving issue number`)
  }

  public async setIssueAssignees(parameters: IParameter[], winningArea: string) {
    let assignees: string[] = [];

    parameters.forEach(obj => {
      if(winningArea == obj.area) {
        obj.assignees.forEach(assignee => {
          assignees.push(assignee);
        })
      }
    })
    
    await this.octokit.issues.addAssignees({
      ...this.repo,
      issue_number: this.issueNumber,
      assignees
    });
  }

  public async setIssueLabels(parameters: IParameter[], winningArea: string) {
    let labels: string[] = [];

    parameters.forEach(obj => {
      if(winningArea == obj.area) {
        obj.labels.forEach(label => {
          labels.push(label);
        })
      }
    })
    
    await this.octokit.issues.addLabels({
      ...this.repo,
      issue_number: this.issueNumber,
      labels
    });
  }

  public async getIssueContent(): Promise<string[]> { 
    let content: string[] = []
  
    const { data } = await this.octokit.issues.get({
      ...this.repo,
      issue_number: this.issueNumber,
    });
  
    content.push(data.title, data.body)
    return content;
  };
}
