import * as core from "@actions/core";
import { Issue } from './issue';
import { GithubApi } from './github';
import { Input, IParameter } from './input';

async function run() {
  try {
    core.setOutput("labeled", false.toString());
    core.setOutput("assigned", false.toString());

    const input = new Input()
    const github: GithubApi = new GithubApi(input.token);
    const content: string[] = await github.getIssueContent();
    const issue = new Issue(content);
    const similarity: number = .125

    const winningArea = issue.determineArea(input.parameters, similarity);

    if (winningArea === '') {
      console.log("Keywords not included in this issue");
      return;
    } else {
      github.setIssueLabels(input.parameters, winningArea);
      core.setOutput("labeled", true.toString());
  
      github.setIssueAssignees(input.parameters, winningArea);
      core.setOutput("assigned", true.toString());
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
