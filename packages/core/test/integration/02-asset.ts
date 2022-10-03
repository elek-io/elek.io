import { describe, it } from 'mocha';
import { expect } from 'chai';
import Path from 'path';
import core from '../00-setup.js';
import Asset from '../../src/model/Asset.js';
import Project from '../../src/model/Project.js';

describe('Asset', async () => {
  let project: Project;
  let asset: Asset;

  const assetFilePath = Path.resolve('test/data/150x150.png');
  const assetName = 'elek.io';
  const assetDescription = 'A 150x150 image of the text "elek.io"';
  const assetLanguage = 'en';

  beforeEach(async () => {
    project = await core.projects.create('Project #1', 'The first project')
  });

  it('create', async () => {
    asset = await core.assets.create(
      assetFilePath,
      project.id,
      assetLanguage,
      assetName,
      assetDescription
    );

    expect(asset.name).to.equal(assetName);
    expect(asset.description).to.equal(assetDescription);
  });

  // it('read', async () => {
  //   const readAsset = await core.assets.read(project.id, asset.id, assetLanguage);

  //   expect(readAsset.name).to.equal(assetName);
  //   expect(readAsset.description).to.equal(assetDescription);
  // })

  // it('update', async () => {
  //   asset.description = 'Updated';
  //   await core.assets.update(project.id, asset);
  //   const updatedAsset = await core.assets.read(project.id, asset.id, assetLanguage);
  //   expect(updatedAsset.description).to.equal('Updated');

  //   asset.description = assetDescription;
  //   await core.assets.update(project.id, asset);
  //   const updatedAsset2 = await core.assets.read(project.id, asset.id, assetLanguage);
  //   expect(updatedAsset2.description).to.equal(assetDescription);
  // })

  // it('delete', async () => {
  //   await core.assets.delete(project.id, asset.id, assetLanguage);
  // })
});
