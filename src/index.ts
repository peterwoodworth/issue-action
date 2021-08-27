import * as core from "@actions/core";
import { Issue, IParameter } from './issue';
import { GithubApi } from './github';

async function run() {
  try {
    core.setOutput("labeled", false.toString());
    core.setOutput("assigned", false.toString());
    const token = core.getInput("github-token");
    const github: GithubApi = new GithubApi(token);
    const content: string[] = await github.getIssueContent();
    const issue = new Issue(content);
    const similarity: number = .125 // Change this to be user input
    const parameters: IParameter[] = JSON.parse(
      core.getInput("parameters", {required: true})
    );
    if (!parameters) {
      core.setFailed(
        `parameters input not found. Make sure your ".yml" file contains a "parameters" JSON array like this:
        parameters: '[ {"keywords": ["bug", "error"], "labels": ["BUG"], "assignees": ["username"]}, {"keywords": ["help", "guidance"], "labels": ["help-wanted"], "assignees": ["username"]}]'`
      );
    }

    const winningArea = issue.determineArea(parameters, similarity);

    if (winningArea === '') {
      console.log("Keywords not included in this issue");
      return;
    } else {
      github.setIssueLabels(parameters, winningArea);
      core.setOutput("labeled", true.toString());
  
      github.setIssueAssignees(parameters, winningArea);
      core.setOutput("assigned", true.toString());
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
