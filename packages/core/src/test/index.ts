import Fs from 'fs-extra';
import ElekIoCore from '../index.js';

async function test() {
    const core = await ElekIoCore.init({
        signature: {
            name: 'John Doe',
            email: 'john.doe@test.com'
        }
    });

    // Start fresh
    Fs.emptyDirSync(core.util.workingDirectory);

    const project = await core.projects.create('Project 1', 'The first project');
}

test();