import { describe, it } from 'mocha';
import { expect } from 'chai';
import core from '../setup.js';
import Project from '../../src/model/Project.js';

describe('Project', () => {
  let project: Project;

  it('create', async () => {
    project = await core.projects.create('Project #1', 'The first project');

    expect(project.name).to.equal('Project #1');
    expect(project.description).to.equal('The first project');
  });

  it('read', async () => {
    const readProject = await core.projects.read(project.id);

    expect(readProject.name).to.equal('Project #1');
    expect(readProject.description).to.equal('The first project');
  });

  it('update', async () => {
    project.description = 'A generic description of the project';
    await core.projects.update(project);
    const updatedProject = await core.projects.read(project.id);

    expect(updatedProject.name).to.equal('Project #1');
    expect(updatedProject.description).to.equal(
      'A generic description of the project'
    );
  });

  it('delete', async () => {
    await core.projects.delete(project.id);
  });
});