import { xlayer} from './src/projects/layer2s/xlayer';
import { astarzkevm } from './src/projects/layer2s/astarzkevm';
import { polygonzkevm } from './src/projects/layer2s/polygonzkevm';
import { writeFileSync } from 'fs';

const output = [
    xlayer,
    astarzkevm,
    polygonzkevm,
].map(p => JSON.stringify(p, null, 2)).join('\n\n');

writeFileSync('new.json', output);
