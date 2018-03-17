#!/usr/bin/env python
import os
import shutil
import tempfile

if __name__ == '__main__':
    print('creating deployable zip...')

    temp = os.path.join(tempfile.gettempdir(), 'swot')
    output = os.path.join('..', 'build', 'build.zip')

    if os.path.exists(output):
        print('output file exists.  deleting \'' + output + '\'')
        os.remove(output)

    print ('creating zip in \'' + temp + '\'')
    shutil.make_archive(temp, 'zip', '../')

    print('copying \'' + temp + '\' to \'' + output + '\'')
    shutil.move(temp + '.zip', output)

    print('build succeeded.')