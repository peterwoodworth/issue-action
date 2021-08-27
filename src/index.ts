import * as core from "@actions/core";
import { Issue } from './issue';
import { GithubApi } from './github';

async function run() {
  try {
    core.setOutput("labeled", false.toString());
    core.setOutput("assigned", false.toString());

    const token = core.getInput('github-token');
    const github: GithubApi = new GithubApi(token);
    const content: string[] = await github.getIssueContent();
    const issue: Issue = new Issue(content);

    const winningArea: string = issue.determineArea();

    if (winningArea === '') console.log("Keywords not included in this issue");
    else {
      github.setIssueAssignees(issue.parameters, winningArea);
      github.setIssueLabels(issue.parameters, winningArea);
      core.setOutput("labeled", true.toString());
      core.setOutput("assigned", true.toString());
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
