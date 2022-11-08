import { describe, it } from 'mocha';
import { expect } from 'chai';
import Path from 'path';
import Fs from 'fs-extra';
import core from '../setup.js';
import util from '../../src/util/index.js';

describe('Asset', async () => {
  const assetFilePath = Path.resolve('test/data/150x150.png');
  const assetName = 'elek.io';
  const assetDescription = 'A 150x150 image of the text "elek.io"';
  const assetLanguage = 'en';

  it('create', async () => {
    const project = await core.projects.create(
      'Project #1',
      'The first project'
    );
    const asset = await core.assets.create(
      assetFilePath,
      project.id,
      assetLanguage,
      assetName,
      assetDescription
    );

    expect(asset.name).to.equal(assetName);
    expect(asset.description).to.equal(assetDescription);

    expect(
      await Fs.pathExists(
        util.pathTo.assetConfig(project.id, asset.id, asset.language)
      )
    ).to.be.true;
    expect(
      await Fs.pathExists(
        util.pathTo.assetFile(
          project.id,
          asset.id,
          asset.language,
          asset.extension
        )
      )
    ).to.be.true;
  });

  it('read', async () => {
    const project = await core.projects.create(
      'Project #1',
      'The first project'
    );
    const asset = await core.assets.create(
      assetFilePath,
      project.id,
      assetLanguage,
      assetName,
      assetDescription
    );

    const readAsset = await core.assets.read(
      project.id,
      asset.id,
      asset.language
    );

    expect(readAsset.name).to.equal(assetName);
    expect(readAsset.description).to.equal(assetDescription);
  });

  it('update', async () => {
    const project = await core.projects.create(
      'Project #1',
      'The first project'
    );
    const asset = await core.assets.create(
      assetFilePath,
      project.id,
      assetLanguage,
      assetName,
      assetDescription
    );

    asset.description = 'Updated';
    await core.assets.update(project.id, asset);
    const updatedAsset = await core.assets.read(
      project.id,
      asset.id,
      asset.language
    );
    expect(updatedAsset.description).to.equal('Updated');

    asset.description = assetDescription;
    await core.assets.update(project.id, asset);
    const updatedAsset2 = await core.assets.read(
      project.id,
      asset.id,
      asset.language
    );
    expect(updatedAsset2.description).to.equal(assetDescription);
  });

  it('delete', async () => {
    const project = await core.projects.create(
      'Project #1',
      'The first project'
    );
    const asset = await core.assets.create(
      assetFilePath,
      project.id,
      assetLanguage,
      assetName,
      assetDescription
    );

    await core.assets.delete(
      project.id,
      asset.id,
      asset.language,
      asset.extension
    );

    expect(
      await Fs.pathExists(
        util.pathTo.assetConfig(project.id, asset.id, asset.language)
      )
    ).to.be.false;
    expect(
      await Fs.pathExists(
        util.pathTo.assetFile(
          project.id,
          asset.id,
          asset.language,
          asset.extension
        )
      )
    ).to.be.false;
  });
});
