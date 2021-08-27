import * as github from "@actions/github";
import { IParameter } from './issue'

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
    this.repo = this.getRepo()
    this.getIssueNumber() ? this.issueNumber = this.getIssueNumber() : this.getPrNumber()
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
      ...this.getRepo(),
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
      ...this.getRepo(),
      issue_number: this.issueNumber,
      labels
    });
  }

  public async getIssueContent(): Promise<string[]> { 
    let issue_number;
    let content: string[] = []
  
    if (this.getIssueNumber() !== undefined) {
      issue_number = this.getIssueNumber();
    } else if (this.getPrNumber() !== undefined) {
      issue_number = this.getPrNumber();
    } else {
      throw new Error("No Issue Provided");
    }
  
    const { data } = await this.octokit.issues.get({
      ...this.getRepo(),
      issue_number: this.issueNumber,
    });
  
    content.push(data.title, data.body)
    return content;
  };

  private getPrNumber(): number | undefined {
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
      return undefined;
    }
    return pullRequest.number;
  };

  private getIssueNumber(): number | undefined {
    const issue = github.context.payload.issue;
    if (!issue) {
      return undefined;
    }
    return issue.number;
  };
  
  private getRepo(): IRepo {
    const repo: IRepo = github.context.repo;
    return repo;
  };
}
