# Issue Action

Github action for automatically adding label and/or setting assignee when an Issue or PR is opened or edited.

## Usage

#### Parameters

Automatically set `BUG` label and assign `@peterwoodworth` when Issue contains `bug` or `error`.
Automatically set `help-wanted` label and assign `@woodwoop` when Issue contains `help` or `guidance`.

### Example

```yaml
name: "Set Issue Label and Assignee"
on:
  issues:
    types: [opened]
  pull_request:
    typed: [opened]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: peterwoodworth/issue-action@main
        with:
          parameters: '[ {"area":"Bug", "keywords": ["bug", "error"], "labels": ["BUG"], "assignees": ["peterwoodworth"]}, {"area": "Guidance", "keywords": ["help", "guidance"], "labels": ["help-wanted"], "assignees": ["woodwoop"]}]'
          github-token: "${{ secrets.GITHUB_TOKEN }}"
          excluded-expressions: "[ TypeScript | Java | Python ]"
```
