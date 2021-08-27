import * as core from '@actions/core';

export interface IParameter {
    area: string;
    keywords: string[];
    labels: string[];
    assignees: string[];
}

export class Input {
    public token: string;

    public parameters: IParameter[]

    public similarity?: number

    constructor() {
        this.token = core.getInput("github-token");

        this.parameters = JSON.parse(
            core.getInput("parameters", {required: true})
        );

        this.similarity = +core.getInput("similarity", {required: false})
    }
}