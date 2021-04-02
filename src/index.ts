import * as core from "@actions/core";
import { getIssueContent } from "./getIssueContent";
import { countKeywords } from "./countKeywords";
import { setIssueLabel } from "./setIssueLabel";
import { setIssueAssignee } from "./setIssueAssignee";

async function run() {
  try {
    core.setOutput("labeled", false.toString());
    core.setOutput("assigned", false.toString());
    const token = core.getInput("github-token");
    const content: string[] = await getIssueContent(token);
    let titleContent = content[0], bodyContent = content[1]
    const similarity = .125
    const excluded: string[] = core.getInput("excluded-expressions", {required: false}).replace(/\[|\]/gi, '').split('|');
    const parameters: { area: string, keywords: string[], labels: string[], assignees: string[] }[] = JSON.parse(
      core.getInput("parameters", {required: true})
    );
    if (!parameters) {
      core.setFailed(
        `parameters input not found. Make sure your ".yml" file contains a "parameters" JSON array like this:
        parameters: '[ {"keywords": ["bug", "error"], "labels": ["BUG"], "assignees": ["username"]}, {"keywords": ["help", "guidance"], "labels": ["help-wanted"], "assignees": ["username"]}]'`
      );
    }

    console.log(excluded)

    excluded.forEach(ex => {
      titleContent.replace(ex, '');
      bodyContent.replace(ex, '')
    });

    const winningArea = countKeywords(parameters, titleContent, bodyContent, similarity);

    if (winningArea === '') {
      console.log("Keywords not included in this issue");
      return;
    } else {
      setIssueLabel(token, winningArea, parameters);
      core.setOutput("labeled", true.toString());
  
      setIssueAssignee(token, winningArea, parameters);
      core.setOutput("assigned", true.toString());
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
