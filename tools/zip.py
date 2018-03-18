#!/usr/bin/env python
import sys
import os
import shutil
import tempfile
import uuid

if __name__ == '__main__':
    src = os.path.abspath(sys.argv[1])
    dest = os.path.abspath(sys.argv[2])
    temp = os.path.join(tempfile.gettempdir(), 'swot-builds', str(uuid.uuid4()))
    output = os.path.join(dest, 'deploy.zip')

    print('creating deployable zip from ' + src + '...')

    try:
        if os.path.exists(output):
            print('output file exists.  deleting \'' + output + '\'')
            os.remove(output)

        print ('creating zip in \'' + temp + '\'...')
        shutil.make_archive(temp, 'zip', src)

        print('copying \'' + temp + '\' to \'' + output + '\'...')
        shutil.move(temp + '.zip', output)

        print('zip succeeded.')
    except:
        e = sys.exc_info()[0]
        print('error: ' + e)
        print('cleaning up...')

        shutil.rmtree(temp)

        print('zip failed.')