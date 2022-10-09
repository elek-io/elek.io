#!/bin/bash
#
#   Add package.json files to esm/cjs subtrees
#

cat >dist/esm/package.json <<!EOF
{
    "type": "module"
}
!EOF

cat >dist/cjs/package.json <<!EOF
{
    "type": "commonjs"
}
!EOF

# find src -name '*.d.ts' -exec cp {} dist/esm \;
# find src -name '*.d.ts' -exec cp {} dist/cjs \;