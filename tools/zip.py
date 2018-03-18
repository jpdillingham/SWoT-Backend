#!/usr/bin/env python
import os
import shutil
import tempfile
import uuid

if __name__ == '__main__':
    print('creating deployable zip from app directory...')

    temp = os.path.join(tempfile.gettempdir(), 'swot-builds', str(uuid.uuid4()))
    output = os.path.join('..', 'build', 'deploy.zip')

    if os.path.exists(output):
        print('output file exists.  deleting \'' + output + '\'')
        os.remove(output)

    print ('creating zip in \'' + temp + '\'')
    shutil.make_archive(temp, 'zip', '../')

    print('copying \'' + temp + '\' to \'' + output + '\'')
    shutil.move(temp + '.zip', output)

    print('zip succeeded.')